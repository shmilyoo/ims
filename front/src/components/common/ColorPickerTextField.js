import React from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import Sync from '@material-ui/icons/Sync';
import Stop from '@material-ui/icons/Stop';
import randomize from 'randomatic';
import { getRandomIntInclusive } from '../../services/utility';
import ColorPicker from './ColorPicker';

class ColorPickerTextField extends React.PureComponent {
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
  };

  handlePickerClose = () => {
    this.setState({ showPicker: false });
  };

  render() {
    const { showPicker, pickerTop, pickerLeft } = this.state;
    const { label, color, onChange } = this.props;
    return (
      <div>
        <div id="colorPickerTextFieldDiv" ref={this.inputDiv}>
          <TextField
            fullWidth
            style={{ color: '#FF0', zIndex: 1999 }}
            InputProps={{
              onClick: this.handleClick,
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
            // onClick={this.handleClick}
          />
        </div>
        <ColorPicker
          show={showPicker}
          pickerTop={pickerTop}
          pickerLeft={pickerLeft}
          onChange={onChange}
          onClose={this.handlePickerClose}
          relativeElmId="colorPickerTextFieldDiv"
        />
      </div>
    );
  }
}

ColorPickerTextField.propTypes = {
  label: PropTypes.string,
  mountWithColor: PropTypes.bool, // 初始加载是否就生成颜色值
  onChange: PropTypes.func.isRequired, // 颜色变化的回调函数
  colorType: PropTypes.oneOf(['hex', 'rgb'])
};
ColorPickerTextField.defaultProps = {
  mountWithColor: true,
  colorType: 'hex'
};
export default ColorPickerTextField;
