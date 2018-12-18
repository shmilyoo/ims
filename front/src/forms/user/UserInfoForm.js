import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import { required } from '../validate';
import { trim } from '../normalize';
import {
  RenderTextField,
  RenderInputSelect,
  RenderSelectDeptField
} from '../../forms/renderFields';
import { userStatus } from '../../config';
import RenderDeptPicker from '../renderFields/renderDeptPicker';

const styles = () => ({
  buttonLine: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'space-around'
  },
  buttomText: {
    color: grey[500]
  }
});

const UserInfoForm = props => {
  const {
    handleSubmit,
    pristine,
    reset,
    classes,
    submitting,
    error,
    edit,
    deptArray,
    deptDic
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" wrap="nowrap" spacing={8}>
        <Grid item container spacing={8}>
          <Grid item xs={2}>
            <Field
              name="status"
              label="我的状态"
              readOnly={!edit}
              validate={required}
              component={RenderInputSelect}
              data={userStatus}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name="position"
              label="我的位置"
              readOnly={!edit}
              component={RenderTextField}
              normalize={trim}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name="deptId"
              deptArray={deptArray}
              disabled={!edit}
              deptDic={deptDic}
              label="实际工作部门*"
              component={RenderDeptPicker}
              validate={required}
            />
          </Grid>
        </Grid>
        {edit && (
          <Grid item container justify="center">
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={pristine || submitting}
              >
                保存
              </Button>
            </Grid>
            <Grid item xs={1} />
            <Grid item>
              <Button
                variant="text"
                onClick={reset}
                disabled={pristine || submitting}
              >
                清除
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

UserInfoForm.defaultProps = {
  edit: true
};

const enchance = compose(
  withStyles(styles),
  reduxForm({
    form: 'userInfoForm'
    // validate: syncCheckRegForm,
  })
);

export default enchance(UserInfoForm);
