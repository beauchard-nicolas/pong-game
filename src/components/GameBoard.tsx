import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player, DifficultyLevel } from '../types';
import { PADDLE_HEIGHT, PADDLE_WIDTH, BALL_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/constants';

interface GameBoardProps {
  gameMode: 'onePlayer' | 'twoPlayers';
  difficulty: DifficultyLevel;
  players: [Player, Player];
  winningScore: number;
  onReturnToMenu: () => void;
}

const BALL_SPEED = 5;
const PADDLE_SPEED = 10;

const GameBoard: React.FC<GameBoardProps> = ({ gameMode, difficulty, players, winningScore, onReturnToMenu }) => {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, speedX: BALL_SPEED, speedY: 0 });
  const paddle1Ref = useRef(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const paddle2Ref = useRef(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  // Set default input types
  const player1InputType = players[0].inputType || 'SOURIS';
  const player2InputType = gameMode === 'twoPlayers' ? (players[1].inputType || '') : 'IA';

  const resetBall = useCallback(() => {
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      speedX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      speedY: (Math.random() - 0.5) * BALL_SPEED
    };
  }, []);

  const checkGameOver = useCallback(() => {
    if (player1Score >= winningScore || player2Score >= winningScore) {
      setGameOver(true);
    }
  }, [player1Score, player2Score, winningScore]);

  const updateGameState = useCallback((time: number) => {
    if (gameOver) return;

    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      // Update ball position
      ballRef.current.x += ballRef.current.speedX * deltaTime * 0.03;
      ballRef.current.y += ballRef.current.speedY * deltaTime * 0.03;

      // Ball collision with top and bottom walls
      if (ballRef.current.y <= BALL_SIZE / 2 || ballRef.current.y >= CANVAS_HEIGHT - BALL_SIZE / 2) {
        ballRef.current.speedY = -ballRef.current.speedY;
      }

      // Ball collision with paddles
      if (
        (ballRef.current.x - BALL_SIZE / 2 <= PADDLE_WIDTH && ballRef.current.y >= paddle1Ref.current && ballRef.current.y <= paddle1Ref.current + PADDLE_HEIGHT) ||
        (ballRef.current.x + BALL_SIZE / 2 >= CANVAS_WIDTH - PADDLE_WIDTH && ballRef.current.y >= paddle2Ref.current && ballRef.current.y <= paddle2Ref.current + PADDLE_HEIGHT)
      ) {
        ballRef.current.speedX = -ballRef.current.speedX * 1.1;
        ballRef.current.speedY += (Math.random() - 0.5) * 2;
      }

      // Ball out of bounds
      if (ballRef.current.x < 0) {
        setPlayer2Score(prevScore => {
          const newScore = prevScore + 1;
          checkGameOver();
          return newScore;
        });
        resetBall();
      } else if (ballRef.current.x > CANVAS_WIDTH) {
        setPlayer1Score(prevScore => {
          const newScore = prevScore + 1;
          checkGameOver();
          return newScore;
        });
        resetBall();
      }

      // AI movement for single player mode
      if (gameMode === 'onePlayer') {
        const aiSpeed = difficulty === 'FACILE' ? 2 : difficulty === 'MOYEN' ? 4 : 6;
        if (paddle2Ref.current + PADDLE_HEIGHT / 2 < ballRef.current.y - 35) {
          paddle2Ref.current = Math.min(paddle2Ref.current + aiSpeed, CANVAS_HEIGHT - PADDLE_HEIGHT);
        } else if (paddle2Ref.current + PADDLE_HEIGHT / 2 > ballRef.current.y + 35) {
          paddle2Ref.current = Math.max(paddle2Ref.current - aiSpeed, 0);
        }
      }

      // Render game state
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (context) {
        context.fillStyle = 'black';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.fillStyle = 'white';
        context.fillRect(0, paddle1Ref.current, PADDLE_WIDTH, PADDLE_HEIGHT);
        context.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, paddle2Ref.current, PADDLE_WIDTH, PADDLE_HEIGHT);

        context.beginPath();
        context.arc(ballRef.current.x, ballRef.current.y, BALL_SIZE / 2, 0, Math.PI * 2);
        context.fill();

        context.font = '24px Arial';
        context.fillText(player1Score.toString(), CANVAS_WIDTH / 4, 30);
        context.fillText(player2Score.toString(), 3 * CANVAS_WIDTH / 4, 30);

        // Display input types
        context.font = '16px Arial';
        context.fillText(player1InputType, 10, CANVAS_HEIGHT - 10);
        if (gameMode === 'onePlayer') {
          context.fillText(difficulty, CANVAS_WIDTH / 2 - 20, CANVAS_HEIGHT - 10);
        } else {
          context.fillText(player2InputType, CANVAS_WIDTH - 70, CANVAS_HEIGHT - 10);
        }

        context.setLineDash([5, 15]);
        context.beginPath();
        context.moveTo(CANVAS_WIDTH / 2, 0);
        context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
        context.strokeStyle = 'white';
        context.stroke();
      }
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(updateGameState);
  }, [gameMode, difficulty, resetBall, player1InputType, player2InputType, gameOver, checkGameOver]);

  useEffect(() => {
    resetBall();
    requestRef.current = requestAnimationFrame(updateGameState);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [resetBall, updateGameState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Contrôles du joueur 1
      if (player1InputType === 'CLAVIER (Z/S)') {
        if (event.key === 'z' || event.key === 'Z') paddle1Ref.current = Math.max(paddle1Ref.current - PADDLE_SPEED, 0);
        if (event.key === 's' || event.key === 'S') paddle1Ref.current = Math.min(paddle1Ref.current + PADDLE_SPEED, CANVAS_HEIGHT - PADDLE_HEIGHT);
      } else if (player1InputType === 'FLÈCHES') {
        if (event.key === 'ArrowUp') paddle1Ref.current = Math.max(paddle1Ref.current - PADDLE_SPEED, 0);
        if (event.key === 'ArrowDown') paddle1Ref.current = Math.min(paddle1Ref.current + PADDLE_SPEED, CANVAS_HEIGHT - PADDLE_HEIGHT);
      } else if (player1InputType === 'PAVÉ NUM. (-/+)') {
        if (event.key === '-') paddle1Ref.current = Math.max(paddle1Ref.current - PADDLE_SPEED, 0);
        if (event.key === '+') paddle1Ref.current = Math.min(paddle1Ref.current + PADDLE_SPEED, CANVAS_HEIGHT - PADDLE_HEIGHT);
      }

      // Contrôles du joueur 2 (seulement en mode deux joueurs)
      if (gameMode === 'twoPlayers') {
        if (player2InputType === 'CLAVIER (Z/S)') {
          if (event.key === 'z' || event.key === 'Z') paddle2Ref.current = Math.max(paddle2Ref.current - PADDLE_SPEED, 0);
          if (event.key === 's' || event.key === 'S') paddle2Ref.current = Math.min(paddle2Ref.current + PADDLE_SPEED, CANVAS_HEIGHT - PADDLE_HEIGHT);
        } else if (player2InputType === 'FLÈCHES') {
          if (event.key === 'ArrowUp') paddle2Ref.current = Math.max(paddle2Ref.current - PADDLE_SPEED, 0);
          if (event.key === 'ArrowDown') paddle2Ref.current = Math.min(paddle2Ref.current + PADDLE_SPEED, CANVAS_HEIGHT - PADDLE_HEIGHT);
        } else if (player2InputType === 'PAVÉ NUM. (-/+)') {
          if (event.key === '-') paddle2Ref.current = Math.max(paddle2Ref.current - PADDLE_SPEED, 0);
          if (event.key === '+') paddle2Ref.current = Math.min(paddle2Ref.current + PADDLE_SPEED, CANVAS_HEIGHT - PADDLE_HEIGHT);
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseY = event.clientY - rect.top - PADDLE_HEIGHT / 2;
        if (player1InputType === 'SOURIS') {
          paddle1Ref.current = Math.max(0, Math.min(mouseY, CANVAS_HEIGHT - PADDLE_HEIGHT));
        }
        if (gameMode === 'twoPlayers' && player2InputType === 'SOURIS') {
          paddle2Ref.current = Math.max(0, Math.min(mouseY, CANVAS_HEIGHT - PADDLE_HEIGHT));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameMode, player1InputType, player2InputType]);

  useEffect(() => {
    if (gameOver) {
      const winner = player1Score > player2Score ? 'Joueur 1' : 'Joueur 2';
      alert(`Partie terminée ! ${winner} a gagné !`);
      onReturnToMenu();
    }
  }, [gameOver, player1Score, player2Score, onReturnToMenu]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      {gameMode === 'twoPlayers' && !player2InputType && (
        <div className="text-red-500 font-bold mb-4">Pas d'entrée saisie pour joueur 2 !</div>
      )}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-white"
      />
      <button 
        className="mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        onClick={onReturnToMenu}
      >
        RETOUR AU MENU
      </button>
    </div>
  );
};

export default GameBoard;