import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import { required, syncCheckTimeScale } from '../validate';
import { RenderDatePicker } from '../renderFields';
import { formatSecondsToDate, parseDateToSeconds } from '../formatParse';

const SystemTimeScaleForm = props => {
  const { pristine, submitting, error, reset, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Grid item container direction="column">
        <Grid item>
          <Typography variant="h6">每日正常工作时间段：</Typography>
        </Grid>
        <Grid item container spacing={8} alignItems="center">
          <Grid item xs={2}>
            <Field
              name="amFrom"
              component={RenderDatePicker}
              label="上午起始时间"
              timeIntervals={10}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="HH:mm"
              dateFormat="HH:mm"
              timeCaption="选择时间"
              format={formatSecondsToDate}
              parse={parseDateToSeconds}
              validate={required}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name="amTo"
              component={RenderDatePicker}
              label="上午结束时间"
              timeIntervals={10}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="HH:mm"
              dateFormat="HH:mm"
              timeCaption="选择时间"
              format={formatSecondsToDate}
              parse={parseDateToSeconds}
              validate={required}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name="pmFrom"
              component={RenderDatePicker}
              label="下午起始时间"
              timeIntervals={10}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="HH:mm"
              dateFormat="HH:mm"
              timeCaption="选择时间"
              format={formatSecondsToDate}
              parse={parseDateToSeconds}
              validate={required}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name="pmTo"
              component={RenderDatePicker}
              label="下午结束时间"
              timeIntervals={10}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="HH:mm"
              dateFormat="HH:mm"
              timeCaption="选择时间"
              format={formatSecondsToDate}
              parse={parseDateToSeconds}
              validate={required}
            />
          </Grid>
          <Grid item xs>
            <Button
              type="submit"
              variant="contained"
              size="small"
              color="secondary"
              disabled={pristine || submitting || !!error}
            >
              保存
            </Button>
            <Button
              variant="text"
              onClick={reset}
              disabled={pristine || submitting}
            >
              清除
            </Button>
            {error && <strong>{error}</strong>}
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default compose(
  reduxForm({ form: 'systemTimeScaleForm', validate: syncCheckTimeScale })
)(SystemTimeScaleForm);
