import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import zhCN from 'date-fns/locale/zh-CN';
import '../../assets/css/datePicker.css';
import { TextField, Grid } from '@material-ui/core';
import { addYears, setHours } from 'date-fns';
import { setMinutes } from 'date-fns/esm';
registerLocale('zh-CN', zhCN);

class RenderDateRangePicker extends React.PureComponent {
  handleChangeStart = date => {
    this.props.input.onChange({
      ...(this.props.input.value || {}),
      from: date
    });
  };
  handleChangeEnd = date => {
    this.props.input.onChange({ ...(this.props.input.value || {}), to: date });
  };
  render() {
    const {
      input: { value },
      meta: { touched, error },
      ...rest
    } = this.props;
    return (
      <Grid container wrap="nowrap" spacing={8}>
        <Grid item xs={6}>
          <DatePicker
            locale="zh-CN"
            onChange={this.handleChangeStart}
            selected={(value || {}).from}
            selectsStart
            {...rest}
            customInput={
              <TextField
                error={!!(touched && error)}
                helperText={touched && error ? error : ' '}
                label="搜索终点"
              />
            }
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            locale="zh-CN"
            onChange={this.handleChangeEnd}
            selected={(value || {}).to}
            selectsStart
            injectTimes={[setHours(setMinutes(new Date(), 59), 23)]}
            {...rest}
            customInput={
              <TextField
                error={!!(touched && error)}
                helperText={touched && error ? error : ' '}
                label="搜索终点"
              />
            }
          />
        </Grid>
      </Grid>
    );
  }
}

RenderDateRangePicker.propTypes = {};

RenderDateRangePicker.defaultProps = {
  showTimeSelect: true,
  showMonthDropdown: true,
  showYearDropdown: true,
  scrollableYearDropdown: true,
  // yearDropdownItemNumber: 30,
  dateFormat: 'YYYY-MM-dd HH:mm',
  timeFormat: 'HH:mm',
  timeCaption: '选择时间',
  maxDate: addYears(new Date(), 10),
  minDate: addYears(new Date(), -20)
};

export default RenderDateRangePicker;
