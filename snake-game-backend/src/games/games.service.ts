import { Injectable, NotFoundException } from '@nestjs/common';
import { Game } from './game.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GamesService {
  private games: Game[] = [];
  private gamesFilePath = path.join(__dirname, '..', 'data', 'games.json');

  constructor() {
    this.loadGames();
  }

  private loadGames() {
    try {
      const data = fs.readFileSync(this.gamesFilePath, 'utf8');
      this.games = JSON.parse(data);
    } catch (error) {
      console.error('Error loading games:', error);
      this.games = [];
    }
  }

  private saveGames() {
    fs.writeFileSync(this.gamesFilePath, JSON.stringify(this.games, null, 2));
  }

  getHighScore(): number {
    return Math.max(...this.games.map(game => game.score));
  }

  getPlayerScore(playerId: number): number {
    const playerGames = this.games.filter(game => game.playerId === playerId);
    return Math.max(...playerGames.map(game => game.score), 0);
  }

  startNewGame(playerId: number): number {
    const newGameId = Math.max(...this.games.map(game => game.id)) + 1;
    const newGame: Game = {
      id: newGameId,
      playerId,
      score: 0,
      duration: 0,
      dateTime: new Date().toISOString(),
      isActive: true,
    };
    this.games.push(newGame);
    return newGameId;
  }

  updateScore(gameId: number, score: number): number {
    const game = this.games.find(g => g.id === gameId && g.isActive);
    if (!game) {
      throw new NotFoundException(`Active game with id ${gameId} not found`);
    }
    game.score = score;
    return score;
  }

  endGame(gameId: number): number {
    const game = this.games.find(g => g.id === gameId && g.isActive);
    if (!game) {
      throw new NotFoundException(`Active game with id ${gameId} not found`);
    }
    game.isActive = false;
    game.duration = (new Date().getTime() - new Date(game.dateTime).getTime()) / 1000;
    
    // Ajouter le jeu terminé à la liste des jeux
    const completedGame: Game = {
      id: game.id,
      playerId: game.playerId,
      score: game.score,
      duration: game.duration,
      dateTime: game.dateTime,
      isActive: false
    };
    
    // Remplacer l'ancien jeu par le jeu terminé dans la liste
    const index = this.games.findIndex(g => g.id === gameId);
    if (index !== -1) {
      this.games[index] = completedGame;
    } else {
      this.games.push(completedGame);
    }

    return game.score;
  }

  // Nouvelle méthode pour obtenir tous les jeux terminés
  getAllCompletedGames(): Game[] {
    return this.games.filter(game => !game.isActive);
  }

  getPlayerHighScore(playerId: number): number | null {
    const playerGames = this.games.filter(game => game.playerId === playerId);
    if (playerGames.length === 0) {
      return null;
    }
    return Math.max(...playerGames.map(game => game.score));
  }

  addNewGame(gameData: Partial<Game>): Game {
    const newGame: Game = {
      id: this.games.length + 1,
      playerId: gameData.playerId,
      score: gameData.score,
      duration: gameData.duration,
      dateTime: new Date().toISOString(),
      isActive: false
    };

    this.games.push(newGame);
    this.saveGames();
    return newGame;
  }
}
