import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async register(userData: Partial<Player>): Promise<Player> {
    // Vérifier si le nom d'utilisateur existe déjà
    const existingPlayer = await this.playerRepository.findOne({ where: { nom_utilisateur: userData.nom_utilisateur } });
    if (existingPlayer) {
      throw new ConflictException('Ce nom d\'utilisateur est déjà pris.');
    }

    // Créer et sauvegarder le nouveau joueur
    const newPlayer = this.playerRepository.create({
      nom_utilisateur: userData.nom_utilisateur,
      mot_de_passe: userData.mot_de_passe,
      prenom: userData.prenom,
      nom: userData.nom
    });
    return await this.playerRepository.save(newPlayer);
  }

  async login(nom_utilisateur: string, mot_de_passe: string): Promise<Omit<Player, 'mot_de_passe'> | null> {
    const player = await this.playerRepository.findOne({ where: { nom_utilisateur, mot_de_passe } });
    if (player) {
      const { mot_de_passe, ...result } = player;
      return result;
    }
    return null;
  }
}
