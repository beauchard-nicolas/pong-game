import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface MenuProps {
  onSelectMode: (mode: 'onePlayer' | 'twoPlayers', winningScore: number) => void;
  onOpenSettings: () => void;
}

const Menu: React.FC<MenuProps> = ({ onSelectMode, onOpenSettings }) => {
  const [selectedScore, setSelectedScore] = useState<number>(5);
  const [customScore, setCustomScore] = useState<number>(15);

  const handleScoreChange = (value: number) => {
    setSelectedScore(value);
  };

  const handleCustomScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setCustomScore(value);
    setSelectedScore(0);
  };

  const getWinningScore = () => {
    return selectedScore === 0 ? customScore : selectedScore;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 font-['Fredoka_One']">
      <h1 className="text-4xl font-bold text-white mb-8 uppercase">PONG GAME</h1>
      <div className="flex flex-col w-80 space-y-4">
        <button
          className="px-6 py-3 text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-600 uppercase h-16 w-full"
          onClick={() => onSelectMode('onePlayer', getWinningScore())}
        >
          UN JOUEUR
        </button>
        <button
          className="px-6 py-3 text-lg text-white bg-green-500 rounded-lg hover:bg-green-600 uppercase h-16 w-full"
          onClick={() => onSelectMode('twoPlayers', getWinningScore())}
        >
          DEUX JOUEURS
        </button>
      </div>
      <div className="mt-8 bg-gray-700 p-4 rounded-lg w-80">
        <h2 className="text-xl mb-4 text-white text-center">Nombre de manches</h2>
        <div className="grid grid-cols-2 gap-2">
          {[3, 5, 10, 0].map((score) => (
            <button
              key={score}
              className={`py-2 px-4 rounded ${
                selectedScore === score
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              } transition-colors duration-200`}
              onClick={() => handleScoreChange(score)}
            >
              {score === 0 ? 'Personnalisé' : `${score} manches`}
            </button>
          ))}
        </div>
        {selectedScore === 0 && (
          <div className="mt-2">
            <input
              type="number"
              value={customScore}
              onChange={handleCustomScoreChange}
              className="w-full bg-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
        )}
      </div>
      <button
        className="absolute top-4 right-4 p-2 text-white bg-gray-700 rounded-full hover:bg-gray-600"
        onClick={onOpenSettings}
      >
        <Settings size={24} />
      </button>
    </div>
  );
};

export default Menu;