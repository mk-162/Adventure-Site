'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitComment } from '@/lib/comments';
import { UserToken } from '@/lib/user-auth';
import Link from 'next/link';

interface VoiceRecorderProps {
  pageSlug: string;
  pageType: string;
  currentUser?: UserToken | null;
  onSuccess?: () => void;
}

export function VoiceRecorder({ pageSlug, pageType, currentUser, onSuccess }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'recording' | 'review' | 'submitting' | 'success' | 'rejected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Clean up URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setStatus('review');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('recording');
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMessage("Could not access microphone. Please check permissions.");
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setStatus('idle');
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setStatus('submitting');

    const file = new File([audioBlob], "voice-note.webm", { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("pageSlug", pageSlug);
    formData.append("pageType", pageType);

    try {
      const result = await submitComment(null, formData);

      if (result.success) {
        if (result.status === 'rejected') {
          setStatus('rejected');
        } else {
          setStatus('success');
          if (onSuccess) onSuccess();
        }
      } else {
        setErrorMessage(result.message || "Failed to submit.");
        setStatus('error');
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage("An unexpected error occurred.");
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center animate-in fade-in zoom-in duration-300">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-green-800">Thanks for sharing!</h3>
        <p className="text-green-700">Your voice note is live.</p>
        <Button onClick={resetRecording} variant="outline" className="mt-4">Leave another?</Button>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center animate-in fade-in zoom-in duration-300">
        <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-800">Note Flagged</h3>
        <p className="text-red-700">Thanks for your contribution, but it didn&apos;t meet our community guidelines.</p>
        <Button onClick={resetRecording} variant="outline" className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 text-center">
        <h3 className="font-semibold text-slate-900">Leave a Voice Note</h3>
        <p className="text-sm text-slate-500">Share your tips or thanks in seconds!</p>
        {currentUser ? (
          <p className="text-xs text-primary mt-1 font-medium">
            Posting as {currentUser.name || "User"}
          </p>
        ) : (
          <p className="text-xs text-slate-400 mt-1">
            Posting anonymously
          </p>
        )}
      </div>

      {/* Main Action Area */}
      <div className="flex flex-col items-center justify-center space-y-4">

        {/* Idle State */}
        {status === 'idle' && (
          <Button
            onClick={startRecording}
            size="lg"
            className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
            aria-label="Start Recording"
          >
            <Mic className="w-8 h-8 text-white" />
          </Button>
        )}

        {/* Recording State */}
        {status === 'recording' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-pulse flex items-center space-x-2 text-red-600 font-medium">
              <div className="w-3 h-3 bg-red-600 rounded-full" />
              <span>Recording...</span>
            </div>
            <Button
              onClick={stopRecording}
              size="lg"
              variant="primary"
              className="rounded-full w-16 h-16 flex items-center justify-center bg-red-600 hover:bg-red-700 border-red-600"
              aria-label="Stop Recording"
            >
              <Square className="w-6 h-6 fill-current" />
            </Button>
          </div>
        )}

        {/* Review State */}
        {status === 'review' && audioUrl && (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
              <audio ref={audioPlayerRef} src={audioUrl} controls className="w-full" />
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={resetRecording} variant="outline" className="text-slate-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Redo
              </Button>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary-dark text-white">
                <Send className="w-4 h-4 mr-2" />
                Post Note
              </Button>
            </div>

            {/* Login Prompt */}
            {!currentUser && (
              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Want to save this to your profile?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Log in first
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Loading/Submitting State */}
        {status === 'submitting' && (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-slate-500">Transcribing & Summarizing...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center">
            <p className="text-red-600 mb-2">{errorMessage}</p>
            <Button onClick={resetRecording} variant="ghost" size="sm">Try Again</Button>
          </div>
        )}

      </div>
    </div>
  );
}
