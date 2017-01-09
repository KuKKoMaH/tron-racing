import Events from '../utils/Events';
import GameRender from './GameRender';

export default class GameAbstractServer extends Events{
  constructor(peerId, connect){
    super();
    this.peerId = peerId;
    this.connect = connect;
    this.game = null;

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

  reset(){
    this.game.reset();
  }
}