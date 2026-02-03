import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  isPaused: boolean;
  isGameOver: boolean;
}

export default function ScoreBoard({ score, highScore, isPaused, isGameOver }: ScoreBoardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Score</p>
              <p className="text-2xl font-bold text-white">{score}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">High Score</p>
              <p className="text-2xl font-bold text-white">{highScore}</p>
            </div>
          </div>
        </div>
        
        {(isPaused || isGameOver) && (
          <div className="text-center py-2">
            <p className="text-lg font-semibold animate-pulse">
              {isGameOver ? (
                <span className="text-red-400">Game Over!</span>
              ) : (
                <span className="text-yellow-400">Paused</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}