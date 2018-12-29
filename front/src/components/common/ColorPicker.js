import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import Sync from '@material-ui/icons/Sync';
import Stop from '@material-ui/icons/Stop';
import randomize from 'randomatic';
import { getRandomIntInclusive } from '../../services/utility';

class ColorPicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { showPicker: false, pickerTop: 0, pickerLeft: 0 };
    this.inputDiv = React.createRef();
  }

  componentDidMount() {
    if (this.props.mountWithColor) this.setRandomColor();
  }

  randomRefresh = e => {
    e.stopPropagation();
    this.setRandomColor();
  };

  setRandomColor = () => {
    // rgba(0, 0, 0, 0.87)
    let color = '';
    if (this.props.colorType === 'hex') {
      color = `#${randomize('?', 6, { chars: '0123456789ABCDEF' })}`;
    } else {
      color = `rgba(${getRandomIntInclusive(0, 255)}, ${getRandomIntInclusive(
        0,
        255
      )}, ${getRandomIntInclusive(0, 255)}, ${getRandomIntInclusive(0, 100) /
        100})`;
    }
    this.props.onChange(color);
  };

  handleClick = () => {
    const inputDiv = this.inputDiv.current;
    let top = inputDiv.offsetTop + inputDiv.offsetHeight;
    if (window.innerHeight - top < 300) top = inputDiv.offsetTop - 300;
    this.setState({
      pickerTop: top,
      pickerLeft: inputDiv.offsetLeft,
      showPicker: !this.state.showPicker
    });
    // this.setState({
    // });
  };
  handlePickerChange = ({ hex, rgb }) => {
    // { r: 51, g: 51, b: 51 }
    let color = '';
    if (this.props.colorType === 'hex') {
      color = hex.toUpperCase();
      this.props.onChange(color);
    } else {
      color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
      this.props.onChange(rgb);
    }
    this.setState({ color });
  };

  render() {
    const { showPicker, pickerTop, pickerLeft } = this.state;
    const { label, color } = this.props;
    return (
      <div>
        <div id="aaa" ref={this.inputDiv}>
          <TextField
            fullWidth
            style={{ color: '#FF0' }}
            InputProps={{
              style: { color: color },
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Stop
                    style={color ? null : { visibility: 'hidden' }}
                    fontSize="large"
                  />
                  <IconButton
                    style={{ padding: '0.5rem' }}
                    onClick={this.randomRefresh}
                  >
                    <Sync />
                  </IconButton>
                </InputAdornment>
              )
            }}
            value={color}
            label={label}
            onClick={this.handleClick}
          />
        </div>
        {showPicker && (
          <div
            style={{
              position: 'absolute',
              top: `${pickerTop}px`,
              left: `${pickerLeft}px`,
              zIndex: '2000'
            }}
          >
            <SketchPicker
              color={color}
              onChangeComplete={this.handlePickerChange}
            />
          </div>
        )}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  label: PropTypes.string,
  mountWithColor: PropTypes.bool, // 初始加载是否就生成颜色值
  onChange: PropTypes.func.isRequired, // 颜色变化的回调函数
  colorType: PropTypes.oneOf(['hex', 'rgb'])
};
ColorPicker.defaultProps = {
  mountWithColor: true,
  colorType: 'hex'
};
export default ColorPicker;
