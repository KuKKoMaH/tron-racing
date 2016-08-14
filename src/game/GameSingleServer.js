import { EVENT_CREATE, EVENT_PLAYER_READY, EVENT_START, EVENT_COUNTDOWN, EVENT_TICK, EVENT_TURN, EVENT_KILL,
  EVENT_END } from './constants';
import GameAbstractServer from './GameAbstractServer';

export default class GameSingleServer extends GameAbstractServer{
  constructor(peerId, server){
    super(peerId);

    this.server = server;

    this.server.on(EVENT_CREATE, config => {
      this.create(config);
      this.emit(EVENT_CREATE, [this.game.getView()]);
    });

    this.server.on(EVENT_COUNTDOWN, value => {
      this.countdown(value);
    });

    this.server.on(EVENT_TICK, state => {
      this.game.setState(state);
    });

    this.server.on(EVENT_KILL, i => {
      this.game.kill(i);
    });

    this.server.on(EVENT_END, player => {
      this.game.end(player);
      this.emit(EVENT_END);
    })
  }

  turn(direction){
    this.turnPlayer(this.peerId, direction);
  }

  ready(id = this.peerId) {
    this.server.ready(id);
  }

  reset(){
    super.reset();
    this.server.reset();
    this.server.start();
  }
}