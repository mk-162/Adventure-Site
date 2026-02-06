'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { Play, Pause, ThumbsUp, ThumbsDown, Clock, User } from 'lucide-react';
import { voteForComment, type VoiceTip } from '@/lib/comments';
import { CompactWaveform } from './AudioWaveform';

interface VoiceTipCardProps {
  tip: VoiceTip;
  isActive?: boolean;
  onPlay?: (tipId: number) => void;
  onPause?: () => void;
  className?: string;
}

const PLAYBACK_SPEEDS = [1, 1.5, 2] as const;

export function VoiceTipCard({
  tip,
  isActive = false,
  onPlay,
  onPause,
  className,
}: VoiceTipCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<typeof PLAYBACK_SPEEDS[number]>(1);
  const [votes, setVotes] = useState(tip.votes);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  // Format duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle audio time update
  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    setProgress(progressPercent);
    setCurrentTime(audio.currentTime);
  }, []);

  // Handle audio end
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (onPause) onPause();
  }, [onPause]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !tip.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      if (onPlay) onPlay(tip.id);
    }
  }, [isPlaying, tip.id, tip.audioUrl, onPlay, onPause]);

  // Handle playback speed change
  const cycleSpeed = useCallback(() => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    const newSpeed = PLAYBACK_SPEEDS[nextIndex];
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  }, [playbackSpeed]);

  // Handle voting
  const handleVote = async (type: 'up' | 'down') => {
    if (type === 'up' && hasVoted) return;
    if (type === 'down' && hasDownvoted) return;

    // Optimistic update
    if (type === 'up') {
      setVotes(prev => prev + 1);
      setHasVoted(true);
    } else {
      setHasDownvoted(true);
    }

    const result = await voteForComment(tip.id, type);
    
    if (!result.success) {
      // Revert on failure
      if (type === 'up') {
        setVotes(prev => prev - 1);
        setHasVoted(false);
      } else {
        setHasDownvoted(false);
      }
    }
  };

  // Pause when another card becomes active
  useEffect(() => {
    if (!isActive && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const displayDuration = tip.duration || 30;
  const displayAuthor = tip.authorName || 'Anonymous';
  const initials = displayAuthor
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={clsx(
        'voice-tips-card bg-white rounded-xl border p-4 transition-all duration-200',
        isPlaying ? 'border-primary/30 shadow-md ring-2 ring-primary/10' : 'border-slate-200 hover:shadow-md',
        className
      )}
    >
      <div className="flex justify-between items-start gap-3">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author */}
          <div className="flex items-center gap-2 mb-2">
            {tip.authorAvatar ? (
              <img
                src={tip.authorAvatar}
                alt={displayAuthor}
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                {tip.authorName ? initials : <User className="w-3 h-3" />}
              </div>
            )}
            <span className="text-xs font-semibold text-slate-500 truncate">
              {displayAuthor}
            </span>
          </div>

          {/* Title */}
          <h4 className={clsx(
            'text-base font-bold leading-snug mb-1 truncate',
            isPlaying ? 'text-primary' : 'text-slate-900'
          )}>
            {tip.title || 'Voice Tip'}
          </h4>

          {/* Playing State: Waveform */}
          {isPlaying ? (
            <div className="flex items-center gap-2 mb-1">
              <CompactWaveform 
                waveformData={tip.waveformData}
                progress={progress}
                isPlaying={isPlaying}
              />
              <span className="text-xs text-primary font-medium">Playing...</span>
            </div>
          ) : null}

          {/* Summary */}
          <p className={clsx(
            'text-sm leading-relaxed text-slate-600',
            isPlaying ? 'line-clamp-1 opacity-70' : 'line-clamp-2'
          )}>
            {tip.summary || tip.transcript || 'No summary available'}
          </p>
        </div>

        {/* Play Button */}
        <button
          onClick={togglePlay}
          className={clsx(
            'voice-tips-play-btn shrink-0 flex items-center justify-center w-10 h-10 rounded-full shadow-md',
            isPlaying
              ? 'bg-white border-2 border-primary text-primary hover:bg-slate-50'
              : 'bg-primary hover:bg-primary-dark text-white'
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
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        {/* Duration / Progress */}
        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium voice-tips-duration-badge">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {isPlaying 
              ? `${formatDuration(currentTime)} / ${formatDuration(displayDuration)}`
              : formatDuration(displayDuration)
            }
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Speed Control (visible when playing) */}
          {isPlaying && (
            <button
              onClick={cycleSpeed}
              className="voice-tips-speed-btn text-xs font-bold text-slate-500 hover:text-primary transition-colors px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
              aria-label={`Playback speed: ${playbackSpeed}x`}
            >
              {playbackSpeed}x
            </button>
          )}

          {/* Upvote */}
          <button
            onClick={() => handleVote('up')}
            className={clsx(
              'voice-tips-vote-btn flex items-center gap-1 text-xs font-medium transition-colors',
              hasVoted ? 'text-primary' : 'text-slate-400 hover:text-primary'
            )}
            disabled={hasVoted}
            aria-label={`Upvote (${votes} votes)`}
          >
            <ThumbsUp 
              className="w-4 h-4" 
              fill={hasVoted ? 'currentColor' : 'none'}
            />
            <span>{votes}</span>
          </button>

          {/* Downvote */}
          <button
            onClick={() => handleVote('down')}
            className={clsx(
              'voice-tips-vote-btn flex items-center gap-1 text-xs font-medium transition-colors',
              hasDownvoted ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
            )}
            disabled={hasDownvoted}
            aria-label="Downvote"
          >
            <ThumbsDown 
              className="w-4 h-4" 
              fill={hasDownvoted ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>

      {/* Hidden Audio Element */}
      {tip.audioUrl && (
        <audio
          ref={audioRef}
          src={tip.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          preload="metadata"
          className="hidden"
        />
      )}
    </div>
  );
}
