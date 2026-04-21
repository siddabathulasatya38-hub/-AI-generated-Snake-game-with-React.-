/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Github, Twitter, Share2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-cyan-500/50 selection:text-white">
      {/* Glitch Overlays */}
      <div className="static-overlay" />
      <div className="scanline" />
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/10 shadow-[0_0_20px_var(--cyan)]" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-magenta-500/10 shadow-[0_0_20px_var(--magenta)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-2 border-white flex items-center justify-center bg-black">
            <span className="text-2xl font-digital glitch-text">?</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-digital glitch-text tracking-tight">
              TERMINAL <span className="text-cyan-400">0x01</span>
            </h1>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-mono">PROTOCOL: RHYTHM_VOICE</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[10px] font-mono uppercase tracking-[0.5em] text-white/30">
          <a href="#" className="hover:text-cyan-400 hover:glitch-text transition-all">/UPLINK</a>
          <a href="#" className="hover:text-magenta-400 hover:glitch-text transition-all">/DECRYPT</a>
          <a href="#" className="hover:text-cyan-400 hover:glitch-text transition-all">/VIRTUAL</a>
        </nav>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end font-mono text-[9px] text-white/20">
            <span>SYS_TIME: {new Date().toLocaleTimeString()}</span>
            <span>LOC: CLOUD_RUN_INSTANCE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 p-8 max-w-7xl mx-auto w-full">
        {/* Left/Game Area */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center border-2 border-white/5 p-8 bg-black/40 backdrop-blur-sm relative"
        >
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-magenta-400" />
          <SnakeGame />
        </motion.section>

        {/* Right/Music Area */}
        <motion.section 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 max-w-md w-full space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.6em] flex items-center gap-2">
              <span className="w-8 h-[1px] bg-cyan-400/40" />
              SIGNAL_STREAM
            </h2>
            <MusicPlayer />
          </div>

          <div className="border border-white/10 p-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <h3 className="text-xs font-digital mb-4 flex items-center justify-between">
              <span>MANIFEST_LOG</span>
              <span className="text-[8px] font-mono text-white/30 tracking-widest">REL_ID: 99x-A</span>
            </h3>
            <div className="space-y-3 font-mono text-[10px] text-white/40 uppercase tracking-widest relative z-10">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>GATEWAY</span>
                <span className="text-cyan-400">ACTIVE_01</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>BIT_SYNC</span>
                <span className="text-magenta-400">LOCKED</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>ENTROPY</span>
                <span>0.00032</span>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-[0.5em]">
        <div className="glitch-text">CRITICAL_ERROR: SYSTEM_EVOLUTION_IN_PROGRESS</div>
        <div className="flex gap-12">
          <a href="#" className="hover:text-cyan-400">/ROOT</a>
          <a href="#" className="hover:text-magenta-400">/LOGS</a>
          <a href="#" className="hover:text-cyan-400">/VOID</a>
        </div>
      </footer>
    </div>
  );
}
