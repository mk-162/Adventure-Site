import { Suspense } from 'react';
import { getComments } from '@/lib/comments';
import { CommentList } from './CommentList';
import { VoiceRecorder } from './VoiceRecorder';
import { Mic } from 'lucide-react';

interface CommentsSectionProps {
  pageSlug: string;
  pageType: string;
  title?: string;
  subtitle?: string;
}

export async function CommentsSection({ 
  pageSlug, 
  pageType, 
  title = "Local Tips",
  subtitle = "Hear tips from the community or leave your own."
}: CommentsSectionProps) {
  const comments = await getComments(pageSlug);

  return (
    <section className="py-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Mic className="w-6 h-6 text-amber-600" />
                    {title}
                </h2>
                <p className="text-slate-600 mt-1">{subtitle}</p>
            </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
            {/* List Column */}
            <div className="order-2 md:order-1">
                <Suspense fallback={<div className="text-slate-500">Loading notes...</div>}>
                    <CommentList initialComments={comments} />
                </Suspense>
            </div>

            {/* Recorder Column (Sticky) */}
            <div className="order-1 md:order-2">
                <div className="sticky top-24">
                    <VoiceRecorder pageSlug={pageSlug} pageType={pageType} />
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
