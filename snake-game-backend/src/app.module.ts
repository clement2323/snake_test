import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { Player } from './auth/player.entity';
import { Game } from './games/game.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'clementguillo',
      password: '',
      database: 'dirag_game',
      entities: [Player, Game],
      synchronize: false,
      logging: true,
    }),
    GamesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('Database connection successful');

      // Vérification pour la table 'players'
      const tableInfo = await this.dataSource.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'players'
      `);
      console.log('Structure de la table players:', tableInfo);

      const nomUtilisateurColumn = tableInfo.find(col => col.column_name === 'nom_utilisateur');
      if (nomUtilisateurColumn) {
        console.log('La colonne nom_utilisateur existe:', nomUtilisateurColumn);
      } else {
        console.log('La colonne nom_utilisateur n\'existe pas dans la table players');
      }

      const metadata = this.dataSource.getMetadata(Player);
      const entityColumns = metadata.columns.map(col => col.databaseName);
      console.log('Colonnes définies dans l\'entité Player:', entityColumns);

      // Vérification pour la table 'game'
      const gameTableInfo = await this.dataSource.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'game'
      `);
      console.log('Structure de la table game:', gameTableInfo);

      const idPartieColumn = gameTableInfo.find(col => col.column_name === 'id_partie');
      if (idPartieColumn) {
        console.log('La colonne id_partie existe:', idPartieColumn);
      } else {
        console.log('La colonne id_partie n\'existe pas dans la table game');
      }

      // Assurez-vous d'importer l'entité Game si ce n'est pas déjà fait
      const gameMetadata = this.dataSource.getMetadata(Game);
      const gameEntityColumns = gameMetadata.columns.map(col => col.databaseName);
      console.log('Colonnes définies dans l\'entité Game:', gameEntityColumns);

    } catch (error) {
      console.error('Database connection or query failed:', error);
    }
  }
}
