import React, { Component, PropTypes } from 'react';
import style from './style.styl';

import Icon from '../Icon';

export default class Help extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return <div className={style.wrapper}>
        <div className={style.row}>
          <div className={style.icon}>
            <Icon glyph="arrow_left" />;
          </div>
          <div className={style.text}> — turn left</div>
        </div>
        <div className={style.row}>
          <div className={style.icon}>
            <Icon glyph="arrow_right" />;
          </div>
          <div className={style.text}> — turn right</div>
        </div>
      </div>;
    // return <div className={style.icon}></div>;
  }
}