import React, { Component, PropTypes } from 'react';
import style from './style.styl';

const GLYPHS = {
  arrow_left:  require('static/img/arrow_left.svg').default,
  arrow_right: require('static/img/arrow_right.svg').default,
};

class Icon extends React.Component {
  render() {
    const glyph = `#${this.props.glyph}`;
    return (
      <svg className={style.icon}>
        <use xlinkHref={glyph} />
      </svg>
    )
  }
}

module.exports = Icon;
module.exports.GLYPHS = GLYPHS;
