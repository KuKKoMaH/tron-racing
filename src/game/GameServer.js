import Events from '../utils/Events';
import Player from './Player';
import Walls from './Walls';
import { PLAYERS, GAME_WIDTH, GAME_HEIGHT, GAME_FRAMERATE, GAME_COUNTDOWN, PLAYERS_MAX, DIR_BOTTOM, DIR_LEFT,
  DIR_RIGHT, DIR_TOP, EVENT_END, EVENT_KILL, EVENT_COUNTDOWN, EVENT_START, EVENT_CREATE, EVENT_TICK } from './constants';

export default class GameServer extends Events{
  constructor(config){
    super();

    const playersCount = Math.min(config.players.length, PLAYERS_MAX);
    this.allPlayers = [];
    this.indexPlayers = {};
    for(let i = 0; i < playersCount; i++){
      const id = config.players[i];
      const player = new Player(id, PLAYERS[i]);
      this.allPlayers.push(player);
      this.indexPlayers[id] = player;
    }

    if(playersCount == 1) this.checkEnd = this.checkEndSingle;

    this.players = [...this.allPlayers];
    this.width = config.width || GAME_WIDTH;
    this.height = config.height || GAME_HEIGHT;
    this.startDelay = config.countdown !== undefined ? config.countdown : GAME_COUNTDOWN;
    this.walls = new Walls({size:[this.width, this.height]});

    this.framerate = config.framerate || GAME_FRAMERATE;
    this._tickTime = 1000 / this.framerate;

    this.loop = null;

    setTimeout(() => {
      this.emit(EVENT_CREATE, [this.getConfig()]);
    }, 1000);
  }

  getConfig(){
    return {
      players: this.allPlayers.map(p => p.getConfig()),
      width: this.width,
      height: this.height,
      lineWidth: this.walls.lineWidth
    }
  }

  start(){
    this.countdown(this.startDelay);
  }

  countdown(delay){
    if(delay <= 0){
      this.emit(EVENT_START);
      this.loop = setInterval(() => this.tick(), this._tickTime);
    }else{
      this.emit(EVENT_COUNTDOWN, [delay]);
      setTimeout(() => this.countdown(delay - 1), 1000);
    }
  }

  end(){
    this.emit(EVENT_END, [this.winner ? this.winner.getConfig() : null]);
    clearTimeout(this.loop);
  }

  reset(){
    this.players = [...this.allPlayers];
    this.players.forEach(p => p.reset());
    this.walls.reset();
    this.winner = null;
  }

  turn(playerId, direction){
    if(this.loop) this.indexPlayers[playerId].turn(direction);
  }

  tick(){
    let need_update_players = false;
    this.players.forEach(p => p.tick());
    this.players.forEach((p, i) => {
      if(this.checkCollision(p)){
        p.kill();
        this.emit(EVENT_KILL, [i]);
        need_update_players = true;
      }
    });
    if(need_update_players) {
      this.updatePlayerList();
      this.checkEnd();

    }
    this.walls.tick(this.players);
    this.emit(EVENT_TICK, [this.getState()]);
  }

  checkCollision(player){
    const pm = player.position_model;
    return pm[DIR_LEFT] <= 0
      || pm[DIR_RIGHT] >= this.width
      || pm[DIR_TOP] <= 0
      || pm[DIR_BOTTOM] >= this.height
      || this.walls.checkCollision(player);
  }

  updatePlayerList() {
    this.players = this.players.filter(p => !p.isKilled);
  }

  checkEndSingle(){
    if(this.players.length == 0){
      this.end();
    }
  }

  checkEnd(){
    if (this.players.length < 2){
      this.winner = this.players[0];
      this.end();
    }
  }

  getState(){
    return this.allPlayers.map(p => {
      return [
        ...p.position,
        p.direction
      ]
    })
  }

  ready(pId){
    this.indexPlayers[pId].ready();
    if(this.players.every(p => p.isReady)){
      this.start();
    }
  }
}