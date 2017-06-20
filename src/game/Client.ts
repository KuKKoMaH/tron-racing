import * as c from './server/constants';
import Events from 'utils/Events';
import Render from './Render';
import { TurnDirection, PlayerConfig } from './server/Player';
import { WallsConfig } from './server/Walls';

export default class Client extends Events {
  public server: any;
  public render: Render;

  constructor( server: any ) {
    super();

    this.server = server;
    this.render = null;

    this.onKeyDown = this.onKeyDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);

    this.server.on('all', ( event, data ) => this.emit(event, data));
    this.server.on(c.EVENT_CREATE, ( event, config ) => this.create(config));
    this.server.on(c.EVENT_COUNTDOWN, ( event, value ) => this.render.countdown(value));
    this.server.on(c.EVENT_TICK, ( event, state ) => this.render.setState(state));
    this.server.on(c.EVENT_KILL, ( event, playerId ) => this.render.kill(playerId));
    this.server.on(c.EVENT_END, ( event, player ) => this.render.end(player));
    this.server.on(c.EVENT_RESTART, ( event, player ) => this.render.reset());
  }

  public destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  private create( config: { players: Array<PlayerConfig>, walls: WallsConfig } ) {
    this.render = new Render({
      players:   config.players,
      width:     config.walls.width,
      height:    config.walls.height,
      lineWidth: config.walls.lineWidth,
    });
  }

  private onKeyDown( e ) {
    switch (e.keyCode) {
      case 37: // left arrow
        e.preventDefault();
        this.server.turn(TurnDirection.Left);
        break;
      case 39: // right arrow
        e.preventDefault();
        this.server.turn(TurnDirection.Right);
        break;
      case 65: // A
        e.preventDefault();
        this.server.turn(TurnDirection.Left);
        break;
      case 68: // D
        e.preventDefault();
        this.server.turn(TurnDirection.Right);
        break;
    }
  }
}