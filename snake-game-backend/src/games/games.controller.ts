import { Controller, Get, Post, Put, Param, Body, ParseIntPipe } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './game.interface'; // Change this import

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('highscore/global')
  getGlobalHighScore(): { highScore: number } {
    return { highScore: this.gamesService.getHighScore() };
  }

  @Get('highscore/player/:id')
  getPlayerHighScore(@Param('id', ParseIntPipe) playerId: number): { highScore: number } {
    const highScore = this.gamesService.getPlayerHighScore(playerId);
    if (highScore === null) {
      return { highScore: 0 };
    }
    return { highScore };
  }

  @Post('start')
  startNewGame(@Body('playerId', ParseIntPipe) playerId: number): { gameId: number } {
    return { gameId: this.gamesService.startNewGame(playerId) };
  }

  @Put(':id/score')
  updateScore(
    @Param('id', ParseIntPipe) gameId: number,
    @Body('score', ParseIntPipe) score: number
  ): { updatedScore: number } {
    return { updatedScore: this.gamesService.updateScore(gameId, score) };
  }

  @Post(':id/end')
  endGame(@Param('id', ParseIntPipe) gameId: number): { finalScore: number } {
    return { finalScore: this.gamesService.endGame(gameId) };
  }

  @Get('completed')
  getAllCompletedGames(): Game[] {
    return this.gamesService.getAllCompletedGames();
  }

  @Post('add')
  addNewGame(@Body() gameData: Partial<Game>): Game {
    return this.gamesService.addNewGame(gameData);
  }
}
