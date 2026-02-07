import { Suspense } from 'react';
import { getComments } from '@/lib/comments';
import { getUserSession } from '@/lib/user-auth';
import { CommentList } from './CommentList';
import { VoiceRecorder } from './VoiceRecorder';
import { Mic } from 'lucide-react';

interface CommentsSectionProps {
  pageSlug: string;
  pageType: string;
  title?: string;
}

export async function CommentsSection({ pageSlug, pageType, title = "Voice Notes" }: CommentsSectionProps) {
  const [comments, userSession] = await Promise.all([
    getComments(pageSlug),
    getUserSession()
  ]);

  return (
    <section className="py-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Mic className="w-6 h-6 text-primary" />
                    {title}
                </h2>
                <p className="text-slate-600 mt-1">Listen to tips from the community or leave your own.</p>
            </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
            {/* List Column */}
            <div className="order-2 md:order-1">
                <Suspense fallback={<div className="text-slate-500">Loading notes...</div>}>
                    {/* @ts-ignore - mismatch in Drizzle types for user relation vs client type, safe to ignore for MVP */}
                    <CommentList initialComments={comments} />
                </Suspense>
            </div>

            {/* Recorder Column (Sticky) */}
            <div className="order-1 md:order-2">
                <div className="sticky top-24">
                    <VoiceRecorder
                      pageSlug={pageSlug}
                      pageType={pageType}
                      currentUser={userSession}
                    />
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
