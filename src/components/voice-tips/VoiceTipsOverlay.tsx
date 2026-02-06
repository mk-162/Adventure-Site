'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { 
  X, 
  Mic, 
  Square, 
  Play, 
  Pause,
  Trash2,
  Edit3,
  Check,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  Lightbulb,
  RefreshCw,
  User,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioWaveform, generateWaveformData } from './AudioWaveform';
import { submitComment } from '@/lib/comments';

type OverlayState = 'intro' | 'recording' | 'review' | 'success' | 'rejected' | 'refine';

interface VoiceTipsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  pageSlug: string;
  pageType: string;
  pageName?: string;
  onSuccess?: () => void;
}

const MAX_DURATION = 30; // seconds

export function VoiceTipsOverlay({
  isOpen,
  onClose,
  pageSlug,
  pageType,
  pageName = 'this spot',
  onSuccess,
}: VoiceTipsOverlayProps) {
  const [state, setState] = useState<OverlayState>('intro');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<number[] | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [moderationReason, setModerationReason] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      // Small delay to allow close animation
      setTimeout(() => {
        resetState();
      }, 300);
    }
  }, [isOpen]);

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const resetState = () => {
    cleanup();
    setState('intro');
    setAudioBlob(null);
    setAudioUrl(null);
    setWaveformData(null);
    setAudioStream(null);
    setDuration(0);
    setIsPlaying(false);
    setPlayProgress(0);
    setTitle('');
    setSummary('');
    setIsEditing(false);
    setModerationReason(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Generate waveform data
        try {
          const waveform = await generateWaveformData(blob);
          setWaveformData(waveform);
        } catch (e) {
          console.error('Failed to generate waveform:', e);
        }
        
        stream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
        setState('review');
      };

      mediaRecorder.start();
      setState('recording');
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= MAX_DURATION - 1) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioUrl) return;

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePlaybackTimeUpdate = () => {
    if (!audioPlayerRef.current) return;
    const progress = (audioPlayerRef.current.currentTime / audioPlayerRef.current.duration) * 100;
    setPlayProgress(progress);
  };

  const handlePlaybackEnded = () => {
    setIsPlaying(false);
    setPlayProgress(0);
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setWaveformData(null);
    setDuration(0);
    setState('intro');
  };

  const handleSubmit = async (anonymous: boolean = false) => {
    if (!audioBlob) return;

    setIsSubmitting(true);

    try {
      const file = new File([audioBlob], 'voice-tip.webm', { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('pageSlug', pageSlug);
      formData.append('pageType', pageType);
      formData.append('duration', duration.toString());
      formData.append('publishAnonymously', anonymous.toString());
      
      if (waveformData) {
        formData.append('waveformData', JSON.stringify(waveformData));
      }

      const result = await submitComment(null, formData);

      if (result.success) {
        setTitle(result.title || 'Your Voice Tip');
        setSummary(result.summary || '');
        
        if (result.status === 'refine') {
          setModerationReason(result.moderationReason || null);
          setState('refine');
        } else {
          setState('success');
          if (onSuccess) onSuccess();
        }
      } else {
        if (result.status === 'rejected') {
          setModerationReason(result.moderationReason || null);
          setState('rejected');
        } else {
          alert(result.message || 'Failed to submit tip');
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit tip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  // Use portal for overlay
  const overlayContent = (
    <div 
      className="voice-tips-overlay fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && state !== 'recording') {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[580px] bg-white rounded-2xl shadow-2xl overflow-hidden voice-tips-zoom-in my-auto">
        {/* Colored Header Bar */}
        <div className={clsx(
          'h-2 w-full',
          state === 'rejected' ? 'bg-orange-500' : 'bg-gradient-to-r from-primary to-primary-light'
        )} />

        {state === 'intro' && (
          <IntroState 
            onClose={onClose} 
            onStart={startRecording} 
          />
        )}

        {state === 'recording' && (
          <RecordingState
            duration={duration}
            maxDuration={MAX_DURATION}
            audioStream={audioStream}
            onStop={stopRecording}
            onCancel={deleteRecording}
          />
        )}

        {state === 'review' && (
          <ReviewState
            audioUrl={audioUrl}
            waveformData={waveformData}
            duration={duration}
            isPlaying={isPlaying}
            playProgress={playProgress}
            title={title}
            summary={summary}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            onTogglePlay={togglePlayback}
            onDelete={deleteRecording}
            onEdit={() => setIsEditing(true)}
            onSaveEdit={(t, s) => { setTitle(t); setSummary(s); setIsEditing(false); }}
            onCancelEdit={() => setIsEditing(false)}
            onSubmit={handleSubmit}
            onClose={onClose}
            audioRef={audioPlayerRef}
            onTimeUpdate={handlePlaybackTimeUpdate}
            onEnded={handlePlaybackEnded}
          />
        )}

        {state === 'success' && (
          <SuccessState
            pageName={pageName}
            onDone={onClose}
          />
        )}

        {state === 'rejected' && (
          <RejectedState
            reason={moderationReason}
            onClose={onClose}
          />
        )}

        {state === 'refine' && (
          <RefineState
            reason={moderationReason}
            onReRecord={() => {
              deleteRecording();
              setState('intro');
            }}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? createPortal(overlayContent, document.body) 
    : null;
}

// ===== State Components =====

function IntroState({ 
  onClose, 
  onStart 
}: { 
  onClose: () => void; 
  onStart: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex justify-center pt-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Check className="w-4 h-4" />
          No account needed
        </span>
      </div>

      <div className="flex items-center justify-between px-8 pt-4 pb-2">
        <h2 className="text-2xl font-bold text-slate-900">How Voice Tips Work</h2>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Steps */}
      <div className="px-8 py-6 space-y-5">
        <Step 
          icon={<Mic className="w-6 h-6" />}
          iconBg="bg-accent/10 text-accent"
          title="1. Leave a voicemail"
        />
        <Step 
          icon={<Eye className="w-6 h-6" />}
          iconBg="bg-primary/10 text-primary"
          title="2. Preview summary before publishing"
        />
        <Step 
          icon={<User className="w-6 h-6" />}
          iconBg="bg-primary/10 text-primary"
          title="3. Share with the community"
        />
      </div>

      {/* Actions */}
      <div className="px-8 pb-8 pt-2">
        <Button
          onClick={onStart}
          fullWidth
          className="h-14 text-lg gap-2 bg-accent hover:bg-accent-hover shadow-lg"
        >
          <Mic className="w-6 h-6" />
          Start Recording
        </Button>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-slate-600 leading-relaxed">
                Your recordings are private until published and can be deleted at any time.
              </p>
              <a 
                href="/privacy" 
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1 w-fit"
              >
                Privacy & Moderation
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Step({ 
  icon, 
  iconBg, 
  title 
}: { 
  icon: React.ReactNode; 
  iconBg: string; 
  title: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <div className={clsx(
        'flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center',
        iconBg
      )}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    </div>
  );
}

function RecordingState({
  duration,
  maxDuration,
  audioStream,
  onStop,
  onCancel,
}: {
  duration: number;
  maxDuration: number;
  audioStream: MediaStream | null;
  onStop: () => void;
  onCancel: () => void;
}) {
  const remaining = maxDuration - duration;
  const isWarning = remaining <= 5;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-2">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center h-8 w-8 bg-red-50 rounded-full">
            <div className="h-3 w-3 rounded-full bg-red-500 voice-tips-pulse-recording" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Recording Tip</h2>
        </div>
        <button 
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
          aria-label="Cancel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-8 pb-8 pt-6 flex flex-col items-center">
        <p className="text-lg text-slate-600 text-center mb-8 max-w-sm leading-relaxed">
          Tell us your best tip for this spot...<br/>
          <span className="font-semibold text-primary">Speak naturally!</span>
        </p>

        {/* Waveform */}
        <div className="w-full mb-8 voice-tips-waveform rounded-2xl p-4">
          <AudioWaveform
            mode="recording"
            audioStream={audioStream}
            height={120}
            barCount={30}
          />
        </div>

        {/* Timer */}
        <div className="mb-8 flex flex-col items-center gap-1">
          <span className={clsx(
            'text-5xl font-bold tabular-nums tracking-tighter',
            isWarning ? 'text-red-500 voice-tips-countdown-warning' : 'text-slate-900'
          )}>
            {formatTime(duration)}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {remaining}s remaining
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 w-full">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-14"
          >
            Cancel
          </Button>
          <Button
            onClick={onStop}
            className="flex-[2] h-14 bg-gradient-to-r from-primary to-primary-light gap-2"
          >
            <div className="p-1 bg-white/20 rounded-md">
              <Square className="w-5 h-5" fill="currentColor" />
            </div>
            Stop Recording
          </Button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-slate-50 border-t border-slate-100 px-8 py-5 flex items-start gap-4">
        <Lock className="w-5 h-5 text-primary mt-0.5" />
        <p className="text-sm leading-relaxed text-slate-500 font-medium">
          Your recording is private until published. AI will summarize your audio to help travelers discover key insights.
        </p>
      </div>
    </>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function ReviewState({
  audioUrl,
  waveformData,
  duration,
  isPlaying,
  playProgress,
  title,
  summary,
  isEditing,
  isSubmitting,
  onTogglePlay,
  onDelete,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onSubmit,
  onClose,
  audioRef,
  onTimeUpdate,
  onEnded,
}: {
  audioUrl: string | null;
  waveformData: number[] | null;
  duration: number;
  isPlaying: boolean;
  playProgress: number;
  title: string;
  summary: string;
  isEditing: boolean;
  isSubmitting: boolean;
  onTogglePlay: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onSaveEdit: (title: string, summary: string) => void;
  onCancelEdit: () => void;
  onSubmit: (anonymous: boolean) => void;
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onTimeUpdate: () => void;
  onEnded: () => void;
}) {
  const [editTitle, setEditTitle] = useState(title);
  const [editSummary, setEditSummary] = useState(summary);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Review your tip</h2>
          <p className="text-xs text-slate-500 mt-1">Make sure everything sounds perfect before publishing.</p>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-2 -mr-2 rounded-full hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-8 py-6">
        {/* Audio Player */}
        <div className="bg-white rounded-2xl p-4 flex items-center gap-5 mb-6 shadow-sm border border-slate-100">
          <button
            onClick={onTogglePlay}
            className="size-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-all"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7 ml-1" fill="currentColor" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Recorded Audio</span>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2 cursor-pointer">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-100"
                style={{ width: `${playProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs font-semibold text-slate-900">
                {formatTime(Math.floor((playProgress / 100) * duration))}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-100 mx-1" />
          
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete recording"
            aria-label="Delete recording"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* AI Summary (shown before submission as placeholder) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              AI Summary & Title
            </label>
            {!isEditing && !isSubmitting && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-wide transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Text
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Title"
              />
              <textarea
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                rows={3}
                placeholder="Summary"
              />
              <div className="flex gap-2">
                <Button
                  onClick={onCancelEdit}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSaveEdit(editTitle, editSummary)}
                  size="sm"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm hover:bg-white transition-all">
              <p className="text-slate-400 text-sm italic">
                Your tip will be transcribed and summarized by AI after submission...
              </p>
            </div>
          )}
        </div>

        {/* Claim Tip Notice */}
        <div className="bg-accent/5 border border-accent/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <div className="bg-white rounded-full p-1 text-primary shadow-sm">
                <User className="w-5 h-5" />
              </div>
              Claim your tip
            </h4>
            <Button
              variant="secondary"
              size="sm"
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              Login / Sign Up
            </Button>
          </div>
          <p className="text-sm text-slate-600 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <span className="leading-snug text-xs sm:text-sm">
              If you don't log in, you won't be able to edit or delete this tip after it's published.
            </span>
          </p>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => onSubmit(false)}
            disabled={isSubmitting}
            className="h-14 text-lg gap-2.5 bg-primary hover:bg-primary-dark shadow-lg"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                Publish to My Profile
              </>
            )}
          </Button>
          <Button
            onClick={() => onSubmit(true)}
            disabled={isSubmitting}
            variant="outline"
            className="h-14 text-lg gap-2.5"
          >
            <EyeOff className="w-5 h-5" />
            Publish Anonymously
          </Button>
        </div>
      </div>

      {/* Hidden Audio */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          className="hidden"
        />
      )}
    </>
  );
}

function SuccessState({
  pageName,
  onDone,
}: {
  pageName: string;
  onDone: () => void;
}) {
  return (
    <div className="p-8 flex flex-col text-center">
      <div className="mx-auto mb-6 voice-tips-success-icon">
        <CheckCircle className="w-16 h-16 text-primary" />
      </div>
      
      <div className="space-y-3 mb-8">
        <h1 className="text-slate-900 tracking-tight text-2xl md:text-3xl font-extrabold leading-tight">
          Your tip is live!
        </h1>
        <p className="text-slate-500 text-base font-medium leading-relaxed">
          Thanks for sharing! Your voice tip for <span className="font-bold text-primary">{pageName}</span> has been posted to the feed.
        </p>
      </div>

      <div className="space-y-4 text-left">
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-slate-700 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Want more control?</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Logged-in users can edit or delete their tips at any time. Create a profile to manage your contributions.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50/80 border border-orange-100 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-slate-900 font-bold text-xs uppercase tracking-wide">Posting Anonymously</p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              You won't be able to edit or remove this tip once you leave this page.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        <Button
          onClick={onDone}
          variant="outline"
          className="order-2 sm:order-1 h-11"
        >
          Done
        </Button>
        <Button
          className="order-1 sm:order-2 h-11 bg-primary hover:bg-primary-dark shadow-lg"
        >
          Log in / Sign up
        </Button>
      </div>
    </div>
  );
}

function RejectedState({
  reason,
  onClose,
}: {
  reason: string | null;
  onClose: () => void;
}) {
  return (
    <div className="p-8 flex flex-col items-center text-center">
      <div className="mb-6 flex items-center justify-center size-16 rounded-full bg-orange-50 text-orange-500">
        <AlertTriangle className="w-9 h-9" />
      </div>
      
      <h2 className="text-slate-900 text-2xl font-bold leading-tight mb-4">
        Content not published
      </h2>
      
      <div className="space-y-6 w-full">
        <p className="text-slate-600 text-base leading-relaxed px-2">
          We couldn't publish this recording because it doesn't follow our community guidelines regarding appropriate and helpful content.
        </p>
        
        {reason && (
          <div className="w-full bg-slate-100 rounded-lg p-5 text-left border-l-4 border-slate-300">
            <p className="text-slate-700 text-sm font-medium leading-relaxed">
              {reason}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 w-full flex flex-col gap-3">
        <Button
          onClick={onClose}
          className="h-12 bg-orange-500 hover:bg-orange-600"
        >
          Close
        </Button>
        <a 
          href="/guidelines"
          className="inline-flex items-center justify-center gap-1 text-slate-500 text-sm font-medium hover:text-orange-500 transition-colors py-2 group"
        >
          View Community Guidelines
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      <div className="mt-6 flex justify-center items-center gap-2 text-slate-400">
        <Lock className="w-4 h-4" />
        <p className="text-xs font-semibold uppercase tracking-widest">
          Automated Content Moderation
        </p>
      </div>
    </div>
  );
}

function RefineState({
  reason,
  onReRecord,
  onCancel,
}: {
  reason: string | null;
  onReRecord: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="p-8 md:p-10">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center shadow-sm">
          <Mic className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-4 mb-8">
        <h1 className="text-slate-900 text-[26px] font-bold leading-tight tracking-tight">
          Let's refine your tip
        </h1>
        <p className="text-slate-500 text-[15px] leading-relaxed max-w-[460px] mx-auto">
          Thanks for sharing! To make sure your tip is as helpful as possible for other travelers,
          our moderator suggests focusing more on{' '}
          <span className="text-slate-800 font-semibold underline decoration-primary/40 decoration-2 underline-offset-2">
            specific advice or locations
          </span>{' '}
          rather than general comments.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="bg-white text-primary rounded-xl p-2.5 shrink-0 shadow-sm border border-slate-100">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-slate-900 text-base font-bold">Why focus on specifics?</p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Advice like <span className="italic text-slate-700">"The best view is from the north gate at sunset"</span>{' '}
              provides more value than <span className="italic text-slate-700">"It's a nice place"</span>.
            </p>
            {reason && (
              <p className="text-slate-600 text-sm leading-relaxed mt-2 p-3 bg-white rounded-lg border border-slate-100">
                <strong>Specific feedback:</strong> {reason}
              </p>
            )}
            <a 
              href="/guidelines"
              className="mt-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-primary hover:text-primary-dark transition-colors group"
            >
              See guidelines
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 h-12"
        >
          Cancel
        </Button>
        <Button
          onClick={onReRecord}
          className="flex-[1.5] h-12 gap-2"
        >
          <Mic className="w-5 h-5" />
          Re-record Tip
        </Button>
      </div>

      <p className="text-center text-slate-400 text-xs mt-6 font-medium">
        Don't worry, your draft is saved.
      </p>
    </div>
  );
}
