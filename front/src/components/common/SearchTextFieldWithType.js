import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from '@material-ui/core';
import SearchTextField from './SearchTextField';
import DatePicker, { registerLocale } from 'react-datepicker';
import zhCN from 'date-fns/locale/zh-CN';
import '../../assets/css/datePicker.css';
import { setHours, setMinutes, addYears } from 'date-fns';
registerLocale('zh-CN', zhCN);

class SearchTextFieldWithType extends React.PureComponent {
  state = {
    searchKind: 'text'
  };
  handleSelectChange = (e, { props: { searchkind } }) => {
    this.setState({ searchKind: searchkind });
    // 如果切換到搜索日期范围，则把value切换为对象（{from,to}），搜索文本切换到''字符串
    this.props.onInputChange(searchkind === 'date' ? {} : '');
    this.props.onTypeChange(e.target.value);
  };
  handleChangeStart = date => {
    this.props.onInputChange({ ...this.props.value, from: date });
  };
  handleChangeEnd = date => {
    this.props.onInputChange({ ...this.props.value, to: date });
  };
  render() {
    const {
      label,
      value,
      type,
      onInputChange,
      types,
      maxDate,
      minDate
    } = this.props;
    const { searchKind } = this.state;
    let _maxDate, _minDate;
    if (searchKind === 'date') {
      const now = new Date();
      _maxDate = maxDate || addYears(now, 10);
      _minDate = minDate || addYears(now, -20);
    }
    return (
      <Grid container alignItems="flex-end" spacing={8}>
        {searchKind === 'text' && (
          <Grid item xs>
            <SearchTextField
              label={label}
              value={value}
              onChange={onInputChange}
            />
          </Grid>
        )}
        {searchKind === 'date' && (
          <Grid item xs container justify="flex-end" spacing={8}>
            <Grid item>
              <DatePicker
                locale="zh-CN"
                dateFormat="YYYY-MM-dd HH:mm"
                timeFormat="HH:mm"
                onChange={this.handleChangeStart}
                selected={value.from}
                selectsStart
                showTimeSelect
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={30}
                maxDate={_maxDate}
                minDate={_minDate}
                timeCaption="选择时间"
                injectTimes={[setHours(setMinutes(new Date(), 59), 23)]}
                customInput={<TextField label="搜索起点" />}
              />
            </Grid>
            <Grid item>
              <DatePicker
                locale="zh-CN"
                dateFormat="YYYY-MM-dd HH:mm"
                timeFormat="HH:mm"
                onChange={this.handleChangeEnd}
                selected={value.to}
                selectsEnd
                showTimeSelect
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={30}
                maxDate={_maxDate}
                minDate={_minDate}
                timeCaption="选择时间"
                injectTimes={[setHours(setMinutes(new Date(), 59), 23)]}
                customInput={<TextField label="搜索终点" />}
              />
            </Grid>
          </Grid>
        )}
        <Grid item>
          <FormControl>
            <InputLabel htmlFor="selectSearchTypeSelect">搜索类别</InputLabel>
            <Select
              value={type}
              inputProps={{ id: 'selectSearchTypeSelect' }}
              onChange={this.handleSelectChange}
              style={{ minWidth: '10rem' }}
            >
              {types &&
                types.map(({ value, label, searchKind }) => (
                  <MenuItem key={value} searchkind={searchKind} value={value}>
                    {label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

SearchTextFieldWithType.propTypes = {
  label: PropTypes.string, // the label which textfield shows
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // textfield value
  onInputChange: PropTypes.func.isRequired, // the callback func when search change
  onTypeChange: PropTypes.func.isRequired, //  the callback func when searchkind change
  // { type：实际类别value, label 显示的文字, SearchType搜索类别如文字搜索、日期搜索  },
  types: PropTypes.array.isRequired // the select children,
};

SearchTextFieldWithType.defaultProps = {
  label: '搜索输入栏'
};

export default SearchTextFieldWithType;
