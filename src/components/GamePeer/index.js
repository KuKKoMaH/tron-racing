import React, { Component, PropTypes } from 'react';
import style from './style.styl';
import GameServer from './../../game/GameServer';
import GameRemoteServer from './../../game/GameRemoteServer';
import GameLocalServer from './../../game/GameLocalServer';
import { EVENT_CREATE, EVENT_END } from '../../game/constants';

import Menu from '../Menu';

export default class GameSingle extends Component {
  static propTypes = {
    connect: PropTypes.object.isRequired,
    isServer: PropTypes.bool.isRequired,
    peerId: PropTypes.string.isRequired,
    onMenu: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      ended: false
    };

    this.onRestart = this.onRestart.bind(this);
    this.onMenu = this.onMenu.bind(this);
  }

  componentDidMount(){
    if(this.props.isServer){
      this.game = new GameLocalServer(this.props.peerId, this.props.connect);
    }else{
      this.game = new GameRemoteServer(this.props.peerId, this.props.connect);
    }

    this.game.on(EVENT_CREATE, view => {
      this.refs.gameCanvas.appendChild(view);
      this.game.ready();
    });

    this.game.on(EVENT_END, () => {
      this.setState({ended: true});
    });
  }

  componentWillUnmount(){
    this.game.destroy();
  }

  onRestart(){
    this.game.reset();
  }

  onMenu(){

  }

  render(){
    return (
      <div className={style.wrapper}>
        <div className={style.field} ref="gameCanvas"></div>
        <Menu visible={this.state.ended} canRestart={this.props.isServer}
              onRestart={this.onRestart} onMenu={this.props.onMenu} />
      </div>
    );
  }
}