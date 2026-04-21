import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track, DUMMY_TRACKS } from '../types';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full max-w-md bg-black border-2 border-white/10 p-6 shadow-[0_0_30px_rgba(0,0,0,1)] relative overflow-hidden group">
      {/* Glitch Strips */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400 opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-magenta-400 opacity-20 animate-pulse" />

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex items-center gap-6">
          <motion.div 
            key={currentTrack.artwork}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-20 h-20 border-2 border-white/20 grayscale contrast-[1.5] brightness-[0.8]"
          >
            <img 
              src={currentTrack.artwork} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-white font-digital text-sm glitch-text mb-1">
              {currentTrack.title}
            </h3>
            <p className="text-white/30 text-[9px] font-mono tracking-[0.4em] uppercase">
              ID: {currentTrack.artist.replace(' ', '_')}
            </p>
          </div>
          <div className="text-cyan-400 animate-pulse">
            <Music size={20} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-white/5 border border-white/10 relative overflow-hidden cursor-crosshair">
            <motion.div 
              className="h-full bg-white relative"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.1 }}
            >
              <div className="absolute top-0 right-[-1px] w-[2px] h-full bg-magenta-500 shadow-[0_0_10px_var(--magenta)]" />
            </motion.div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase tracking-[0.5em]">
            <span>LOC_{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{String(Math.floor((audioRef.current?.currentTime || 0) % 60)).padStart(2, '0')}</span>
            <span>EOF_{Math.floor(currentTrack.duration / 60)}:{String(Math.floor(currentTrack.duration % 60)).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-12">
          <button 
            onClick={handlePrev}
            className="text-white/40 hover:text-cyan-400 transition-colors"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 border-2 border-white flex items-center justify-center bg-black hover:bg-white hover:text-black transition-all group/btn"
          >
            <div className="group-hover/btn:scale-110 transition-transform">
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </div>
          </button>
          
          <button 
            onClick={handleNext}
            className="text-white/40 hover:text-magenta-400 transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
};
