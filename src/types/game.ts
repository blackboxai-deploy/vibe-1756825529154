// Game Types and Interfaces for Tic Tac Toe

export type Player = 'X' | 'O' | null;
export type Board = Player[];
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  isDraw: boolean;
  isGameOver: boolean;
  difficulty: Difficulty;
}

export interface Score {
  playerWins: number;
  computerWins: number;
  draws: number;
}

export interface GameMove {
  index: number;
  player: Player;
}

export interface AIMove {
  index: number;
  score?: number;
}

export const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

export const INITIAL_BOARD: Board = Array(9).fill(null);

export const DIFFICULTY_CONFIG = {
  easy: {
    name: 'Easy',
    description: 'Random moves with basic blocking',
    smartMoveChance: 0.3,
  },
  medium: {
    name: 'Medium',
    description: 'Strategic play with win/block detection',
    smartMoveChance: 0.7,
  },
  hard: {
    name: 'Hard',
    description: 'Optimal play using minimax algorithm',
    smartMoveChance: 1.0,
  },
} as const;