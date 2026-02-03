import React from 'react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import { Play, Pause, RotateCcw, Gamepad2 } from 'lucide-react';

export default function Game() {
  const { gameState, resetGame, togglePause, GRID_SIZE } = useSnakeGame();
  const { snake, food, score, isGameOver, isPaused, highScore } = gameState;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Gamepad2 className="text-green-400" size={40} />
            <h1 className="text-5xl font-bold text-white">Snake Game</h1>
          </div>
          <p className="text-gray-300">Use arrow keys or WASD to move • Space to pause</p>
        </div>

        <div className="space-y-6">
          <ScoreBoard 
            score={score} 
            highScore={highScore}
            isPaused={isPaused}
            isGameOver={isGameOver}
          />

          <div className="flex justify-center">
            <GameBoard 
              snake={snake} 
              food={food} 
              gridSize={GRID_SIZE}
              isGameOver={isGameOver}
            />
          </div>

          <div className="flex justify-center gap-4">
            {!isGameOver && (
              <button
                onClick={togglePause}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                {isPaused ? (
                  <>
                    <Play size={20} />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause size={20} />
                    Pause
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <RotateCcw size={20} />
              {isGameOver ? 'New Game' : 'Restart'}
            </button>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <p>Press Enter to restart when game is over</p>
            <p className="mt-1">Speed increases with score!</p>
          </div>
        </div>
      </div>
    </div>
  );
}