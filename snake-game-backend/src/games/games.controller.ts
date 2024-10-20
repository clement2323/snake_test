import { Controller, Get, Post, Put, Param, Body, ParseIntPipe } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './game.entity';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('highscore/global')
  async getGlobalHighScore(): Promise<{ highScore: number }> {
    const highScore = await this.gamesService.getHighScore();
    return { highScore };
  }

  @Get('highscore/player/:id')
  async getPlayerHighScore(@Param('id', ParseIntPipe) playerId: number): Promise<{ highScore: number }> {
    const highScore = await this.gamesService.getPlayerHighScore(playerId);
    return { highScore: highScore ?? 0 };
  }

  @Post('start')
  async startNewGame(@Body('playerId', ParseIntPipe) playerId: number): Promise<{ gameId: number }> {
    const gameId = await this.gamesService.startNewGame(playerId);
    return { gameId };
  }

  @Post('add')
  async addNewGame(@Body() gameData: Partial<Game>): Promise<Game> {
    return await this.gamesService.addNewGame(gameData);
  }

  @Get('highscore/user')
  async getHighScoreUser(): Promise<{ nom_utilisateur: string; high_score: number }> {
    return await this.gamesService.getHighScoreUser();
  }
}
