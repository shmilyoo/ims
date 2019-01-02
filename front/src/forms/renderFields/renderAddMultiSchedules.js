import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Grid,
  Button,
  IconButton,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  withStyles,
  Typography,
  Divider
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import setMinutes from 'date-fns/setMinutes';
import setHours from 'date-fns/setHours';
import { RenderDatePicker, RenderTextField, RenderUserPicker } from '.';
import {
  formatUnixTimeToDate,
  parseDateToUnixTime,
  parseDateToSeconds,
  formatSecondsToDate
} from '../formatParse';
import { required, checkMaxStringLength32 } from '../validate';
import { trim } from '../normalize';
import compose from 'recompose/compose';

const style = theme => ({
  addBtn: {
    padding: '0',
    marginBottom: '1rem'
  },
  number: {
    padding: '1rem'
  },
  ampm: {
    marginLeft: '1rem',
    marginRight: '1rem'
  },
  link: theme.sharedClass.link
});

const RenderAddMultiSchedules = ({
  fields,
  deptArray,
  onChangeAmPm,
  meta: { touched, error },
  classes
}) => {
  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid item>
        <IconButton
          className={classes.addBtn}
          color="secondary"
          onClick={() => {
            fields.push({});
          }}
        >
          <Add />
        </IconButton>
      </Grid>
      <Grid item>{error}</Grid>
      {fields.map((schedule, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Grid item>
              <Divider />
            </Grid>
          )}
          <Grid item container spacing={8} alignItems="center">
            <Grid item className={classes.number}>
              <Typography className={classes.number} align="center">
                {index + 1}
              </Typography>
            </Grid>
            <Grid item xs container spacing={8} alignItems="center">
              <Grid item xs>
                <Field
                  name={`${schedule}.title`}
                  component={RenderTextField}
                  label="日程标题(最长32个字符)*"
                  normalize={trim}
                  validate={[required]}
                  // validate={[required, checkMaxStringLength32]}
                />
              </Grid>
              <Grid item xs={2}>
                <Field
                  name={`${schedule}.date`}
                  label="日期*"
                  dateFormat="YYYY-MM-dd"
                  component={RenderDatePicker}
                  format={formatUnixTimeToDate}
                  parse={parseDateToUnixTime}
                  validate={required}
                />
              </Grid>
              <Grid item xs={1}>
                <Field
                  name={`${schedule}.from`}
                  label="开始时间*"
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={10}
                  timeCaption="选择时间"
                  component={RenderDatePicker}
                  format={formatSecondsToDate}
                  parse={parseDateToSeconds}
                  validate={required}
                />
              </Grid>
              <Grid item xs={1}>
                <Field
                  name={`${schedule}.to`}
                  label="结束时间*"
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={10}
                  timeCaption="选择时间"
                  injectTimes={[setHours(setMinutes(new Date(), 59), 23)]}
                  component={RenderDatePicker}
                  format={formatSecondsToDate}
                  parse={parseDateToSeconds}
                  validate={required}
                />
              </Grid>
              <Grid item>
                <div className={classes.ampm}>
                  <Typography
                    className={classes.link}
                    align="center"
                    onClick={() => {
                      onChangeAmPm(index, 'am');
                    }}
                  >
                    上午
                  </Typography>
                  <Typography
                    className={classes.link}
                    align="center"
                    onClick={() => {
                      onChangeAmPm(index, 'pm');
                    }}
                  >
                    下午
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Field
                  name={`${schedule}.content`}
                  label="日程内容(最长××字 )" // todo 确定下日程的content需不需要富文本
                  multiline
                  component={RenderTextField}
                  normalize={trim}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name={`${schedule}.toUsers`}
                  deptArray={deptArray}
                  label="选择派发给哪些人*"
                  component={RenderUserPicker}
                  validate={required}
                />
              </Grid>
            </Grid>
            <Grid item>
              <IconButton
                onClick={() => {
                  fields.remove(index);
                }}
              >
                <Delete color="error" />
              </IconButton>
            </Grid>
          </Grid>
        </React.Fragment>
      ))}

      <Grid item />
    </Grid>
  );
};

RenderAddMultiSchedules.propTypes = {
  label: PropTypes.string, // 不设置trueLabel和falseLabel时显示的文本
  trueLabel: PropTypes.string, // switch为true的时候显示的文本
  falseLabel: PropTypes.string
};

export default compose(withStyles(style))(RenderAddMultiSchedules);
