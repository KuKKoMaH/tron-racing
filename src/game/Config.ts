import { PlayerConfig } from './server/Player';
import * as c from './server/constants';

export const GAME_FRAMERATE = 30;
export const GAME_WIDTH = 600;
export const GAME_HEIGHT = 600;
export const GAME_COUNTDOWN = 3;
export const PLAYER_SIZE = 9;
export const PLAYER_SPEED = 10;
export const LINE_WIDTH = 3;
export const PLAYERS_MAX = 2;
export const PLAYERS: Array<PlayerConfig> = [
  {
    position:  [50, 300],
    color:     0xB8F6FB,
    direction: c.DIR_RIGHT
  },
  {
    position:  [550, 300],
    color:     0xDFB8FB,
    direction: c.DIR_LEFT
  },
];
