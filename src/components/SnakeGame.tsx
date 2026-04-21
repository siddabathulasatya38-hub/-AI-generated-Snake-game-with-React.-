import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Point, GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../types';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState('PLAYING');
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  const update = useCallback((timestamp: number) => {
    if (gameState !== 'PLAYING') return;

    if (timestamp - lastUpdateRef.current > speed) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }

    gameLoopRef.current = requestAnimationFrame(update);
  }, [gameState, moveSnake, speed]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = requestAnimationFrame(update);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, update]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food (Neon Pulse)
    const time = performance.now() / 200;
    const foodPulse = Math.sin(time) * 2 + 3;
    ctx.shadowBlur = foodPulse + 10;
    ctx.shadowColor = '#f472b6'; // fuchsia-400
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.roundRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4,
      4
    );
    ctx.fill();

    // Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#22d3ee'; // cyan-400
      ctx.fillStyle = isHead ? '#22d3ee' : 'rgba(34, 211, 238, 0.6)';
      
      ctx.beginPath();
      ctx.roundRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2,
        isHead ? 6 : 4
      );
      ctx.fill();
    });

    // Reset shadow for performance
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Header */}
      <div className="flex gap-16 items-center bg-black border-2 border-white/10 px-12 py-6 relative">
        <div className="absolute top-0 left-0 w-2 h-2 bg-white" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-white" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-white" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-white" />
        
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-cyan-400 uppercase tracking-[0.5em] font-mono mb-2">BIT_COUNT</span>
          <span className="text-4xl font-digital glitch-text text-white">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="w-px h-10 bg-white/20" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-magenta-400 uppercase tracking-[0.5em] font-mono mb-2">MEM_MAX</span>
          <span className="text-4xl font-digital text-white/40">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="relative p-1 bg-white/5 border border-white/10">
        <div className="relative bg-black border border-white/20 overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={400} 
            className="block h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] sepia-[0.3] contrast-[1.2]"
          />

          <AnimatePresence>
            {gameState !== 'PLAYING' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center"
              >
                {gameState === 'IDLE' && (
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="space-y-8"
                  >
                    <h2 className="text-3xl font-digital glitch-text leading-tight">
                      DATA_VOICE <br />
                      <span className="text-cyan-400">SESSION_01</span>
                    </h2>
                    <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">INPUT [KEYS] TO COMMENCE</p>
                    <button 
                      onClick={resetGame}
                      className="px-10 py-4 border-2 border-white hover:bg-white hover:text-black font-digital text-xs transition-all glitch-text"
                    >
                      INITIATE_UPLINK
                    </button>
                  </motion.div>
                )}

                {gameState === 'GAME_OVER' && (
                  <motion.div 
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="space-y-8"
                  >
                    <h2 className="text-3xl font-digital text-magenta-500 glitch-text">SEGMENTATION_FAULT</h2>
                    <div className="space-y-1">
                      <p className="text-white/20 text-[9px] uppercase tracking-[0.6em] font-mono">FINAL_EXTRACT</p>
                      <p className="text-5xl font-digital text-white glitch-text">{score}</p>
                    </div>
                    <button 
                      onClick={resetGame}
                      className="px-10 py-4 border-2 border-magenta-500 text-magenta-500 hover:bg-magenta-500 hover:text-black font-digital text-xs transition-all"
                    >
                      REBOOT_SESSION
                    </button>
                  </motion.div>
                )}

                {gameState === 'PAUSED' && (
                  <div className="space-y-6">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Paused</h2>
                    <button 
                      onClick={() => setGameState('PLAYING')}
                      className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-black font-bold rounded-full"
                    >
                      RESUME
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Controls Help */}
      <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-mono mt-2">
        WASD or Arrows to Move • Esc to Pause
      </div>
    </div>
  );
};
