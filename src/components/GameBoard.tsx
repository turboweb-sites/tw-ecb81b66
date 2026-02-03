import React from 'react';
import { Position } from '../types/game';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  isGameOver: boolean;
}

export default function GameBoard({ snake, food, gridSize, isGameOver }: GameBoardProps) {
  const cellSize = 20;

  const isSnakeSegment = (x: number, y: number) => {
    return snake.some((segment, index) => {
      if (segment.x === x && segment.y === y) {
        return { isHead: index === 0, index };
      }
      return false;
    });
  };

  return (
    <div className="relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
      <div 
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const snakeInfo = snake.findIndex(segment => segment.x === x && segment.y === y);
          const isHead = snakeInfo === 0;
          const isSnake = snakeInfo !== -1;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`
                ${cellSize === 20 ? 'w-5 h-5' : 'w-6 h-6'}
                border border-gray-800
                ${isHead ? 'bg-green-400 shadow-lg shadow-green-400/50' : ''}
                ${isSnake && !isHead ? 'bg-green-500' : ''}
                ${isFood ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' : ''}
                ${!isSnake && !isFood ? 'bg-gray-800' : ''}
                ${isGameOver && isSnake ? 'opacity-50' : ''}
                transition-all duration-100
              `}
              style={{
                borderRadius: isHead ? '6px' : isFood ? '50%' : '2px',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}