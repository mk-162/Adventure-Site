'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Play, Pause, ThumbsUp, AudioLines, Clock, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { VoiceTip } from '@/lib/comments';

interface BestTipsWidgetProps {
  tips: VoiceTip[];
  title?: string;
  className?: string;
}

export function BestTipsWidget({
  tips,
  title = "This Week's Best Tips",
  className,
}: BestTipsWidgetProps) {
  const [playingId, setPlayingId] = useState<number | null>(null);

  if (tips.length === 0) {
    return null;
  }

  return (
    <section className={clsx('py-12', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <AudioLines className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          </div>
          <Link
            href="/tips"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group"
          >
            View all tips
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.slice(0, 5).map((tip, index) => (
            <CompactTipCard
              key={tip.id}
              tip={tip}
              rank={index + 1}
              isPlaying={playingId === tip.id}
              onPlay={() => setPlayingId(tip.id)}
              onPause={() => setPlayingId(null)}
            />
          ))}
        </div>

        {/* Mobile View All Link */}
        <Link
          href="/tips"
          className="sm:hidden mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          View all tips
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

// Compact card design for widget
function CompactTipCard({
  tip,
  rank,
  isPlaying,
  onPlay,
  onPause,
}: {
  tip: VoiceTip;
  rank: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current || !tip.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      onPause();
    } else {
      audioRef.current.play();
      onPlay();
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  const handleEnded = () => {
    setProgress(0);
    onPause();
  };

  // Pause when another tip starts playing
  useEffect(() => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
      setProgress(0);
    }
  }, [isPlaying]);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:30';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get page link based on type
  const getPageLink = () => {
    const typeMap: Record<string, string> = {
      activity: '/activities',
      operator: '/directory',
      advertise: '/advertise',
    };
    const base = typeMap[tip.pageType] || '/activities';
    return `${base}/${tip.pageSlug}`;
  };

  return (
    <div className={clsx(
      'group relative bg-white rounded-2xl border p-5 transition-all duration-200',
      isPlaying 
        ? 'border-primary/30 shadow-lg ring-2 ring-primary/10' 
        : 'border-slate-200 hover:shadow-md hover:border-slate-300'
    )}>
      {/* Rank Badge */}
      <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
        #{rank}
      </div>

      {/* Content */}
      <div className="flex gap-4">
        {/* Play Button */}
        <button
          onClick={togglePlay}
          className={clsx(
            'shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all',
            isPlaying 
              ? 'bg-white border-2 border-primary text-primary' 
              : 'bg-primary text-white hover:bg-primary-dark'
          )}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={!tip.audioUrl}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={clsx(
            'font-bold text-base leading-snug mb-1 line-clamp-1',
            isPlaying ? 'text-primary' : 'text-slate-900'
          )}>
            {tip.title || 'Voice Tip'}
          </h3>
          
          <p className="text-slate-600 text-sm line-clamp-2 mb-3">
            {tip.summary || tip.transcript || 'Listen to this tip...'}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(tip.duration)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              {tip.votes}
            </span>
            <Link 
              href={getPageLink()}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[100px]">{tip.pageSlug.replace(/-/g, ' ')}</span>
            </Link>
          </div>

          {/* Progress Bar (visible when playing) */}
          {isPlaying && (
            <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Hidden Audio */}
      {tip.audioUrl && (
        <audio
          ref={audioRef}
          src={tip.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="hidden"
        />
      )}
    </div>
  );
}

// Server Component wrapper for fetching tips
export async function BestTipsWidgetServer() {
  const { getTopTips } = await import('@/lib/comments');
  const tips = await getTopTips(5);
  
  if (tips.length === 0) {
    return null;
  }

  return <BestTipsWidget tips={tips} />;
}
