import { EVENT_CREATE, EVENT_PLAYER_READY, EVENT_START, EVENT_COUNTDOWN, EVENT_TICK, EVENT_TURN,
  EVENT_KILL, EVENT_END } from './constants';
import GameAbstractServer from './GameAbstractServer';

export default class GameLocalServer extends GameAbstractServer{
  constructor(peerId, connect, server){
    super(peerId, connect);

    this.server = server;

    this.server.on(EVENT_CREATE, config => {
      console.log(EVENT_CREATE);
      this.create(config);
      this.send(EVENT_CREATE, {config});
      this.emit(EVENT_CREATE, [this.game.getView()]);
    });

    this.server.on(EVENT_COUNTDOWN, value => {
      this.send(EVENT_COUNTDOWN, {value});
      this.countdown(value);
    });

    this.server.on(EVENT_TICK, state => {
      this.send(EVENT_TICK, {state});
      this.game.setState(state);
    });

    this.server.on(EVENT_KILL, i => {
      this.send(EVENT_KILL, {i});
      this.game.kill(i);
    });

    this.server.on(EVENT_END, player => {
      this.send(EVENT_END, {player});
      this.game.end(player);
    });

    this.connect.on('data', data => {
      switch(data.type){
        case EVENT_PLAYER_READY:
          this.ready(data.id);
          break;
        case EVENT_TURN:
          this.turnPlayer(data.id, data.direction);
      }
    });

  }

  turn(direction){
    this.turnPlayer(this.peerId, direction);
  }

  ready(id = this.peerId) {
    this.server.ready(id);
  }

  send(type, data){
    this.connect.send({type, ...data});
  }
}