import React, { Component, PropTypes } from 'react';
import style from './style.styl';
import Peers from '../../utils/Peers';

import Connect from '../Connect';
import GameSingle from '../GameSingle';
import GamePeer from '../GamePeer';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: null,
      id: null
    };

    this.onConnect = this.onConnect.bind(this);
    this.onSingle = this.onSingle.bind(this);
    this.returnToMenu = this.returnToMenu.bind(this);
  }

  componentDidMount(){
    console.log('mount');
    this.peers = new Peers();
    this.peers.getId().then(id => this.setState({id}));
    this.peers.on('connect', connect => {
      this.setState({mode: 'multiplayer', isServer: true, connect});
    });

    this.peers.on('disconnect', () => {
      this.setState({mode: null, isServer: null, connect: null});
    });
  }

  onConnect(connectId){
    this.peers.connect(connectId).then(connect => {
      this.setState({mode: 'multiplayer', isServer: false, connect});
    });
  }

  onSingle(){
    this.setState({mode: 'single'});
  }

  returnToMenu(){
    console.log(this.peers);
    this.peers.disconnect();
  }

  getComponent(){
    switch(this.state.mode){
      case 'multiplayer': return <GamePeer connect={this.state.connect} peerId={this.state.id}
                                           isServer={this.state.isServer} onMenu={this.returnToMenu}/>;
      case 'single': return <GameSingle onMenu={this.returnToMenu}/>;
      default: return <Connect peerId={this.state.id} onConnect={this.onConnect} onSingle={this.onSingle}/>;
    }
  }

  render(){
    return (
      <div className={style.wrapper}>
        <div className={style.content}>
          {this.getComponent()}
        </div>
      </div>
    );
  }
}