import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nom_utilisateur: string;

  @Column()
  mot_de_passe: string;

  @Column()
  prenom: string;

  @Column()
  nom: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
