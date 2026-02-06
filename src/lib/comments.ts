'use server';

import { OpenAI } from "openai";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { comments, commentVotes } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getUserSession } from "@/lib/user-auth";

// Initialize OpenAI
// Note: This relies on OPENAI_API_KEY being present in environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type CommentStatus = 'pending' | 'approved' | 'rejected';

export async function processAudio(formData: FormData) {
  const file = formData.get("audio") as File;
  if (!file) {
    throw new Error("No audio file provided");
  }

  // 1. Upload to Vercel Blob (permanent storage for playback)
  // We do this first so we have a URL to save to the DB
  const blob = await put(`comments/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  // 2. Transcribe using OpenAI Whisper
  // We need to send the file to OpenAI.
  // Since we have the File object from FormData, we can pass it directly.
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: "whisper-1",
  });

  return {
    audioUrl: blob.url,
    transcript: transcription.text,
  };
}

export async function moderateAndSummarize(text: string) {
  const prompt = `
    You are a moderator for an adventure activity website.
    You have received a user comment: "${text}"

    Tasks:
    1. Status: Is this comment appropriate? (No hate speech, no spam, no competitor bashing).
       - Return 'approved' if good.
       - Return 'rejected' if bad.
    2. Summary: Summarize the comment into a punchy, engaging caption (max 140 chars).
       - Fix grammar/stuttering.
       - Keep the original sentiment.

    Output JSON format: { "status": "approved" | "rejected", "summary": "string" }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o", // or gpt-3.5-turbo if cost is a major concern, but 4o is better at following JSON constraints
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No AI response");

  return JSON.parse(content) as { status: CommentStatus, summary: string };
}

export async function submitComment(prevState: any, formData: FormData) {
  try {
    const audioFile = formData.get("audio") as File;
    const pageSlug = formData.get("pageSlug") as string;
    const pageType = formData.get("pageType") as string;

    // Get Session ID (spam protection) & User Session
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("aw_session_id")?.value;

    // Create anonymous session if missing
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    // Check for logged in user
    const userSession = await getUserSession();
    const userId = userSession?.userId;

    // Check for existing submission on this page by this session
    // (Simple spam protection) - Allow multiple if logged in maybe? keeping strict for now.
    const existing = await db.query.comments.findFirst({
        where: and(
            eq(comments.pageSlug, pageSlug),
            eq(comments.sessionId, sessionId)
        )
    });

    if (existing) {
        return { success: false, message: "You have already left a comment on this page." };
    }

    // 1. Process Audio & Transcribe (Server-Side Whisper)
    const { audioUrl, transcript } = await processAudio(formData);

    // 2. Moderate & Summarize (GPT)
    const { status, summary } = await moderateAndSummarize(transcript);

    // 3. Save to DB
    await db.insert(comments).values({
      pageSlug,
      pageType,
      sessionId,
      userId: userId || null, // Link to user if logged in
      audioUrl,
      transcript,
      summary,
      status,
      votes: 0,
    });

    revalidatePath(`/${pageType === 'activity' ? 'activities' : pageType === 'operator' ? 'directory' : 'advertise'}/${pageSlug}`);

    if (status === 'rejected') {
        return { success: true, status: 'rejected', message: "Comment received but flagged by moderation." };
    }

    return { success: true, status: 'approved', message: "Comment posted successfully!" };

  } catch (error) {
    console.error("Submit comment error:", error);
    return { success: false, message: "Failed to process comment. Please try again." };
  }
}

export async function getComments(pageSlug: string) {
  return await db.query.comments.findMany({
    where: and(
      eq(comments.pageSlug, pageSlug),
      eq(comments.status, 'approved')
    ),
    orderBy: (comments, { desc }) => [desc(comments.votes), desc(comments.createdAt)],
    with: {
      user: true, // Fetch user details
    }
  });
}

export async function voteForComment(commentId: number) {
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

      await tx.update(comments)
        .set({ votes: sql`${comments.votes} + 1` })
        .where(eq(comments.id, commentId));
    });

    return { success: true };
  } catch (error) {
    console.error("Voting error:", error);
    return { success: false, message: "Failed to vote" };
  }
}
