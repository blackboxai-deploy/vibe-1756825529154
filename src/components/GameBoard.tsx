'use client';

import { Board, Player, WINNING_COMBINATIONS } from '@/types/game';
import { TicTacToeEngine } from '@/lib/tic-tac-toe';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: Board;
  onCellClick: (index: number) => void;
  winner: Player;
  isGameOver: boolean;
  isComputerThinking: boolean;
}

export function GameBoard({ 
  board, 
  onCellClick, 
  winner, 
  isGameOver, 
  isComputerThinking 
}: GameBoardProps) {
  // Find winning combination for highlighting
  const getWinningCombination = (): number[] => {
    if (!winner) return [];
    
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] === winner && board[b] === winner && board[c] === winner) {
        return combination;
      }
    }
    return [];
  };

  const winningCombination = getWinningCombination();

  const handleCellClick = (index: number) => {
    if (isComputerThinking) return;
    onCellClick(index);
  };

  return (
    <div className="flex justify-center">
      <div 
        className={cn(
          "grid grid-cols-3 gap-2 p-6 rounded-xl shadow-lg transition-all duration-300",
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          isComputerThinking && "opacity-75 pointer-events-none"
        )}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={cell !== null || isGameOver || isComputerThinking}
            className={cn(
              // Base styles
              "w-20 h-20 md:w-24 md:h-24 border-2 rounded-lg font-bold text-2xl md:text-3xl",
              "transition-all duration-200 flex items-center justify-center",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              
              // Border and background
              "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700",
              
              // Hover states (only for empty cells and not disabled)
              !cell && !isGameOver && !isComputerThinking && [
                "hover:bg-blue-50 hover:border-blue-300 hover:shadow-md",
                "dark:hover:bg-gray-600 dark:hover:border-blue-400",
                "cursor-pointer"
              ],
              
              // Disabled/occupied states
              (cell || isGameOver || isComputerThinking) && "cursor-not-allowed",
              
              // Player colors
              cell === 'X' && "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
              cell === 'O' && "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
              
              // Winning combination highlight
              winningCombination.includes(index) && [
                "ring-2 ring-green-400 bg-green-100 dark:bg-green-900/30",
                "shadow-lg transform scale-105"
              ],
              
              // Computer thinking state
              isComputerThinking && "opacity-60"
            )}
            aria-label={`Cell ${index + 1}${cell ? `, occupied by ${cell}` : ', empty'}`}
          >
            <span 
              className={cn(
                "transition-all duration-300 transform",
                cell && "scale-100 opacity-100",
                !cell && "scale-75 opacity-0",
                // Add subtle animation when cell is filled
                cell && "animate-in fade-in-0 zoom-in-50 duration-300"
              )}
            >
              {cell}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}