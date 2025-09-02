// Tic Tac Toe Game Logic and AI Engine

import { 
  Board, 
  Player, 
  Difficulty, 
  WINNING_COMBINATIONS, 
  INITIAL_BOARD,
  DIFFICULTY_CONFIG 
} from '@/types/game';

export class TicTacToeEngine {
  /**
   * Check if there's a winner on the board
   */
  static checkWinner(board: Board): Player {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  /**
   * Check if the board is full (draw condition)
   */
  static isBoardFull(board: Board): boolean {
    return board.every(cell => cell !== null);
  }

  /**
   * Check if the game is over
   */
  static isGameOver(board: Board): boolean {
    return this.checkWinner(board) !== null || this.isBoardFull(board);
  }

  /**
   * Get all available moves (empty cells)
   */
  static getAvailableMoves(board: Board): number[] {
    return board.reduce<number[]>((moves, cell, index) => {
      if (cell === null) moves.push(index);
      return moves;
    }, []);
  }

  /**
   * Make a move on the board
   */
  static makeMove(board: Board, index: number, player: Player): Board {
    if (board[index] !== null) {
      throw new Error('Invalid move: cell already occupied');
    }
    const newBoard = [...board];
    newBoard[index] = player;
    return newBoard;
  }

  /**
   * Find winning move for a player
   */
  static findWinningMove(board: Board, player: Player): number | null {
    const availableMoves = this.getAvailableMoves(board);
    
    for (const move of availableMoves) {
      const testBoard = this.makeMove(board, move, player);
      if (this.checkWinner(testBoard) === player) {
        return move;
      }
    }
    
    return null;
  }

  /**
   * Find blocking move to prevent opponent from winning
   */
  static findBlockingMove(board: Board, player: Player): number | null {
    const opponent = player === 'X' ? 'O' : 'X';
    return this.findWinningMove(board, opponent);
  }

  /**
   * Get strategic moves (center, corners, edges in order of preference)
   */
  static getStrategicMoves(board: Board): number[] {
    const availableMoves = this.getAvailableMoves(board);
    const center = 4;
    const corners = [0, 2, 6, 8];
    const edges = [1, 3, 5, 7];
    
    const strategicOrder: number[] = [];
    
    // Prefer center
    if (availableMoves.includes(center)) {
      strategicOrder.push(center);
    }
    
    // Then corners
    corners.forEach(corner => {
      if (availableMoves.includes(corner)) {
        strategicOrder.push(corner);
      }
    });
    
    // Finally edges
    edges.forEach(edge => {
      if (availableMoves.includes(edge)) {
        strategicOrder.push(edge);
      }
    });
    
    return strategicOrder;
  }

  /**
   * Minimax algorithm with alpha-beta pruning for hard difficulty
   */
  static minimax(
    board: Board, 
    depth: number, 
    isMaximizing: boolean, 
    alpha: number = -Infinity, 
    beta: number = Infinity
  ): { score: number; move?: number } {
    const winner = this.checkWinner(board);
    
    // Terminal states
    if (winner === 'O') return { score: 10 - depth };
    if (winner === 'X') return { score: depth - 10 };
    if (this.isBoardFull(board)) return { score: 0 };
    
    const availableMoves = this.getAvailableMoves(board);
    let bestMove: number | undefined;
    
    if (isMaximizing) {
      let maxScore = -Infinity;
      
      for (const move of availableMoves) {
        const newBoard = this.makeMove(board, move, 'O');
        const { score } = this.minimax(newBoard, depth + 1, false, alpha, beta);
        
        if (score > maxScore) {
          maxScore = score;
          bestMove = move;
        }
        
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      
      return { score: maxScore, move: bestMove };
    } else {
      let minScore = Infinity;
      
      for (const move of availableMoves) {
        const newBoard = this.makeMove(board, move, 'X');
        const { score } = this.minimax(newBoard, depth + 1, true, alpha, beta);
        
        if (score < minScore) {
          minScore = score;
          bestMove = move;
        }
        
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      
      return { score: minScore, move: bestMove };
    }
  }

  /**
   * Get computer move based on difficulty level
   */
  static getComputerMove(board: Board, difficulty: Difficulty): number {
    const availableMoves = this.getAvailableMoves(board);
    
    if (availableMoves.length === 0) {
      throw new Error('No available moves');
    }

    const config = DIFFICULTY_CONFIG[difficulty];
    const shouldUseSmartMove = Math.random() < config.smartMoveChance;

    switch (difficulty) {
      case 'easy':
        if (shouldUseSmartMove) {
          // Try to win
          const winningMove = this.findWinningMove(board, 'O');
          if (winningMove !== null) return winningMove;
          
          // Try to block
          const blockingMove = this.findBlockingMove(board, 'O');
          if (blockingMove !== null) return blockingMove;
        }
        
        // Random move
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];

      case 'medium':
        // Always try to win first
        const winningMove = this.findWinningMove(board, 'O');
        if (winningMove !== null) return winningMove;
        
        // Always block opponent's winning move
        const blockingMove = this.findBlockingMove(board, 'O');
        if (blockingMove !== null) return blockingMove;
        
        if (shouldUseSmartMove) {
          // Use strategic moves
          const strategicMoves = this.getStrategicMoves(board);
          if (strategicMoves.length > 0) {
            return strategicMoves[0];
          }
        }
        
        // Random move
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];

      case 'hard':
        // Use minimax algorithm for optimal play
        const { move } = this.minimax(board, 0, true);
        return move ?? availableMoves[0];

      default:
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  /**
   * Reset board to initial state
   */
  static resetBoard(): Board {
    return [...INITIAL_BOARD];
  }

  /**
   * Evaluate board position (for debugging/analysis)
   */
  static evaluateBoard(board: Board): {
    winner: Player;
    isDraw: boolean;
    isGameOver: boolean;
    availableMoves: number[];
  } {
    const winner = this.checkWinner(board);
    const isDraw = !winner && this.isBoardFull(board);
    const isGameOver = winner !== null || isDraw;
    const availableMoves = this.getAvailableMoves(board);

    return {
      winner,
      isDraw,
      isGameOver,
      availableMoves,
    };
  }
}