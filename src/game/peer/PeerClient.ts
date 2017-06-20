import { EVENT_TURN, EVENT_PLAYER_READY } from '../server/constants';
import Events from 'utils/Events';
import { TurnDirection } from '../server/Player';

export default class PeerClient extends Events {
  private peerId: string;
  private connect: any;

  constructor( peerId: string, connect: any ) {
    super();

    this.peerId = peerId;
    this.connect = connect;

    this.connect.on('data', ( { event, options } ) => this.emit(event, options));
  }

  turn( direction: TurnDirection ) {
    this.connect.send({ event: EVENT_TURN, options: { playerId: this.peerId, direction } });
  }

  ready() {
    this.connect.send({ event: EVENT_PLAYER_READY, options: { playerId: this.peerId } });
  }
}