import { Suspense } from 'react';
import { getComments } from '@/lib/comments';
import { VoiceTipsList, VoiceTipsListSkeleton } from './VoiceTipsList';

interface VoiceTipsSectionProps {
  pageSlug: string;
  pageType: string;
  pageName?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export async function VoiceTipsSection({ 
  pageSlug, 
  pageType, 
  pageName,
  title = "Voice Tips",
  subtitle = "Hear tips from adventurers who've been here.",
  className,
}: VoiceTipsSectionProps) {
  const tips = await getComments(pageSlug);

  return (
    <section className={className}>
      <VoiceTipsList
        tips={tips}
        pageSlug={pageSlug}
        pageType={pageType}
        pageName={pageName}
        title={title}
        subtitle={subtitle}
      />
    </section>
  );
}

// Loading state wrapper
export function VoiceTipsSectionLoading() {
  return (
    <section>
      <VoiceTipsListSkeleton count={3} />
    </section>
  );
}

// Suspense wrapper for use in pages
export function VoiceTipsSectionSuspense(props: VoiceTipsSectionProps) {
  return (
    <Suspense fallback={<VoiceTipsSectionLoading />}>
      <VoiceTipsSection {...props} />
    </Suspense>
  );
}
