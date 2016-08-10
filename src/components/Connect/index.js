import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import style from './style.styl';

import Spinner from '../Spinner';
import Help from '../Help';

export default class Connect extends Component {
  static propTypes = {
    peerId: PropTypes.string,
    onConnect: PropTypes.func,
    onSingle: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.connect = this.connect.bind(this);
    this.selectSingle = this.selectSingle.bind(this);
    this.copyId = this.copyId.bind(this);
  }

  componentDidMount() {
    this.refs.connectId.focus();
  }

  connect(e){
    e.preventDefault();
    const connectId = this.refs.connectId.value;
    this.props.onConnect(connectId);
  }

  selectSingle(e){
    e.preventDefault();
    this.props.onSingle();
  }

  copyId(e){
    e.preventDefault();
    const el = this.refs.peerId;
    var rng = document.createRange();
    rng.selectNode( el );
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange( rng );
    document.execCommand('copy');
  }

  render() {
    return <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.text}>YOUR ID:</div>
        <div className={style.peer_id}>
          {this.props.peerId
            ? <span ref="peerId" onClick={this.copyId}>{this.props.peerId}</span>
            : <Spinner size={70}/>
          }
          </div>

        <form className={style.form} onSubmit={this.connect}>
          <div className={style.input_wrapper}>
            <input ref="connectId" type="text" className={style.input} maxLength="16"/>
            <div className={style.border}></div>
          </div>
          <button className={classNames(style.button, style.orange)}>CONNECT</button>
        </form>
        <button className={classNames(style.button, style.cyan, style.single)} onClick={this.selectSingle}>SINGLE PLAYER</button>
        <Help />
      </div>
    </div>;
  }
}