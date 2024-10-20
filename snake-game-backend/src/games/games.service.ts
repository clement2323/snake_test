import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { Player } from '../auth/player.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async getHighScore(): Promise<number> {
    const game = await this.gamesRepository.findOne({
      order: { score: 'DESC' },
    });
    return game ? game.score : 0;
  }

  async getPlayerHighScore(player_id: number): Promise<number> {
    const game = await this.gamesRepository.findOne({
      where: { player_id },
      order: { score: 'DESC' },
    });
    return game ? game.score : 0;
  }

  async startNewGame(player_id: number): Promise<number> {
    const newGame = this.gamesRepository.create({
      player_id,
      date_time: new Date().toISOString(),
      score: 0,
      duration: 0,
      is_active: true,
    });
    const savedGame = await this.gamesRepository.save(newGame);
    return savedGame.id;
  }

  async updateScore(game_id: number, score: number): Promise<number> {
    const game = await this.gamesRepository.findOne({
      where: { id: game_id, is_active: true },
    });
    if (!game) {
      throw new NotFoundException(`Active game with id ${game_id} not found`);
    }
    game.score = score;
    await this.gamesRepository.save(game);
    return score;
  }

  async endGame(gameId: number): Promise<number> {
    const game = await this.gamesRepository.findOne({
      where: { id: gameId, is_active: true },
    });
    if (!game) {
      throw new NotFoundException(`Active game with id ${gameId} not found`);
    }
    game.is_active = false;
    game.duration = Math.floor((Date.now() - game.date_time.getTime()) / 1000);
    await this.gamesRepository.save(game);
    return game.score;
  }

  async getAllCompletedGames(): Promise<Game[]> {
    return this.gamesRepository.find({ where: { is_active: false } });
  }

  async addNewGame(gameData: Partial<Game>): Promise<Game> {
    const newGame = this.gamesRepository.create(gameData);
    return this.gamesRepository.save(newGame);
  }

  async getHighScoreUser(): Promise<{ nom_utilisateur: string; high_score: number }> {
    const games = await this.gamesRepository.find({
      order: { score: 'DESC' },
      take: 1,
    });

    if (games.length === 0) {
      return { nom_utilisateur: 'No games played yet', high_score: 0 };
    }

    const game = games[0];
    
    if (!game.player_id) {
      throw new NotFoundException(`Player ID for game with id ${game.id} not found`);
    }

    const player = await this.playerRepository.findOne({
      where: { id: game.player_id }
    });

    if (!player) {
      throw new NotFoundException(`Player with id ${game.player_id} not found`);
    }

    return { nom_utilisateur: player.nom_utilisateur, high_score: game.score };
  }
}
