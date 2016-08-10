import React, { Component, PropTypes } from 'react';
import style from './style.styl';

var GLYPHS = {
  ARROW_LEFT: require('./../../static/img/arrow_left.svg'),
  ARROW_RIGHT: require('./../../static/img/arrow_right.svg')
};

class Icon extends React.Component {
  render() {
    var glyph = this.props.glyph;
    return (
      <svg className="TEST" dangerouslySetInnerHTML={{__html: '<use xlink:href="' + glyph + '"></use>'}}/>
    )
  }
}

module.exports = Icon;
module.exports.GLYPHS = GLYPHS;
