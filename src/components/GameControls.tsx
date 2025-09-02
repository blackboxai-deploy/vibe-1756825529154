'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Difficulty, Score, DIFFICULTY_CONFIG } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onResetScore: () => void;
  score: Score;
  statusMessage: string;
  isComputerThinking: boolean;
}

export function GameControls({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onResetScore,
  score,
  statusMessage,
  isComputerThinking
}: GameControlsProps) {
  const totalGames = score.playerWins + score.computerWins + score.draws;

  const getDifficultyBadgeVariant = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'outline' as const;
      case 'medium':
        return 'secondary' as const;
      case 'hard':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  const getStatusColor = () => {
    if (isComputerThinking) return 'text-blue-600 dark:text-blue-400';
    if (statusMessage.includes('You won')) return 'text-green-600 dark:text-green-400';
    if (statusMessage.includes('Computer wins')) return 'text-red-600 dark:text-red-400';
    if (statusMessage.includes('draw')) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-700 dark:text-gray-300';
  };

  return (
    <Card className="mb-8 border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        {/* Status Message */}
        <div className="text-center mb-6">
          <p 
            className={cn(
              "text-xl font-semibold transition-colors duration-300",
              getStatusColor(),
              isComputerThinking && "animate-pulse"
            )}
          >
            {statusMessage}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Difficulty Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty Level
            </label>
            <div className="space-y-2">
              <Select 
                value={difficulty} 
                onValueChange={(value: Difficulty) => onDifficultyChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => {
                    const difficultyKey = key as Difficulty;
                    const difficultyConfig = config as typeof DIFFICULTY_CONFIG[Difficulty];
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Badge variant={getDifficultyBadgeVariant(difficultyKey)}>
                            {difficultyConfig.name}
                          </Badge>
                          <span className="text-sm text-gray-600">{difficultyConfig.description}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <div className="flex justify-center">
                <Badge variant={getDifficultyBadgeVariant(difficulty)}>
                  Current: {DIFFICULTY_CONFIG[difficulty].name}
                </Badge>
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center block">
              Game Statistics
            </label>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {score.playerWins}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    You
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {score.draws}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Draw
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {score.computerWins}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    AI
                  </div>
                </div>
              </div>
              {totalGames > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Total Games: {totalGames}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center block">
              Game Actions
            </label>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={onNewGame}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={isComputerThinking}
              >
                {isComputerThinking ? 'Thinking...' : 'New Game'}
              </Button>
              <Button 
                onClick={onResetScore}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={totalGames === 0 || isComputerThinking}
              >
                Reset Score
              </Button>
            </div>
          </div>
        </div>

        {/* Difficulty Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{DIFFICULTY_CONFIG[difficulty].name} Mode:</strong>{' '}
              {DIFFICULTY_CONFIG[difficulty].description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}