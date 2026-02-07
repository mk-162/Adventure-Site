'use client';

import { Play, Pause, Heart, Clock, User } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { voteForComment } from '@/lib/comments';

interface Comment {
  id: number;
  summary: string | null;
  audioUrl: string | null;
  votes: number;
  createdAt: Date;
  user?: {
    name: string | null;
  } | null;
}

interface CommentListProps {
  initialComments: Comment[];
}

export function CommentList({ initialComments }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  // Simple optimistic update for voting
  const handleVote = async (id: number) => {
    // Optimistic update
    setComments(prev => prev.map(c => c.id === id ? { ...c, votes: c.votes + 1 } : c));

    const result = await voteForComment(id);
    if (!result.success) {
      // Revert if failed
      setComments(prev => prev.map(c => c.id === id ? { ...c, votes: c.votes - 1 } : c));
      console.error(result.message);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
        <p>No voice notes yet. Be the first to leave one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} onVote={handleVote} />
      ))}
    </div>
  );
}

function CommentCard({ comment, onVote }: { comment: Comment, onVote: (id: number) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current || !comment.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => setIsPlaying(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Play Button */}
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div className="flex-grow">
            {/* Caption/Summary */}
            <p className="font-medium text-slate-900 leading-snug">
              &ldquo;{comment.summary || "Audio comment"}&rdquo;
            </p>

            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                {/* Author Name */}
                <span className="flex items-center text-primary font-medium">
                    <User className="w-3 h-3 mr-1" />
                    {comment.user?.name || "Adventure Fan"}
                </span>

                {/* Date */}
                <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(comment.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>

        {/* Upvote */}
        <div className="flex flex-col items-center">
             <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 flex flex-col gap-0 hover:bg-transparent hover:text-red-500 group"
                onClick={() => onVote(comment.id)}
             >
                <Heart className="w-5 h-5 group-hover:fill-current" />
                <span className="text-xs font-semibold">{comment.votes}</span>
             </Button>
        </div>
      </div>

      {comment.audioUrl && (
        <audio
            ref={audioRef}
            src={comment.audioUrl}
            onEnded={handleEnded}
            className="hidden"
        />
      )}
    </div>
  );
}
