import Events from 'utils/Events';
import Server from './server/Server';
import { TurnDirection } from './server/Player';

export default class ServerSingle extends Events {
  public server: Server;

  constructor() {
    super();

    this.server = new Server({ players: ['player'] });

    this.server.on('all', ( event, options ) => {
      this.emit(event, options);
    });
  }

  turn( direction: TurnDirection ) {
    this.server.turn('player', direction);
  }

  ready() {
    this.server.ready('player');
  }

  reset() {
    this.server.reset();
    this.server.start();
  }
}