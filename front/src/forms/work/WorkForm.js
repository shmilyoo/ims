import React from 'react';
import { Grid, Button, Divider } from '@material-ui/core';
import { Field, FieldArray, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import setMinutes from 'date-fns/setMinutes';
import setHours from 'date-fns/setHours';
import {
  RenderUserPicker,
  RenderTextField,
  RenderDatePicker,
  RenderWorkPhase,
  RenderInputSelect
} from '../renderFields';
import { formatUnixTimeToDate, parseDateToUnixTime } from '../formatParse';
import {
  required,
  checkMaxStringLength32,
  checkMaxStringLength255
} from '../validate';
import { trim } from '../normalize';
import RenderDeptPicker from '../renderFields/renderDeptPicker';

class WorkForm extends React.PureComponent {
  render() {
    const {
      pristine,
      submitting,
      error,
      reset,
      handleSubmit,
      canSelectIdList,
      deptArray,
      deptDic,
      tags,
      edit = false
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={8} direction="column" wrap="nowrap">
          <Grid item container spacing={8}>
            <Grid item xs>
              <Field
                name="title"
                label="大项工作的标题(最长32个字符)*"
                component={RenderTextField}
                validate={[required, checkMaxStringLength32]}
                normalize={trim}
              />
            </Grid>
            <Grid item xs={2}>
              <Field
                name="tagId"
                label="标签*"
                data={tags}
                component={RenderInputSelect}
                validate={required}
              />
            </Grid>
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
                dateFormat="YYYY-MM-dd HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                timeCaption="选择时间"
                injectTimes={[setHours(setMinutes(new Date(), 59), 23)]}
                component={RenderDatePicker}
                format={formatUnixTimeToDate}
                parse={parseDateToUnixTime}
                nullText="至今/未定"
                canClear={true}
                label="结束时间"
              />
            </Grid>
            <Grid item xs={2}>
              <Field
                name="deptId"
                deptArray={deptArray}
                deptDic={deptDic}
                canSelectIdList={canSelectIdList}
                label="选择目标部门*"
                component={RenderDeptPicker}
                validate={required}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Field
              name="usersInCharge"
              deptArray={deptArray}
              label="选择大项工作的负责人*"
              component={RenderUserPicker}
              validate={required}
            />
          </Grid>
          <Grid item>
            <Field
              name="usersAttend"
              deptArray={deptArray}
              label="选择大项工作的参加人"
              component={RenderUserPicker}
            />
          </Grid>
          <Grid item>
            {/* todo 更改为富文本编辑器 */}
            <Field
              name="content"
              label="大项工作的介绍(最长255个字符)"
              multiline
              component={RenderTextField}
              validate={checkMaxStringLength255}
              normalize={trim}
            />
          </Grid>
          <Grid item xs>
            <Divider />
          </Grid>
          <Grid item>
            <FieldArray name="phases" component={RenderWorkPhase} />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              size="small"
              color="secondary"
              disabled={pristine || submitting || !!error}
            >
              {edit ? '保存' : '添加'}
            </Button>
            <Button
              variant="text"
              onClick={reset}
              disabled={pristine || submitting}
            >
              撤销
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default compose(reduxForm())(WorkForm);
