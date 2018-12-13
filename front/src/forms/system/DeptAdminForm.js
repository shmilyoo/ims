import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import RenderUserPicker from '../renderFields/renderUserPicker';

class DeptAdminForm extends React.PureComponent {
  render() {
    const {
      pristine,
      submitting,
      error,
      reset,
      handleSubmit,
      nodeSelected,
      deptArray
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs>
            <Field
              name="admins"
              deptArray={deptArray}
              label={`选择作为${
                nodeSelected ? nodeSelected.title : '部门'
              }管理员的用户`}
              disabled={!nodeSelected}
              component={RenderUserPicker}
            />
          </Grid>
          <Grid item>
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
              撤销
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
