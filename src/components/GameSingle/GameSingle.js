import React, { Component, PropTypes } from 'react';
import style from './style.styl';
import { EVENT_CREATE, EVENT_END, EVENT_START } from 'game/server/constants';

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
    Promise.all([
      import('game/ServerSingle.ts'),
      import('game/Client.ts'),
    ]).then(( [Server, Client] ) => {
      this.server = new Server.default();
      this.client = new Client.default(this.server);

      this.client.on(EVENT_CREATE, () => {
        this.refs.gameCanvas.appendChild(this.client.render.getView());
        this.client.server.ready();
      });
      this.client.on(EVENT_END, () => this.setState({ ended: true }));
      this.client.on(EVENT_START, () => this.setState({ ended: false }));
    });
  };

  componentWillUnmount() {
    this.client.destroy();
  };

  onRestart() {
    this.server.restart();
  }

  render() {
    return (
      <div>
        <div className={style.field} ref="gameCanvas"/>
        <div className={style.menu}/>
        <Menu visible={this.state.ended} onRestart={this.onRestart} onMenu={this.props.onMenu}/>
      </div>
    );
  }
}