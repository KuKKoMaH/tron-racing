import React, { Component, PropTypes } from 'react';
import style from './style.styl';

export default class Menu extends Component {
  static propTypes = {
    canRestart: PropTypes.bool,
    visible: PropTypes.bool,
    onRestart: PropTypes.func,
    onMenu: PropTypes.func
  };

  static defaultProps = {
    canRestart: true
  };

  constructor(props) {
    super(props);
  }

  render(){
    const items = [];

    return <div className={style.menu}>
      {this.props.visible && (
        <div>
          {this.props.canRestart && <span onClick={this.props.onRestart} className={style.item}>RESTART</span>}
          <span onClick={this.props.onMenu} className={style.item}>MAIN MENU</span>
        </div>
      )}
      </div>;
  }
}