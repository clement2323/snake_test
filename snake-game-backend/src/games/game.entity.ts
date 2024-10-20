import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Player } from '../auth/player.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column()
  duration: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_time: Date;

  @Column({ default: false })
  is_active: boolean;

  @Column({ default: 'snake-dirag' })
  nom_du_jeu: string;

  @Column()
  player_id: number;
}