import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Button,
  Divider,
  FormControlLabel,
  Typography,
  Checkbox
} from '@material-ui/core';
import { Field, FieldArray, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import {
  RenderTextField,
  RenderFileUpload,
  RenderDatePicker,
  RenderUserPicker,
  RenderAddMultiSchedules,
  RenderCheck
} from '../renderFields';
import {
  required,
  checkMaxStringLength32,
  checkMaxStringLength255
} from '../validate';
import { trim } from '../normalize';
import { formatUnixTimeToDate, parseDateToUnixTime } from '../formatParse';
import setHours from 'date-fns/esm/setHours';
import setMinutes from 'date-fns/esm/setMinutes';
import { attachmentUploadUrl } from '../../config';

class ArticleForm extends React.PureComponent {
  handleChangeAmPm = (index, ampm) => {
    const { change, amFrom, amTo, pmFrom, pmTo } = this.props;
    change(`schedules[${index}].from`, ampm === 'am' ? amFrom : pmFrom);
    change(`schedules[${index}].to`, ampm === 'am' ? amTo : pmTo);
  };
  render() {
    const {
      pristine,
      submitting,
      error,
      reset,
      handleSubmit,
      addSchedules,
      allowExts,
      deptArray,
      edit = false
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={8} direction="column" wrap="nowrap">
          <Grid item container spacing={8}>
            <Grid item xs={2}>
              <Field
                name="from"
                label="开始时间*"
                dateFormat="YYYY-MM-dd HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                timeCaption="选择时间"
                component={RenderDatePicker}
                format={formatUnixTimeToDate}
                parse={parseDateToUnixTime}
                validate={required}
              />
            </Grid>
            <Grid item xs={2}>
              <Field
                name="to"
                label="结束时间*"
                dateFormat="YYYY-MM-dd HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                timeCaption="选择时间"
                injectTimes={[setHours(setMinutes(new Date(), 59), 23)]}
                component={RenderDatePicker}
                format={formatUnixTimeToDate}
                parse={parseDateToUnixTime}
                validate={required}
              />
            </Grid>
            <Grid item xs>
              <Field
                name="title"
                label="任务的标题(最长32个字符)*"
                component={RenderTextField}
                validate={[required, checkMaxStringLength32]}
                normalize={trim}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Field
              name="usersInCharge"
              deptArray={deptArray}
              label="选择任务的负责人*"
              component={RenderUserPicker}
              validate={required}
            />
          </Grid>
          <Grid item>
            <Field
              name="usersAttend"
              deptArray={deptArray}
              label="选择任务的参加人"
              component={RenderUserPicker}
            />
          </Grid>
          <Grid item>
            {/* todo 更改为富文本编辑器 */}
            <Field
              name="content"
              label="任务的介绍(最长255个字符)"
              multiline
              component={RenderTextField}
              validate={checkMaxStringLength255}
              normalize={trim}
            />
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <Field
              name="attachments"
              component={RenderFileUpload}
              allowExts={allowExts ? allowExts.split(';') : undefined}
              apiUrl={attachmentUploadUrl}
            />
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item container direction="column" wrap="nowrap">
            <Grid item>
              <Field
                name="addSchedules"
                component={RenderCheck}
                label={
                  <Typography color="textSecondary">
                    是否同时发布日程。用户会接收提醒，并选择是否接受安排的日程，默认一天后自动接受。
                  </Typography>
                }
              />
            </Grid>
            {addSchedules && (
              <Grid item>
                <FieldArray
                  name="schedules"
                  deptArray={deptArray}
                  component={RenderAddMultiSchedules}
                  onChangeAmPm={this.handleChangeAmPm}
                />
              </Grid>
            )}
          </Grid>
          <Grid item container justify="center" spacing={32}>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="secondary"
                disabled={pristine || submitting || !!error}
              >
                {edit ? '保存' : '发布'}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="text"
                onClick={reset}
                disabled={pristine || submitting}
              >
                撤销
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    addSchedules:
      state.form.taskForm &&
      state.form.taskForm.values &&
      state.form.taskForm.values.addSchedules
  };
}

export default compose(
  reduxForm({ form: 'taskForm' }),
  connect(mapStateToProps)
)(ArticleForm);
