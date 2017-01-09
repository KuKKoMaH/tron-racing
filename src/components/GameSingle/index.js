import React, { Component, PropTypes } from 'react';
import style from './style.styl';
import { EVENT_CREATE, EVENT_END } from '../../game/constants';

import Menu from '../Menu';

export default class GamePeer extends Component {
  static propTypes = {
    peerId: PropTypes.string,
    onMenu: PropTypes.func,
  };

  static defaultProps = {
    peerId: 'player'
  } ;

  constructor(props) {
    super(props);

    this.state = {
      ended: false
    };

    this.onRestart = this.onRestart.bind(this);
  };

  componentDidMount(){
    require.ensure([], () => {
      const GameServer = require('./../../game/GameServer').default;
      const GameSingleServer = require('./../../game/GameSingleServer').default;

      this.server = new GameServer({players: [ this.props.peerId], countdown: 1});
      this.game = new GameSingleServer(this.props.peerId, this.server);

      this.game.on(EVENT_CREATE, view => {
        this.refs.gameCanvas.appendChild(view);
        this.game.ready();
      });
      this.game.on(EVENT_END, () => {
        this.setState({ended: true});
      });
    });
  };

  componentWillUnmount(){
    this.game.destroy();
  };

  onRestart(){
    this.game.reset();
  }

  render(){
    return (
      <div>
        <div className={style.field} ref="gameCanvas"></div>
        <div className={style.menu}></div>
        <Menu visible={this.state.ended} onRestart={this.onRestart} onMenu={this.props.onMenu} />
      </div>
    );
  }
}