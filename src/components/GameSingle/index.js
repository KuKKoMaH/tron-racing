import React, { Component, PropTypes } from 'react';
import style from './style.styl';
import GameServer from './../../game/GameServer';
import GameSingleServer from './../../game/GameSingleServer';
import { EVENT_CREATE } from '../../game/constants';

export default class GamePeer extends Component {
  static propTypes = {
    peerId: PropTypes.string
  };

  static defaultProps = {
    peerId: 'player'
  } ;

  constructor(props) {
    super(props);
  };

  componentDidMount(){
    this.server = new GameServer({players: [ this.props.peerId], countdown: 1});
    this.game = new GameSingleServer(this.props.peerId, this.server);

    this.game.on(EVENT_CREATE, view => {
      this.refs.gameCanvas.appendChild(view);
      this.game.ready();
    });
  };

  componentWillUnmount(){
    this.gameClient.destroy();
  };

  render(){
    return (
      <div className={style.wrapper}>
        <div className={style.field} ref="gameCanvas"></div>
      </div>
    );
  }
}