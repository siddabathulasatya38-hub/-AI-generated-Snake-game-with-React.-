export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  artwork: string;
  duration: number;
}

export type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface Point {
  x: number;
  y: number;
}

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'AI Synth-01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Dummy but functional for demo
    artwork: 'https://picsum.photos/seed/cyber/200/200',
    duration: 180,
  },
  {
    id: '2',
    title: 'Neon Drift',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    artwork: 'https://picsum.photos/seed/neon/200/200',
    duration: 210,
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Virtual Flow',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    artwork: 'https://picsum.photos/seed/horizon/200/200',
    duration: 155,
  },
];
