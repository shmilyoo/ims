import React from 'react';
import { Grid, Button, Divider } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import { RenderTextField } from '../renderFields';
import {
  required,
  checkMaxStringLength8,
  checkMaxStringLength255,
  checkPositiveInteger
} from '../validate';
import { trim } from '../normalize';
import { formatNumberToString, parseStringToNumber } from '../formatParse';

const ChannelForm = ({
  pristine,
  submitting,
  error,
  reset,
  handleSubmit,
  onDelChannel,
  edit = false
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={8} direction="column" wrap="nowrap">
        <Grid item container spacing={8}>
          <Grid item xs={3}>
            <Field
              name="name"
              label="频道名称(最长8个字符)*"
              component={RenderTextField}
              // validate={required}
              validate={[required, checkMaxStringLength8]}
              normalize={trim}
            />
          </Grid>
          <Grid item xs={1}>
            <Field
              name="order"
              label="排序*"
              component={RenderTextField}
              inputProps={{ type: 'number', min: 1 }}
              validate={[required, checkPositiveInteger]}
              format={formatNumberToString}
              parse={parseStringToNumber}
            />
          </Grid>
        </Grid>
        <Grid item xs>
          <Divider />
        </Grid>
        <Grid item>
          <Field
            name="content"
            label="频道介绍(最长255个字符)"
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
          {edit && (
            <Button
              variant="text"
              onClick={onDelChannel && onDelChannel}
              disabled={submitting}
              title="频道下有文章时无法删除"
            >
              删除
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default compose(reduxForm())(ChannelForm);
