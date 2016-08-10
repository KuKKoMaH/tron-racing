import { EVENT_CREATE, EVENT_PLAYER_READY, EVENT_COUNTDOWN, EVENT_TURN, EVENT_TICK, EVENT_KILL,
  EVENT_END} from './constants';
import GameAbstractServer from './GameAbstractServer';

export default class GameRemoteServer extends GameAbstractServer{
  constructor(peerId, connect){
    super(peerId, connect);

    this.connect.on('data', data => {
      switch(data.type){
        case EVENT_CREATE:
          this.create(data.config);
          this.emit(EVENT_CREATE, [this.game.getView()]);
          break;
        case EVENT_COUNTDOWN:
          this.countdown(data.value);
          break;
        case EVENT_TICK:
          this.game.setState(data.state);
          break;
        case EVENT_KILL:
          this.game.kill(data.i);
          break;
        case EVENT_END:
          this.game.end(data.player);
      }
    });
  }

  turn(direction){
    this.send(EVENT_TURN, {id: this.peerId, direction});
  }

  ready() {
    this.send(EVENT_PLAYER_READY, {id: this.peerId});
  }

  send(type, data){
    this.connect.send({type, ...data});
  }
}