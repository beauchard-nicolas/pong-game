export type InputType = 'SOURIS' | 'CLAVIER (Z/S)' | 'FLÈCHES' | 'PAVÉ NUM. (-/+)' | 'IA';
export type DifficultyLevel = 'FACILE' | 'MOYEN' | 'DIFFICILE';

export interface Player {
  inputType: InputType;
}

export interface GameState {
  gameMode: 'menu' | 'settings' | 'game';
  players: [Player, Player];
  difficulty: DifficultyLevel;
  winningScore: number;
}