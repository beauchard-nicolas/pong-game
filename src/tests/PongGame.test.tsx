import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PongGame from '../components/PongGame';

describe('PongGame', () => {
  test('renders the main menu initially', () => {
    render(<PongGame />);
    expect(screen.getByText(/PONG GAME/i)).toBeInTheDocument();
    expect(screen.getByText(/UN JOUEUR/i)).toBeInTheDocument();
    expect(screen.getByText(/DEUX JOUEURS/i)).toBeInTheDocument();
  });

  test('opens settings menu when settings button is clicked', () => {
    render(<PongGame />);
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    expect(screen.getByText(/PARAMÈTRES/i)).toBeInTheDocument();
  });

  test('starts single player game when "UN JOUEUR" is clicked', () => {
    render(<PongGame />);
    const singlePlayerButton = screen.getByText(/UN JOUEUR/i);
    fireEvent.click(singlePlayerButton);
    expect(screen.getByText(/IA:/i)).toBeInTheDocument();
  });

  test('starts two player game when "DEUX JOUEURS" is clicked', () => {
    render(<PongGame />);
    const twoPlayersButton = screen.getByText(/DEUX JOUEURS/i);
    fireEvent.click(twoPlayersButton);
    expect(screen.getByText(/Joueur 1:/i)).toBeInTheDocument();
    expect(screen.getByText(/Joueur 2:/i)).toBeInTheDocument();
  });

  test('allows setting winning score', () => {
    render(<PongGame />);
    const customScoreButton = screen.getByText(/Personnalisé/i);
    fireEvent.click(customScoreButton);
    const scoreInput = screen.getByRole('spinbutton');
    fireEvent.change(scoreInput, { target: { value: '15' } });
    expect(scoreInput).toHaveValue(15);
  });

});