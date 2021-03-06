import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {
  syncCheckRegForm,
  asyncCheckUsername,
  shouldAsyncValidate,
  required,
  checkUsername
} from '../validate';
import { trim } from '../normalize';
import {
  RenderTextField,
  RenderTextFieldAsync
} from '../../forms/renderFields';

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

const RegForm = props => {
  console.log('reg form render');
  const { handleSubmit, pristine, reset, classes, submitting, error } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>{error && <strong>{error}</strong>}</div>
      <div>
        <Field
          name="username"
          autoFocus
          component={RenderTextFieldAsync}
          label="用户名"
          validate={[required, checkUsername]}
          normalize={trim}
        />
      </div>
      <div>
        <Field
          name="password1"
          component={RenderTextField}
          type="password"
          validate={required}
          label="密码"
        />
      </div>
      <div>
        <Field
          name="password2"
          component={RenderTextField}
          type="password"
          validate={required}
          label="确认密码"
        />
      </div>
      <div>
        <Field
          name="casUsername"
          component={RenderTextField}
          label="绑定统一认证系统用户名"
          validate={required}
          normalize={trim}
        />
      </div>
      <div className={classes.buttonLine}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={pristine || submitting}
        >
          注册
        </Button>
        <Button
          variant="text"
          onClick={reset}
          disabled={pristine || submitting}
        >
          清除
        </Button>
      </div>
    </form>
  );
};

const enchance = compose(
  withStyles(styles),
  reduxForm({
    form: 'regForm',
    shouldAsyncValidate,
    validate: syncCheckRegForm,
    asyncValidate: asyncCheckUsername,
    asyncBlurFields: ['username']
  })
);

export default enchance(RegForm);
