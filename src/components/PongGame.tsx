import React, { useState } from 'react';
import Menu from './Menu';
import SettingsMenu from './SettingsMenu';
import GameBoard from './GameBoard';
import { GameState, Player, InputType, DifficultyLevel } from '../types';

const PongGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    gameMode: 'menu',
    players: [
      { inputType: 'SOURIS' },
      { inputType: 'CLAVIER (Z/S)' }
    ],
    difficulty: 'MOYEN',
    winningScore: 5 
  });

  const handleSelectMode = (mode: 'onePlayer' | 'twoPlayers', winningScore: number) => {
    setGameState(prevState => ({
      ...prevState,
      gameMode: 'game',
      players: mode === 'onePlayer' 
        ? [prevState.players[0], { inputType: 'IA' as InputType }] 
        : prevState.players,
      winningScore: winningScore
    }));
  };

  const handleOpenSettings = () => {
    setGameState(prevState => ({ ...prevState, gameMode: 'settings' }));
  };

  const handleCloseSettings = () => {
    setGameState(prevState => ({ ...prevState, gameMode: 'menu' }));
  };

  const handleChangeDifficulty = (difficulty: DifficultyLevel) => {
    setGameState(prevState => ({ ...prevState, difficulty }));
  };

  const handleChangeInput = (playerIndex: number, inputType: InputType) => {
    setGameState(prevState => {
      const newPlayers = [...prevState.players] as [Player, Player];
      newPlayers[playerIndex] = { inputType };
      return { ...prevState, players: newPlayers };
    });
  };

  const handleReturnToMenu = () => {
    setGameState(prevState => ({ ...prevState, gameMode: 'menu' }));
  };

  switch (gameState.gameMode) {
    case 'menu':
      return <Menu onSelectMode={(mode, winningScore) => handleSelectMode(mode, winningScore)} onOpenSettings={handleOpenSettings} /> ;
    case 'settings':
      return (
        <SettingsMenu
          players={gameState.players}
          difficulty={gameState.difficulty}
          onChangeDifficulty={handleChangeDifficulty}
          onChangeInput={handleChangeInput}
          onClose={handleCloseSettings}
        />
      );
    case 'game':
      return (
        <GameBoard
          gameMode={gameState.players[1].inputType === 'IA' ? 'onePlayer' : 'twoPlayers'}
          difficulty={gameState.difficulty}
          players={gameState.players}
          winningScore={gameState.winningScore}
          onReturnToMenu={handleReturnToMenu}
        />
      );
    default:
      return null;
  }
};

export default PongGame;