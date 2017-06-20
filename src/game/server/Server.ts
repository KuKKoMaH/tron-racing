import Events from 'utils/Events';
import Player, { PlayerConfig, TurnDirection } from './Player';
import Walls from './Walls';
import * as c from './constants';
import * as defaultConfig from '../Config';
import { GAME_HEIGHT, GAME_WIDTH } from "../Config";

interface ServerConfig {
  players: Array<string>;
  countdown?: number;
  width?: number;
  height?: number;
  framerate?: number;
}

export default class Server extends Events {
  private players: { [id: string]: Player };
  private walls: Walls;
  private alivePlayers: Array<string>;
  private allPlayers: Array<string>;
  private startDelay: number;
  private framerate: number;
  private _tickTime: number;
  private loop: number; // таймер тиков
  private countdownTimer: number;
  private winner: Player;

  constructor( config: ServerConfig ) {
    super();

    this.players = {};
    this.alivePlayers = [];
    this.allPlayers = [];
    const playersCount = Math.min(config.players.length, defaultConfig.PLAYERS_MAX);
    for (let i = 0; i < playersCount; i++) {
      const id = config.players[i];
      this.players[id] = new Player(id, defaultConfig.PLAYERS[i]);
      this.alivePlayers.push(id);
      this.allPlayers.push(id);
    }

    if (playersCount === 1) this.checkEnd = this.checkEndSingle;

    this.startDelay = config.countdown !== undefined ? config.countdown : defaultConfig.GAME_COUNTDOWN;
    this.walls = new Walls({
      width:  config.width || GAME_WIDTH,
      height: config.height || GAME_HEIGHT,
    });

    this.framerate = config.framerate || defaultConfig.GAME_FRAMERATE;
    this._tickTime = 1000 / this.framerate;

    this.loop = null;
    this.winner = null;

    setTimeout(() => {
      this.emit(c.EVENT_CREATE, this.getConfig());
    }, 1000);
  }

  getConfig() {
    return {
      players: this.alivePlayers.map(playerId => this.players[playerId].getConfig()),
      walls:   this.walls.getConfig(),
    };
  }

  start() {
    this.countdown(this.startDelay);
  }

  countdown( delay ) {
    if (delay <= 0) {
      this.emit(c.EVENT_START);
      this.loop = setInterval(() => this.tick(), this._tickTime);
    } else {
      this.emit(c.EVENT_COUNTDOWN, delay);
      this.countdownTimer = setTimeout(() => this.countdown(delay - 1), 1000);
    }
  }

  end() {
    this.emit(c.EVENT_END, this.winner ? this.winner.getConfig() : null);
    clearTimeout(this.loop);
    this.loop = null;
  }

  reset() {
    this.alivePlayers = [...this.allPlayers];
    this.alivePlayers.forEach(playerId => this.players[playerId].reset());
    this.walls.reset();
    this.winner = null;
    clearTimeout(this.countdownTimer);
    clearTimeout(this.loop);
    this.loop = null;
    this.countdownTimer = null;
    this.emit(c.EVENT_RESTART);
  }

  turn( playerId: string, direction: TurnDirection ) {
    if (this.loop) this.players[playerId].turn(direction);
  }

  tick() {
    let isPlayersCountChanged = false;
    this.alivePlayers.forEach(playerId => this.players[playerId].tick());
    this.alivePlayers.forEach(( playerId ) => {
      const player = this.players[playerId];
      if (this.walls.checkCollision(player)) {
        player.kill();
        this.emit(c.EVENT_KILL, playerId);
        isPlayersCountChanged = true;
      }
    });

    if (isPlayersCountChanged) {
      this.updatePlayerList();
      this.checkEnd();
    }
    this.walls.tick(this.players);
    this.emit(c.EVENT_TICK, this.getState());
  }

  updatePlayerList() {
    this.alivePlayers = this.alivePlayers.filter(playerId => !this.players[playerId].isKilled);
  }

  checkEndSingle() {
    if (this.alivePlayers.length === 0) {
      this.end();
    }
  }

  checkEnd() {
    if (this.alivePlayers.length < 2) {
      this.winner = this.players[0];
      this.end();
    }
  }

  getState() {
    return this.allPlayers.map(playerId => this.players[playerId].getCurrentConfig());
  }

  ready( playerId: string ) {
    this.players[playerId].ready();
    if (this.allPlayers.every(playerId => this.players[playerId].isReady)) {
      this.start();
    }
  }
}