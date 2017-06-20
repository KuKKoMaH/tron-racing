import React, { Component, PropTypes } from 'react';
import style from './style.styl';
import { EVENT_CREATE, EVENT_END, EVENT_START } from 'game/server/constants';

import Menu from '../Menu';

export default class GamePeer extends Component {
  static propTypes = {
    connect:  PropTypes.object.isRequired,
    isServer: PropTypes.bool.isRequired,
    peerId:   PropTypes.string.isRequired,
    onMenu:   PropTypes.func
  };

  constructor( props ) {
    super(props);

    this.state = {
      ended: false
    };

    this.onRestart = this.onRestart.bind(this);
  }

  componentDidMount() {
    Promise.all([
      this.props.isServer ? import('game/peer/PeerServer.ts') : import('game/peer/PeerClient.ts'),
      import('game/Client.ts'),
    ]).then(( [Server, Client] ) => {
      this.server = new Server.default(this.props.peerId, this.props.connect);
      this.client = new Client.default(this.server);

      this.client.on(EVENT_CREATE, () => {
        this.refs.gameCanvas.appendChild(this.client.render.getView());
        this.client.server.ready();
      });
      this.client.on(EVENT_END, () => this.setState({ ended: true }));
      this.client.on(EVENT_START, () => this.setState({ ended: false }));
    });
  }

  componentWillUnmount() {
    this.client.destroy();
  }

  onRestart() {
    this.server.restart();
  }

  render() {
    return (
      <div>
        <div className={style.field} ref="gameCanvas"/>
        <div className={style.menu}/>
        <Menu
          visible={this.state.ended}
          canRestart={this.props.isServer}
          onRestart={this.onRestart}
          onMenu={this.props.onMenu}
        />
      </div>
    );
  }
}