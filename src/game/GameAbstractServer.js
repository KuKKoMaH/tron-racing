import GameRender from './GameRender';

export default class GameAbstractServer{
  constructor(peerId, connect){
    this.peerId = peerId;
    this.connect = connect;
    this.game = null;

    this.events = {};

    this.onKeyDown = this.onKeyDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
  }

  destroy(){
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(e){
    switch(e.keyCode){
      case 37: // left arrow
        e.preventDefault();
        this.turn('left');
        break;
      case 39: // right arrow
        e.preventDefault();
        this.turn('right');
        break;
    }
  }

  turnPlayer(id, direction) {
    this.server.turn(id, direction);
  }

  create(config){
    this.game = new GameRender(config);
  }

  countdown(value){
    this.game.countdown(value);
  }

  emit(event, options){
    if(Array.isArray(this.events[event])){
      this.events[event].forEach(cb => cb.apply(this, options));
    }
  }

  on(event, cb){
    if(!Array.isArray(this.events[event])){
      this.events[event] = [];
    }
    this.events[event].push(cb);
  }
}