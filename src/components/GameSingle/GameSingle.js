import React, { Component, PropTypes } from 'react';
import style from './style.styl';
import { EVENT_CREATE, EVENT_END } from 'game/server/constants';

import Menu from '../Menu';

export default class GamePeer extends Component {
  static propTypes = {
    peerId: PropTypes.string,
    onMenu: PropTypes.func,
  };

  static defaultProps = {
    peerId: 'player'
  };

  constructor( props ) {
    super(props);

    this.state = {
      ended: false
    };

    this.onRestart = this.onRestart.bind(this);
  };

  componentDidMount() {
    require.ensure([], () => {
      const Server = require('game/ServerSingle.ts').default;
      const Client = require('game/Client.ts').default;

      this.server = new Server();
      this.client = new Client(this.server);

      this.client.on(EVENT_CREATE, () => {
        this.refs.gameCanvas.appendChild(this.client.render.getView());
        this.client.server.ready();
      });
      this.client.on(EVENT_END, () => {
        this.setState({ ended: true });
      });
    });
  };

  componentWillUnmount() {
    this.game.destroy();
  };

  onRestart() {
    this.game.reset();
  }

  render() {
    return (
      <div>
        <div className={style.field} ref="gameCanvas" />
        <div className={style.menu} />
        <Menu visible={this.state.ended} onRestart={this.onRestart} onMenu={this.props.onMenu}/>
      </div>
    );
  }
}