import { GAME_HEIGHT, GAME_WIDTH, LINE_WIDTH } from '../Config';
import { DIR_LEFT, DIR_RIGHT, DIR_TOP, DIR_BOTTOM } from './constants';
import Player from "./Player";

export interface WallsConfig {
  width?: number;
  height?: number;
  lineWidth?: number;
}

export default class Walls {
  private width: number;
  private height: number;
  private lineWidth: number;
  private halfLineWidth: number;
  private walls: Array<Array<string>>;

  constructor( {width, height, lineWidth}: WallsConfig ) {
    this.width = width || GAME_WIDTH;
    this.height = height || GAME_HEIGHT;
    this.lineWidth = lineWidth || LINE_WIDTH;
    this.halfLineWidth = Math.floor(this.lineWidth / 2);
    this.walls = new Array(this.width);
    for (let i = 0; i < this.width; i++) {
      this.walls[i] = new Array(this.height);
    }

    this.playerUpdate = this.playerUpdate.bind(this);
  }

  public getConfig(): WallsConfig {
    return {
      width:     this.width,
      height:    this.height,
      lineWidth: this.lineWidth
    };
  }

  public tick( players: { [playerId: string]: Player } ) {
    for (const playerId in players) {
      this.playerUpdate(players[playerId], playerId);
    }
  }

  public reset() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.walls[i][j] = undefined;
      }
    }
  }

  private playerUpdate( player: Player, id: string ) {
    const hFrom = Math.max(Math.min(player.position[0], player.lastPosition[0]) - this.halfLineWidth, 0);
    const hTo = Math.min(Math.max(player.position[0], player.lastPosition[0]) + this.halfLineWidth, this.width);
    const vFrom = Math.max(Math.min(player.position[1], player.lastPosition[1]) - this.halfLineWidth, 0);
    const vTo = Math.min(Math.max(player.position[1], player.lastPosition[1]) + this.halfLineWidth, this.height);
    let i, j;
    for (i = hFrom; i <= hTo; i++) {
      for (j = vFrom; j <= vTo; j++) {
        this.walls[i][j] = id;
      }
    }
  }

  public checkCollision( player: Player ) {
    const dir = player.direction;
    const p = player.positionModel;
    const lp = player.lastPositionModel;
    if (p[DIR_LEFT] <= 0 || p[DIR_RIGHT] >= this.width || p[DIR_TOP] <= 0 || p[DIR_BOTTOM] >= this.height) return true;
    const h_from = p[DIR_LEFT] <= lp[DIR_LEFT] ? p[DIR_LEFT] : lp[DIR_RIGHT];
    const h_to = p[DIR_RIGHT] >= lp[DIR_RIGHT] ? p[DIR_RIGHT] : lp[DIR_LEFT];
    const v_from = p[DIR_TOP] <= lp[DIR_TOP] ? p[DIR_TOP] : lp[DIR_BOTTOM];
    const v_to = p[DIR_BOTTOM] >= lp[DIR_BOTTOM] ? p[DIR_BOTTOM] : lp[DIR_TOP];
    let i, j;
    for (i = h_from; i <= h_to; i++) {
      for (j = v_from; j <= v_to; j++) {
        if (this.walls[i][j] !== undefined) {
          return true;
        }
      }
    }
    return false;
  }
}