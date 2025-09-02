'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { GameControls } from '@/components/GameControls';
import { TicTacToeEngine } from '@/lib/tic-tac-toe';
import { GameState, Score, Difficulty, INITIAL_BOARD } from '@/types/game';

export default function TicTacToePage() {
  const [gameState, setGameState] = useState<GameState>({
    board: INITIAL_BOARD,
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    isGameOver: false,
    difficulty: 'medium',
  });

  const [score, setScore] = useState<Score>({
    playerWins: 0,
    computerWins: 0,
    draws: 0,
  });

  const [isComputerThinking, setIsComputerThinking] = useState(false);

  // Handle player move
  const handlePlayerMove = useCallback((index: number) => {
    if (gameState.board[index] !== null || gameState.isGameOver || isComputerThinking) {
      return;
    }

    try {
      // Make player move
      const newBoard = TicTacToeEngine.makeMove(gameState.board, index, 'X');
      const evaluation = TicTacToeEngine.evaluateBoard(newBoard);

      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: 'O',
        winner: evaluation.winner,
        isDraw: evaluation.isDraw,
        isGameOver: evaluation.isGameOver,
      }));

      // Update score if game is over
      if (evaluation.isGameOver) {
        setScore(prev => ({
          ...prev,
          playerWins: evaluation.winner === 'X' ? prev.playerWins + 1 : prev.playerWins,
          computerWins: evaluation.winner === 'O' ? prev.computerWins + 1 : prev.computerWins,
          draws: evaluation.isDraw ? prev.draws + 1 : prev.draws,
        }));
      }
    } catch (error) {
      console.error('Player move error:', error);
    }
  }, [gameState.board, gameState.isGameOver, isComputerThinking]);

  // Computer move effect
  useEffect(() => {
    if (gameState.currentPlayer === 'O' && !gameState.isGameOver) {
      setIsComputerThinking(true);

      // Add a slight delay to make computer moves feel more natural
      const timeout = setTimeout(() => {
        try {
          const computerMoveIndex = TicTacToeEngine.getComputerMove(
            gameState.board,
            gameState.difficulty
          );

          const newBoard = TicTacToeEngine.makeMove(gameState.board, computerMoveIndex, 'O');
          const evaluation = TicTacToeEngine.evaluateBoard(newBoard);

          setGameState(prev => ({
            ...prev,
            board: newBoard,
            currentPlayer: 'X',
            winner: evaluation.winner,
            isDraw: evaluation.isDraw,
            isGameOver: evaluation.isGameOver,
          }));

          // Update score if game is over
          if (evaluation.isGameOver) {
            setScore(prev => ({
              ...prev,
              playerWins: evaluation.winner === 'X' ? prev.playerWins + 1 : prev.playerWins,
              computerWins: evaluation.winner === 'O' ? prev.computerWins + 1 : prev.computerWins,
              draws: evaluation.isDraw ? prev.draws + 1 : prev.draws,
            }));
          }
        } catch (error) {
          console.error('Computer move error:', error);
        } finally {
          setIsComputerThinking(false);
        }
      }, Math.random() * 800 + 500); // 500-1300ms delay for natural feel

      return () => clearTimeout(timeout);
    }
  }, [gameState.currentPlayer, gameState.board, gameState.isGameOver, gameState.difficulty]);

  // Start new game
  const handleNewGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      board: TicTacToeEngine.resetBoard(),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
      isGameOver: false,
    }));
    setIsComputerThinking(false);
  }, []);

  // Change difficulty
  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setGameState(prev => ({
      ...prev,
      difficulty: newDifficulty,
    }));
    // Start new game when difficulty changes
    handleNewGame();
  }, [handleNewGame]);

  // Reset score
  const handleResetScore = useCallback(() => {
    setScore({
      playerWins: 0,
      computerWins: 0,
      draws: 0,
    });
  }, []);

  // Get current game status message
  const getStatusMessage = (): string => {
    if (isComputerThinking) {
      return 'Computer is thinking...';
    }

    if (gameState.winner === 'X') {
      return '🎉 You won!';
    }

    if (gameState.winner === 'O') {
      return '🤖 Computer wins!';
    }

    if (gameState.isDraw) {
      return '🤝 It\'s a draw!';
    }

    if (gameState.currentPlayer === 'X') {
      return 'Your turn (X)';
    }

    return 'Computer\'s turn (O)';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Tic Tac Toe
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Challenge the AI across three difficulty levels
          </p>
        </div>

        {/* Game Controls */}
        <GameControls
          difficulty={gameState.difficulty}
          onDifficultyChange={handleDifficultyChange}
          onNewGame={handleNewGame}
          onResetScore={handleResetScore}
          score={score}
          statusMessage={getStatusMessage()}
          isComputerThinking={isComputerThinking}
        />

        {/* Game Board */}
        <div className="mb-8">
          <GameBoard
            board={gameState.board}
            onCellClick={handlePlayerMove}
            winner={gameState.winner}
            isGameOver={gameState.isGameOver}
            isComputerThinking={isComputerThinking}
          />
        </div>

        {/* Game Rules */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          <p className="mb-2">
            You are <strong>X</strong> and the computer is <strong>O</strong>. 
            Get three in a row to win!
          </p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <strong>Easy:</strong> Random moves with basic strategy
            </div>
            <div>
              <strong>Medium:</strong> Strategic play with blocking
            </div>
            <div>
              <strong>Hard:</strong> Optimal AI using minimax
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}