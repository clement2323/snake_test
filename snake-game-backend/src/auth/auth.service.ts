import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AuthService {
  private players: any[] = [];
  private readonly dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'src','data', 'players.json');
    this.loadPlayers();
  }

  private async loadPlayers() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      this.players = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, initialize with empty array
        this.players = [];
        await this.savePlayers();
      } else {
        throw error;
      }
    }
  }

  async register(userData: any) {
    const newPlayer = {
      id: this.players.length + 1,
      ...userData,
    };
    this.players.push(newPlayer);
    await this.savePlayers();
    return newPlayer;
  }

  async login(username: string, password: string) {
    const player = this.players.find(p => p.username === username && p.password === password);
    if (player) {
      const { password, ...result } = player;
      return result;
    }
    return null;
  }

  private async savePlayers() {
    await fs.writeFile(this.dataPath, JSON.stringify(this.players, null, 2));
  }
}
