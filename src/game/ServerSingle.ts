import Events from 'utils/Events';
import Server from './server/Server';
import { TurnDirection } from './server/Player';

export default class ServerSingle extends Events {
  private server: Server;

  constructor() {
    super();

    this.server = new Server({ players: ['player1', 'player2'] });

    this.server.on('all', ( event, options ) => this.emit(event, options));
  }

  turn(player: string,  direction: TurnDirection ) {
    this.server.turn(player, direction);
  }

  ready() {
    this.server.ready('player1');
    this.server.ready('player2');
  }

  restart() {
    this.server.reset();
    this.server.start();
  }
}