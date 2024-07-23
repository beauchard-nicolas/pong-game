import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Player, DifficultyLevel, InputType } from '../types';
import { INPUT_TYPES, DIFFICULTY_LEVELS } from '../utils/constants';

interface SettingsMenuProps {
  players: [Player, Player];
  difficulty: DifficultyLevel;
  onChangeDifficulty: (difficulty: DifficultyLevel) => void;
  onChangeInput: (playerIndex: number, inputType: InputType) => void;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  players,
  difficulty,
  onChangeDifficulty,
  onChangeInput,
  onClose
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 font-['Fredoka_One']">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold uppercase">PARAMÈTRES</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 uppercase">DIFFICULTÉ IA</h3>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTY_LEVELS.map((level) => (
              <button
                key={level}
                className={`p-2 rounded text-sm ${
                  difficulty === level
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => onChangeDifficulty(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        {players.map((player, index) => (
          <div key={index} className={`mb-4 p-2 rounded ${index === 0 ? 'bg-blue-100' : 'bg-green-100'}`}>
            <h3 className="font-semibold mb-2 uppercase">JOUEUR {index + 1}</h3>
            <div className="grid grid-cols-2 gap-2">
              {INPUT_TYPES.map((type) => (
                <button
                  key={type}
                  className={`p-2 rounded text-sm ${
                    player.inputType === type
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } ${players.some((p, i) => i !== index && p.inputType === type) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => onChangeInput(index, type)}
                  disabled={players.some((p, i) => i !== index && p.inputType === type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsMenu;