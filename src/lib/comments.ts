'use server';

import { OpenAI } from "openai";
import { db } from "@/db";
import { comments, commentVotes } from "@/db/schema";
import { eq, and, sql, desc, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { writeFile } from "fs/promises";
import path from "path";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type CommentStatus = 'pending' | 'approved' | 'rejected';

export type ModerationResult = {
  status: CommentStatus;
  summary: string;
  title: string;
  moderationReason?: string;
  needsRefinement?: boolean;
};

export interface VoiceTip {
  id: number;
  pageSlug: string;
  pageType: string;
  userId: number | null;
  sessionId: string | null;
  parentId: number | null;
  audioUrl: string | null;
  transcript: string | null;
  summary: string | null;
  title: string | null;
  duration: number | null;
  authorName: string | null;
  authorAvatar: string | null;
  waveformData: number[] | null;
  status: CommentStatus;
  votes: number;
  downvotes: number;
  moderationReason: string | null;
  createdAt: Date;
}

// Use Vercel Blob in production, local storage in dev
async function uploadAudio(file: File): Promise<string> {
  const filename = `${Date.now()}-${file.name}`;
  
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production: Use Vercel Blob
    const { put } = await import("@vercel/blob");
    const blob = await put(`comments/${filename}`, file, { access: 'public' });
    return blob.url;
  } else {
    // Dev: Save to local public folder
    const buffer = Buffer.from(await file.arrayBuffer());
    const localPath = path.join(process.cwd(), 'public', 'audio-comments', filename);
    await writeFile(localPath, buffer);
    return `/audio-comments/${filename}`;
  }
}

export async function processAudio(formData: FormData) {
  const file = formData.get("audio") as File;
  if (!file) {
    throw new Error("No audio file provided");
  }

  // 1. Upload audio (Blob or local)
  const audioUrl = await uploadAudio(file);

  // 2. Transcribe using OpenAI Whisper
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: "whisper-1",
  });

  return {
    audioUrl: audioUrl,
    transcript: transcription.text,
  };
}

