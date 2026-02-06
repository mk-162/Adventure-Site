'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';

interface AudioWaveformProps {
  mode: 'recording' | 'playback';
  // Recording mode props
  audioStream?: MediaStream | null;
  // Playback mode props
  waveformData?: number[] | null;
  progress?: number; // 0-100 percentage
  isPlaying?: boolean;
  onSeek?: (progress: number) => void;
  // Styling
  className?: string;
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  activeColor?: string;
  inactiveColor?: string;
  height?: number;
}

export function AudioWaveform({
  mode,
  audioStream,
  waveformData,
  progress = 0,
  isPlaying = false,
  onSeek,
  className,
  barCount = 40,
  barWidth = 3,
  barGap = 2,
  activeColor = 'bg-primary',
  inactiveColor = 'bg-primary/30',
  height = 80,
}: AudioWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [bars, setBars] = useState<number[]>(() => 
    Array(barCount).fill(0).map(() => 0.2 + Math.random() * 0.3)
  );

  // Recording mode: Real-time audio visualization
  useEffect(() => {
    if (mode !== 'recording' || !audioStream) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(audioStream);
    
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.7;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const animate = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Sample frequency data evenly across the bars
      const step = Math.floor(dataArray.length / barCount);
      const newBars = Array(barCount).fill(0).map((_, i) => {
        const value = dataArray[i * step] || 0;
        // Normalize to 0-1 range with minimum height
        return Math.max(0.15, value / 255);
      });
      
      setBars(newBars);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      source.disconnect();
      audioContext.close();
    };
  }, [mode, audioStream, barCount]);

  // Playback mode: Use pre-computed waveform data
  useEffect(() => {
    if (mode !== 'playback' || !waveformData) return;
    
    // Resample waveform data to match bar count
    const step = waveformData.length / barCount;
    const newBars = Array(barCount).fill(0).map((_, i) => {
      const start = Math.floor(i * step);
      const end = Math.floor((i + 1) * step);
      let sum = 0;
      for (let j = start; j < end && j < waveformData.length; j++) {
        sum += waveformData[j];
      }
      return Math.max(0.15, sum / (end - start));
    });
    
    setBars(newBars);
  }, [mode, waveformData, barCount]);

  // Handle click to seek in playback mode
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'playback' || !onSeek || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, percentage)));
  }, [mode, onSeek]);

  // Calculate which bar index the progress is at
  const progressBarIndex = Math.floor((progress / 100) * barCount);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'flex items-center justify-center gap-[2px] rounded-xl overflow-hidden',
        mode === 'playback' && onSeek && 'cursor-pointer',
        className
      )}
      style={{ height }}
      onClick={handleClick}
      role={mode === 'playback' ? 'slider' : undefined}
      aria-label={mode === 'playback' ? 'Audio progress' : 'Audio level visualization'}
      aria-valuemin={mode === 'playback' ? 0 : undefined}
      aria-valuemax={mode === 'playback' ? 100 : undefined}
      aria-valuenow={mode === 'playback' ? Math.round(progress) : undefined}
    >
      {bars.map((barHeight, index) => {
        const isActive = mode === 'recording' 
          ? true 
          : index <= progressBarIndex;
        
        const barStyle = {
          width: barWidth,
          height: `${Math.max(15, barHeight * 100)}%`,
          animationDelay: mode === 'recording' ? `${index * 0.05}s` : undefined,
        };

        return (
          <div
            key={index}
            className={clsx(
              'rounded-full transition-all duration-100',
              isActive ? activeColor : inactiveColor,
              mode === 'recording' && isPlaying && 'voice-tips-wave-bar'
            )}
            style={barStyle}
          />
        );
      })}
    </div>
  );
}

// Helper function to generate waveform data from audio file
export async function generateWaveformData(audioBlob: Blob, sampleCount: number = 100): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get the audio data from the first channel
        const rawData = audioBuffer.getChannelData(0);
        const blockSize = Math.floor(rawData.length / sampleCount);
        const samples: number[] = [];

        for (let i = 0; i < sampleCount; i++) {
          const start = i * blockSize;
          let sum = 0;
          
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[start + j] || 0);
          }
          
          // Normalize to 0-1 range
          samples.push(sum / blockSize);
        }

        // Normalize the entire array so the max is 1
        const max = Math.max(...samples, 0.01);
        const normalized = samples.map(s => s / max);

        audioContext.close();
        resolve(normalized);
      } catch (error) {
        audioContext.close();
        reject(error);
      }
    };

    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(audioBlob);
  });
}

// Compact waveform for card display
export function CompactWaveform({
  waveformData,
  progress = 0,
  isPlaying = false,
  className,
}: {
  waveformData?: number[] | null;
  progress?: number;
  isPlaying?: boolean;
  className?: string;
}) {
  const barCount = 20;
  const bars = waveformData 
    ? Array(barCount).fill(0).map((_, i) => {
        const idx = Math.floor((i / barCount) * waveformData.length);
        return waveformData[idx] || 0.3;
      })
    : Array(barCount).fill(0).map(() => 0.3 + Math.random() * 0.4);

  const progressBarIndex = Math.floor((progress / 100) * barCount);

  return (
    <div className={clsx('flex items-end gap-[2px] h-4', className)}>
      {bars.map((height, index) => {
        const isActive = index <= progressBarIndex;
        return (
          <div
            key={index}
            className={clsx(
              'w-1 rounded-full transition-colors duration-100',
              isActive ? 'bg-primary' : 'bg-primary/30',
              isPlaying && isActive && 'voice-tips-wave-bar-fast'
            )}
            style={{ height: `${Math.max(20, height * 100)}%` }}
          />
        );
      })}
    </div>
  );
}
