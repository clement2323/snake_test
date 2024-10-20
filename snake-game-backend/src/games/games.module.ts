import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Game } from './game.entity';
import { Player } from '../auth/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
