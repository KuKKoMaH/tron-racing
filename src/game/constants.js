export const DIR_TOP        = 0;
export const DIR_RIGHT      = 1;
export const DIR_BOTTOM     = 2;
export const DIR_LEFT       = 3;

export const GAME_FRAMERATE = 30;
export const GAME_WIDTH     = 600;
export const GAME_HEIGHT    = 600;
export const GAME_COUNTDOWN = 3;
export const PLAYER_SIZE    = 9;
export const PLAYER_SPEED   = 5;
export const LINE_WIDTH     = 3;
export const PLAYERS_MAX    = 2;
export const PLAYERS        = [
  {
    position: [ 50, 300 ],
    color: 0xB8F6FB,
    direction: DIR_RIGHT
  },
  {
    position: [ 550, 300 ],
    color: 0xDFB8FB,
    direction: DIR_LEFT
  },
];

export const EVENT_END      = 'EVENT_END';
export const EVENT_KILL     = 'EVENT_KILL';
export const EVENT_START    = 'EVENT_START';
export const EVENT_COUNTDOWN = 'EVENT_COUNTDOWN';
export const EVENT_TURN     = 'EVENT_TURN';
export const EVENT_TICK     = 'EVENT_TICK';
export const EVENT_PLAYER_READY = 'EVENT_PLAYER_READY';
export const EVENT_ALL_READY = 'EVENT_ALLREADY';
export const EVENT_CREATE   = 'EVENT_CREATE';
export const EVENT_RESTART   = 'EVENT_RESTART';