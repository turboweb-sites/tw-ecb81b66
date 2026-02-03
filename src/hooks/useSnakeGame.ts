import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, Direction, GameState } from '../types/game';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_SPEED = 150;

const generateRandomFood = (snake: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

export const useSnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: generateRandomFood(INITIAL_SNAKE),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    isGameOver: false,
    isPaused: false,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    speed: INITIAL_SPEED,
  });

  const gameLoopRef = useRef<number | null>(null);

  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.isGameOver || prevState.isPaused) return prevState;

      const { snake, food, nextDirection, score, highScore, speed } = prevState;
      const head = snake[0];
      let newHead: Position;

      switch (nextDirection) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        const newHighScore = Math.max(score, highScore);
        localStorage.setItem('snakeHighScore', newHighScore.toString());
        return { ...prevState, isGameOver: true, highScore: newHighScore };
      }

      // Check self collision
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        const newHighScore = Math.max(score, highScore);
        localStorage.setItem('snakeHighScore', newHighScore.toString());
        return { ...prevState, isGameOver: true, highScore: newHighScore };
      }

      const newSnake = [newHead, ...snake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        const newSpeed = Math.max(50, speed - 5);
        return {
          ...prevState,
          snake: newSnake,
          food: generateRandomFood(newSnake),
          score: newScore,
          direction: nextDirection,
          speed: newSpeed,
        };
      }

      // Normal move (remove tail)
      newSnake.pop();
      return {
        ...prevState,
        snake: newSnake,
        direction: nextDirection,
      };
    });
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    setGameState(prevState => {
      if (prevState.isGameOver) return prevState;

      const { direction } = prevState;
      let newDirection = direction;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') newDirection = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') newDirection = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') newDirection = 'RIGHT';
          break;
        case ' ':
          return { ...prevState, isPaused: !prevState.isPaused };
        case 'Enter':
          if (prevState.isGameOver) {
            return {
              ...prevState,
              snake: INITIAL_SNAKE,
              food: generateRandomFood(INITIAL_SNAKE),
              direction: 'RIGHT',
              nextDirection: 'RIGHT',
              score: 0,
              isGameOver: false,
              isPaused: false,
              speed: INITIAL_SPEED,
            };
          }
          return prevState;
        default:
          return prevState;
      }

      return { ...prevState, nextDirection: newDirection as Direction };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      snake: INITIAL_SNAKE,
      food: generateRandomFood(INITIAL_SNAKE),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      isGameOver: false,
      isPaused: false,
      speed: INITIAL_SPEED,
    }));
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isPaused: !prevState.isPaused,
    }));
  }, []);

  // Set up keyboard controls
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    if (!gameState.isGameOver && !gameState.isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, gameState.speed);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveSnake, gameState.isGameOver, gameState.isPaused, gameState.speed]);

  return {
    gameState,
    resetGame,
    togglePause,
    GRID_SIZE,
  };
};