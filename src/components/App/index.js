import React, { Component, PropTypes } from 'react';
import style from './style.styl';
import Peers from '../../utils/peers';

import Connect from '../Connect';
import GameSingle from '../GameSingle';
import GamePeer from '../GamePeer';

export default class App extends Component {
  static childContextTypes = {
    connect: PropTypes.object
  };

  getChildContext() {
    return {
      connect: this.state.connect
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      mode: null,
      id: null
    };

    this.onConnect = this.onConnect.bind(this);
    this.onSingle = this.onSingle.bind(this);
  }

  componentDidMount(){
    this.peers = new Peers();
    this.peers.getId().then(id => this.setState({id}));
    this.peers.onConnect(connect => {
      this.setState({mode: 'multiplayer', isServer: true, connect});
    })
  }

  onConnect(connectId){
    console.log(connectId);
    this.peers.connect(connectId).then(connect => {
      this.setState({mode: 'multiplayer', isServer: false, connect});
    });
  }

  onSingle(){
    this.setState({mode: 'single'});
  }

  render(){
    switch(this.state.mode){
      case 'multiplayer': return <GamePeer connect={this.state.connect} peerId={this.state.id}
                                           isServer={this.state.isServer}/>;
      case 'single': return <GameSingle/>;
      default: return <Connect peerId={this.state.id} onConnect={this.onConnect} onSingle={this.onSingle}/>;
    }
  }
}