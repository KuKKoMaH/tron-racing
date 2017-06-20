import { EVENT_TURN, EVENT_PLAYER_READY } from '../server/constants';
import Events from 'utils/Events';
import Server from '../server/Server';
import { TurnDirection } from '../server/Player';

export default class PeerServer extends Events {
  private peerId: string;
  private connect: any;
  private server: Server;

  constructor( peerId: string, connect: any ) {
    super();

    this.peerId = peerId;
    this.connect = connect;
    this.server = new Server({ players: [peerId, connect.peer] });

    this.server.on('all', ( event, options ) => {
      this.emit(event, options);
      this.connect.send({ event, options });
    });

    this.connect.on('data', ( { event, options } ) => {
      switch (event) {
        case EVENT_TURN:
          this.server.turn(options.playerId, options.direction);
          break;
        case EVENT_PLAYER_READY:
          this.server.ready(options.playerId);
          break;
      }
    })
  }

  turn( direction: TurnDirection ) {
    this.server.turn(this.peerId, direction);
  }

  ready() {
    this.server.ready(this.peerId);
  }

  restart() {
    this.server.reset();
    this.server.start();
  }
}