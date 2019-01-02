import React from 'react';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { required } from '../validate';
import { trim } from '../normalize';
import { Button } from '@material-ui/core';
import { RenderTextField, RenderSwitch } from '../renderFields';

const styles = () => ({
  buttonLine: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'space-around'
  }
});
const LoginForm = props => {
  const { pristine, submitting, error, classes, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>{error && <strong>{error}</strong>}</div>
      <div>
        <Field
          name="username"
          autoFocus
          component={RenderTextField}
          label="用户名"
          normalize={trim}
          validate={required}
          autoComplete="username"
        />
      </div>
      <div>
        <Field
          name="password"
          component={RenderTextField}
          type="password"
          label="密码"
          validate={required}
          autoComplete="current-password"
        />
      </div>
      <div className={classes.buttonLine}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={pristine || submitting}
        >
          登录
        </Button>
        <Field name="remember" component={RenderSwitch} label="记住我" />
      </div>
    </form>
  );
};

export default compose(
  withStyles(styles),
  reduxForm()
)(LoginForm);
