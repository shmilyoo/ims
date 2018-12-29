import React from 'react';
import PropTypes from 'prop-types';
import DatePicker, { registerLocale } from 'react-datepicker';
import zhCN from 'date-fns/locale/zh-CN';
import '../../assets/css/datePicker.css';
import { TextField, InputAdornment } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
registerLocale('zh-CN', zhCN);

class CustomInput extends React.PureComponent {
  handleClearClick = e => {
    e.stopPropagation();
    this.props.onInputChange(null);
  };
  render() {
    const {
      label,
      nullText,
      canClear,
      input, // 父组件datepicker传递过来的inputProps，为了实现touched变量
      meta: { touched, error },
      value, // datepicker传递的参数
      onClick // datepicker传递的参数
    } = this.props;
    return (
      <TextField
        label={label}
        {...input}
        fullWidth
        autoComplete="off"
        error={!!(touched && error)}
        helperText={touched && error ? error : ' '}
        value={value || nullText} // 和react-datepicker 的selected值关联，不是redux-form的value
        onClick={onClick}
        InputProps={
          canClear && value
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <Cancel
                      style={{ cursor: 'pointer' }}
                      onClick={this.handleClearClick}
                    />
                  </InputAdornment>
                )
              }
            : null
        }
      />
    );
  }
}

const RenderDatePicker = ({
  label,
  canClear,
  nullText,
  input: { value, onChange, ...inputRest },
  meta,
  ...rest
}) => {
  return (
    <div
      style={{
        fontSize: '1.8rem'
      }}
    >
      <DatePicker
        customInput={
          <CustomInput
            label={label}
            canClear={canClear}
            onInputChange={onChange}
            nullText={nullText}
            input={inputRest}
            meta={meta}
          />
        }
        locale="zh-CN"
        selected={value || null} // value是input.value
        onChange={onChange}
        // yearDropdownItemNumber={100} // 设置合适的数值，这个要不然得一个一个点，不方便
        // scrollableYearDropdown
        {...rest}
      />
    </div>
  );
};

RenderDatePicker.propTypes = {
  nullText: PropTypes.string, // 当选择为空时，文本框显示的文字
  canClear: PropTypes.bool, // custom input 右侧在有时间的时候是否显示清除按钮
  label: PropTypes.string // textfield显示的提示文字
};

RenderDatePicker.defaultProps = {
  nullText: '',
  canClear: false
};

export default RenderDatePicker;