export async function moderateAndSummarize(text: string): Promise<ModerationResult> {
  const prompt = `
You are a moderator for an adventure activity website (Adventure Wales).
You have received a user voice tip: "${text}"

Tasks:
1. Status: Is this comment appropriate? (No hate speech, no spam, no competitor bashing, no personal attacks).
   - Return 'approved' if good.
   - Return 'rejected' if clearly violates guidelines.
   - If the content is borderline or could be improved, still return 'approved' but set needsRefinement to true.

2. Title: Generate a catchy, concise title (max 50 chars) that captures the essence of the tip.
   - Be creative and engaging.
   - Examples: "Hidden Sunset Spot", "Best Gear for Beginners", "Avoid This Trail in Winter"

3. Summary: Summarize the comment into a punchy, engaging caption (max 200 chars).
   - Fix grammar/stuttering from speech.
   - Keep the original sentiment and key insights.
   - Make it helpful for other adventurers.

4. If rejected or needs refinement, provide a polite moderationReason explaining why.

Output JSON format: 
{ 
  "status": "approved" | "rejected", 
  "title": "string",
  "summary": "string",
  "needsRefinement": boolean,
  "moderationReason": "string" | null
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No AI response");

  return JSON.parse(content) as ModerationResult;
}

export async function submitComment(prevState: any, formData: FormData) {
  try {
    const audioFile = formData.get("audio") as File;
    const pageSlug = formData.get("pageSlug") as string;
    const pageType = formData.get("pageType") as string;
    const duration = parseInt(formData.get("duration") as string) || null;
    const waveformData = formData.get("waveformData") as string;
    const authorName = formData.get("authorName") as string || null;
    const publishAnonymously = formData.get("publishAnonymously") === "true";

    // Get Session ID (spam protection)
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("aw_session_id")?.value;

    // Create session if missing
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    // Check for existing submission on this page by this session
    const existing = await db.query.comments.findFirst({
      where: and(
        eq(comments.pageSlug, pageSlug),
        eq(comments.sessionId, sessionId)
      )
    });

    if (existing) {
      return { success: false, message: "You have already left a tip on this page." };
    }

    // 1. Process Audio & Transcribe
    const { audioUrl, transcript } = await processAudio(formData);

    // 2. Moderate & Summarize
    const { status, title, summary, needsRefinement, moderationReason } = await moderateAndSummarize(transcript);

    // Parse waveform data
    let parsedWaveform: number[] | null = null;
    if (waveformData) {
      try {
        parsedWaveform = JSON.parse(waveformData);
      } catch (e) {
        console.error("Failed to parse waveform data:", e);
      }
    }

    // 3. Save to DB
    const [newComment] = await db.insert(comments).values({
      pageSlug,
      pageType,
      sessionId,
      audioUrl,
      transcript,
      summary,
      title,
      duration,
      authorName: publishAnonymously ? null : authorName,
      waveformData: parsedWaveform,
      status,
      moderationReason,
      votes: 0,
      downvotes: 0,
    }).returning();

    // Revalidate the page
    const pathMap: Record<string, string> = {
      activity: 'activities',
      operator: 'directory',
      advertise: 'advertise',
    };
    const basePath = pathMap[pageType] || pageType;
    revalidatePath(`/${basePath}/${pageSlug}`);

    if (status === 'rejected') {
      return { 
        success: false, 
        status: 'rejected', 
        message: moderationReason || "Content not published due to community guidelines.",
        moderationReason,
      };
    }

    if (needsRefinement) {
      return {
        success: true,
        status: 'refine',
        message: "Your tip was posted, but could be improved.",
        moderationReason,
        tipId: newComment.id,
        title,
        summary,
      };
    }

    return { 
      success: true, 
      status: 'approved', 
      message: "Tip posted successfully!",
      tipId: newComment.id,
      title,
      summary,
    };

  } catch (error) {
    console.error("Submit comment error:", error);
    return { success: false, message: "Failed to process tip. Please try again." };
  }
}

export async function getComments(pageSlug: string): Promise<VoiceTip[]> {
  const results = await db.query.comments.findMany({
    where: and(
      eq(comments.pageSlug, pageSlug),
      eq(comments.status, 'approved')
    ),
    orderBy: [desc(comments.votes), desc(comments.createdAt)],
  });
  
  return results.map(c => ({
    ...c,
    waveformData: c.waveformData as number[] | null,
    status: c.status as CommentStatus,
  }));
}

export async function getTopTips(limit: number = 5): Promise<VoiceTip[]> {
  // Get top tips from the past week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const results = await db.query.comments.findMany({
    where: and(
      eq(comments.status, 'approved'),
      gte(comments.createdAt, oneWeekAgo)
    ),
    orderBy: [desc(comments.votes), desc(comments.createdAt)],
    limit,
  });

  return results.map(c => ({
    ...c,
    waveformData: c.waveformData as number[] | null,
    status: c.status as CommentStatus,
  }));
}

export async function voteForComment(commentId: number, voteType: 'up' | 'down' = 'up') {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("aw_session_id")?.value;

  if (!sessionId) return { success: false, message: "No session found" };

  try {
    // Check if already voted
    const existingVote = await db.query.commentVotes.findFirst({
      where: and(
        eq(commentVotes.commentId, commentId),
        eq(commentVotes.sessionId, sessionId)
      ),
    });

    if (existingVote) {
      return { success: false, message: "Already voted" };
    }

    // Record vote
    await db.transaction(async (tx) => {
      await tx.insert(commentVotes).values({
        commentId,
        sessionId: sessionId!,
      });

      if (voteType === 'up') {
        await tx.update(comments)
          .set({ votes: sql`${comments.votes} + 1` })
          .where(eq(comments.id, commentId));
      } else {
        await tx.update(comments)
          .set({ downvotes: sql`${comments.downvotes} + 1` })
          .where(eq(comments.id, commentId));
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Voting error:", error);
    return { success: false, message: "Failed to vote" };
  }
}

export async function updateTipSummary(tipId: number, newTitle: string, newSummary: string) {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("aw_session_id")?.value;

  if (!sessionId) return { success: false, message: "No session found" };

  try {
    // Verify ownership
    const tip = await db.query.comments.findFirst({
      where: and(
        eq(comments.id, tipId),
        eq(comments.sessionId, sessionId)
      ),
    });

    if (!tip) {
      return { success: false, message: "Tip not found or you don't have permission to edit" };
    }

    await db.update(comments)
      .set({ 
        title: newTitle,
        summary: newSummary,
      })
      .where(eq(comments.id, tipId));

    return { success: true };
  } catch (error) {
    console.error("Update tip error:", error);
    return { success: false, message: "Failed to update tip" };
  }
}

export async function deleteTip(tipId: number) {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("aw_session_id")?.value;

  if (!sessionId) return { success: false, message: "No session found" };

  try {
    // Verify ownership
    const tip = await db.query.comments.findFirst({
      where: and(
        eq(comments.id, tipId),
        eq(comments.sessionId, sessionId)
      ),
    });

    if (!tip) {
      return { success: false, message: "Tip not found or you don't have permission to delete" };
    }

    // Delete votes first (foreign key constraint)
    await db.delete(commentVotes).where(eq(commentVotes.commentId, tipId));
    
    // Delete the tip
    await db.delete(comments).where(eq(comments.id, tipId));

    return { success: true };
  } catch (error) {
    console.error("Delete tip error:", error);
    return { success: false, message: "Failed to delete tip" };
  }
}
