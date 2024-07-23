import { CANVAS_HEIGHT, CANVAS_WIDTH, INITIAL_BALL_SPEED } from './constants';
import { DifficultyLevel } from '../types';

export const resetBall = () => ({
  position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
  velocity: {
    x: (Math.random() > 0.5 ? 1 : -1) * INITIAL_BALL_SPEED,
    y: (Math.random() * 2 - 1) * INITIAL_BALL_SPEED
  }
});

export const getAISpeed = (difficulty: DifficultyLevel): number => {
  switch (difficulty) {
    case 'FACILE': return 200; // pixels par seconde
    case 'MOYEN': return 300;
    case 'DIFFICILE': return 400;
    default: return 300;
  }
};