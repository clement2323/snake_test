import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [GamesModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
