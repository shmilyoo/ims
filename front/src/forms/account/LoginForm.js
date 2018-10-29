import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { required } from '../validate';
import { trim } from '../normalize';
import { Button, Typography } from '@material-ui/core';
import { RenderTextField, RenderSwitch } from '../renderFields';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
  buttonLine: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'space-around'
  }
});
const LoginForm = props => {
  const { pristine, submitting, error, classes, handleSubmit } = props;
  console.log('login form render');
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
        />
      </div>
      <div>
        <Field
          name="password"
          component={RenderTextField}
          type="password"
          label="密码"
          validate={required}
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