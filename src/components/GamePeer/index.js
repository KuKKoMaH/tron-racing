import React, { Component, PropTypes } from 'react';
import style from './style.styl';
import GameServer from './../../game/GameServer';
import GameRemoteServer from './../../game/GameRemoteServer';
import GameLocalServer from './../../game/GameLocalServer';
import { EVENT_CREATE } from '../../game/constants';

export default class GameSingle extends Component {
  static propTypes = {
    connect: PropTypes.object.isRequired,
    isServer: PropTypes.bool.isRequired,
    peerId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    if(this.props.isServer){
      this.server = new GameServer({players: [ this.props.peerId, this.props.connect.peer ]});
      this.game = new GameLocalServer(this.props.peerId, this.props.connect, this.server);
    }else{
      this.game = new GameRemoteServer(this.props.peerId, this.props.connect);
    }

    this.game.on(EVENT_CREATE, view => {
      this.refs.gameCanvas.appendChild(view);
      this.game.ready();
    });
  }

  componentWillUnmount(){
    this.game.destroy();
  }

  render(){
    return (
      <div className={style.wrapper}>
        <div className={style.field} ref="gameCanvas"></div>
      </div>
    );
  }
}