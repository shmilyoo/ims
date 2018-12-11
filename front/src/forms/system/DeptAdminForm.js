import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import { required, syncCheckTimeScale } from '../validate';
import { RenderDatePicker } from '../renderFields';
import { formatSecondsToDate, parseDateToSeconds } from '../formatParse';
import RenderChips from '../renderFields/renderChips';

class DeptAdminForm extends React.PureComponent {
  render() {
    const { pristine, submitting, error, reset, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Grid item container direction="column" spacing={8}>
          <Grid item>
            <Typography align="center" variant="h6">
              更改部门管理人员
            </Typography>
          </Grid>
          <Grid item style={{ minHeight: '5rem' }}>
            <Field
              name="admins"
              component={RenderChips}
              // format={formatSecondsToDate}
              // parse={parseDateToSeconds}
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
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default compose(reduxForm({ form: 'deptAdminForm', validate: null }))(
  DeptAdminForm
);
