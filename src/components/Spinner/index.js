import React, { Component, PropTypes } from 'react';
import style from './style.styl';

export default class Spinner extends Component {
  static propTypes = {
    size: PropTypes.number
  };

  static defaultProps = {
    size: 200
  };

  constructor(props) {
    super(props);

  }

  render(){
    const size = this.props.size;
    return <div style={{width: size, height: size*0.6}} className={style.wrapper}>
      <div style={{width: size, height: size}} className={style.spinner}></div>
    </div>;
  }
}