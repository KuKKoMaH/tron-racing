import { EVENT_CREATE, EVENT_PLAYER_READY, EVENT_START, EVENT_COUNTDOWN, EVENT_TICK, EVENT_TURN,
  EVENT_KILL, EVENT_END, EVENT_RESTART } from './server/constants';
import GameAbstractServer from './Client.ts';
import GameServer from './server/Server.ts';

export default class GameLocalServer extends GameAbstractServer{
  constructor(peerId, connect){
    super(peerId, connect);

    this.server = new GameServer({players: [ peerId, connect.peer ], countdown: 2});

    this.server.on(EVENT_CREATE, config => {
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
      this.game.end(player);
      this.send(EVENT_END, {player});
      this.emit(EVENT_END);
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

  reset(){
    super.reset();
    this.send(EVENT_RESTART);
    this.server.reset();
    this.server.start();
  }

  send(type, data){
    this.connect.send({type, ...data});
  }
}