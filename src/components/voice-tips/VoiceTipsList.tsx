'use client';

import { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { AudioLines, Mic, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceTipCard } from './VoiceTipCard';
import { VoiceTipsOverlay } from './VoiceTipsOverlay';
import type { VoiceTip } from '@/lib/comments';

interface VoiceTipsListProps {
  tips: VoiceTip[];
  pageSlug: string;
  pageType: string;
  pageName?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  maxHeight?: string;
  onTipAdded?: () => void;
}

export function VoiceTipsList({
  tips,
  pageSlug,
  pageType,
  pageName = 'this activity',
  title = 'Voice Tips',
  subtitle = 'Hear advice from real adventurers.',
  className,
  maxHeight = '600px',
  onTipAdded,
}: VoiceTipsListProps) {
  const [activeTipId, setActiveTipId] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const handlePlay = useCallback((tipId: number) => {
    setActiveTipId(tipId);
  }, []);

  const handlePause = useCallback(() => {
    setActiveTipId(null);
  }, []);

  const handleOpenRecorder = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleTipAdded = () => {
    if (onTipAdded) onTipAdded();
  };

  return (
    <>
      <div className={clsx(
        'flex flex-col bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden',
        className
      )}>
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-white z-10">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-slate-900 text-xl font-bold tracking-tight">
              {title}
            </h3>
            <AudioLines className="w-6 h-6 text-primary" />
          </div>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
            {subtitle}
          </p>
          <Button
            onClick={handleOpenRecorder}
            variant="outline"
            fullWidth
            className="group flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary border-primary/20 hover:border-primary/40 transition-all"
          >
            <Mic className="w-5 h-5" />
            <span>Add your tip</span>
          </Button>
        </div>

        {/* Tips List */}
        <div
          className="flex-1 overflow-y-auto voice-tips-list p-4 space-y-4 bg-slate-50/50"
          style={{ maxHeight }}
        >
          {tips.length > 0 ? (
            tips.map((tip) => (
              <VoiceTipCard
                key={tip.id}
                tip={tip}
                isActive={activeTipId === tip.id}
                onPlay={handlePlay}
                onPause={handlePause}
              />
            ))
          ) : (
            <EmptyState pageName={pageName} onAddTip={handleOpenRecorder} />
          )}
        </div>
      </div>

      {/* Recording Overlay */}
      <VoiceTipsOverlay
        isOpen={showOverlay}
        onClose={handleCloseOverlay}
        pageSlug={pageSlug}
        pageType={pageType}
        pageName={pageName}
        onSuccess={handleTipAdded}
      />
    </>
  );
}

// Empty State Component
function EmptyState({ 
  pageName, 
  onAddTip 
}: { 
  pageName: string; 
  onAddTip: () => void;
}) {
  return (
    <div className="voice-tips-empty flex flex-col items-center justify-center py-12 px-6 rounded-xl text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <MessageCircle className="w-8 h-8 text-primary" />
      </div>
      <h4 className="text-slate-800 font-bold text-lg mb-2">
        No tips yet
      </h4>
      <p className="text-slate-500 text-sm mb-6 max-w-[240px]">
        Be the first to share your experience with {pageName}!
      </p>
      <Button
        onClick={onAddTip}
        variant="primary"
        size="sm"
        className="gap-2"
      >
        <Mic className="w-4 h-4" />
        Record the first tip
      </Button>
    </div>
  );
}

// Loading Skeleton
export function VoiceTipsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      {/* Header Skeleton */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 w-32 voice-tips-skeleton rounded" />
          <div className="h-6 w-6 voice-tips-skeleton rounded" />
        </div>
        <div className="h-4 w-48 voice-tips-skeleton rounded mb-4" />
        <div className="h-10 w-full voice-tips-skeleton rounded-full" />
      </div>

      {/* Cards Skeleton */}
      <div className="p-4 space-y-4 bg-slate-50/50">
        {Array(count).fill(0).map((_, i) => (
          <VoiceTipCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function VoiceTipCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full voice-tips-skeleton" />
            <div className="h-3 w-20 voice-tips-skeleton rounded" />
          </div>
          <div className="h-5 w-3/4 voice-tips-skeleton rounded mb-2" />
          <div className="h-4 w-full voice-tips-skeleton rounded mb-1" />
          <div className="h-4 w-2/3 voice-tips-skeleton rounded" />
        </div>
        <div className="w-10 h-10 rounded-full voice-tips-skeleton" />
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-12 voice-tips-skeleton rounded" />
        <div className="flex gap-3">
          <div className="h-4 w-12 voice-tips-skeleton rounded" />
          <div className="h-4 w-6 voice-tips-skeleton rounded" />
        </div>
      </div>
    </div>
  );
}
