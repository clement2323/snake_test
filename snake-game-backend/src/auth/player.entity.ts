import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nom_utilisateur: string;

  @Column()
  mot_de_passe: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  nom: string;

  @CreateDateColumn()
  created_at: Date;
}
