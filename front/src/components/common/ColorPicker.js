import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

class ColorPicker extends React.PureComponent {
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
  };

  handleBackDropClick = () => {
    this.props.onClose && this.props.onClose();
  };

  render() {
    const { show, color, pickerTop, pickerLeft } = this.props;
    return (
      <div>
        {show && (
          <React.Fragment>
            <div
              id="colorPickerBackDrop"
              onClick={this.handleBackDropClick}
              style={{
                backgroundColor: '#0000',
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1998
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: `${pickerTop}px`,
                left: `${pickerLeft}px`,
                zIndex: 2000
              }}
            >
              <SketchPicker
                color={color}
                onChangeComplete={this.handlePickerChange}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  show: PropTypes.bool, // 初始加载是否就生成颜色值
  onChange: PropTypes.func.isRequired, // 颜色变化的回调函数
  onClose: PropTypes.func.isRequired, // 关闭的回调函数
  colorType: PropTypes.oneOf(['hex', 'rgb'])
};
ColorPicker.defaultProps = {
  show: false,
  colorType: 'hex'
};
export default ColorPicker;
