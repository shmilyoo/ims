import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import { checkCommonConfig, required, checkPositiveInteger } from '../validate';
import { RenderTextField } from '../renderFields';
import { trim } from '../normalize';
import { parseStringToNumber, formatNumberToString } from '../formatParse';

const SystemCommonConfigForm = props => {
  const { pristine, submitting, error, reset, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Grid item container direction="column">
        <Grid item container spacing={8} alignItems="center">
          <Grid item xs>
            <Field
              name="allowExts"
              component={RenderTextField}
              label="允许上传附件类型"
              normalize={trim}
            />
          </Grid>
          <Grid item>
            <Typography color="textSecondary">
              格式： .rar;.zip;.jpg 分号隔开，后缀带.
            </Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={8}>
          <Grid item xs={6} lg={4}>
            <Field
              name="articleNumber"
              component={RenderTextField}
              label="部门和工作页面中每个频道栏目中文章的个数"
              inputProps={{ type: 'number', min: 1 }}
              validate={[required, checkPositiveInteger]}
              format={formatNumberToString}
              parse={parseStringToNumber}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={8} alignItems="center">
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
  reduxForm({
    form: 'systemCommonConfigForm',
    validate: checkCommonConfig
  })
)(SystemCommonConfigForm);
