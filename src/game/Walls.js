import { GAME_HEIGHT, GAME_WIDTH, LINE_WIDTH, DIR_LEFT, DIR_RIGHT, DIR_TOP, DIR_BOTTOM } from './constants';

export default class Walls {
  constructor(config) {
    this.width = config.size[0] || GAME_WIDTH;
    this.height = config.size[1] || GAME_HEIGHT;
    this.lineWidth = config.width || LINE_WIDTH;
    this.half_line_width = Math.floor(this.lineWidth / 2);
    this.walls = new Array(this.width);
    for(var i = 0; i < this.width; i++){
      this.walls[i] = new Array(this.height);
    }
  }

  tick(players) {
    players.forEach(p => this.playerUpdate(p));
  }

  playerUpdate(player) {
    var h_from = Math.min(player.position[0], player.last_position[0]) - this.half_line_width,
      h_to = Math.max(player.position[0], player.last_position[0]) + this.half_line_width,
      v_from = Math.min(player.position[1], player.last_position[1]) - this.half_line_width,
      v_to = Math.max(player.position[1], player.last_position[1]) + this.half_line_width,
      i, j;
    for(i = h_from; i <= h_to; i++){
      for(j = v_from; j <= v_to; j++){
        this.walls[i][j] = true;
      }
    }
  }

  checkCollision(player) {
    const dir = player.direction,
      p = player.position_model,
      lp = player.last_position_model,
      h_from = p[DIR_LEFT] <= lp[DIR_LEFT] ? p[DIR_LEFT] : lp[DIR_RIGHT],
      h_to =  p[DIR_RIGHT] >= lp[DIR_RIGHT] ? p[DIR_RIGHT] : lp[DIR_LEFT],
      v_from = p[DIR_TOP] <= lp[DIR_TOP] ? p[DIR_TOP] : lp[DIR_BOTTOM],
      v_to =  p[DIR_BOTTOM] >= lp[DIR_BOTTOM] ? p[DIR_BOTTOM] : lp[DIR_TOP];
    let i, j;
    for(i = h_from; i <= h_to; i++){
      for(j = v_from; j <= v_to; j++){
        if(this.walls[i][j]) {
          return true;
        }
      }
    }
  }
}