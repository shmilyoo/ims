import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import {
  RenderTextField,
  RenderInputSelect,
  RenderFileUpload
} from '../renderFields';
import {
  required,
  checkMaxStringLength32,
  checkMaxStringLength255
} from '../validate';
import { trim } from '../normalize';

const ArticleForm = ({
  pristine,
  submitting,
  error,
  reset,
  handleSubmit,
  channels,
  allowExts,
  dispatch,
  edit = false
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={8} direction="column" wrap="nowrap">
        <Grid item container spacing={8}>
          <Grid item xs>
            <Field
              name="title"
              label="文章的标题(最长32个字符)*"
              component={RenderTextField}
              validate={[required, checkMaxStringLength32]}
              normalize={trim}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name="channelId"
              label="频道*"
              data={channels || []}
              component={RenderInputSelect}
              validate={required}
            />
          </Grid>
        </Grid>
        <Grid item xs>
          {/* todo 更改为富文本编辑器 */}
          <Field
            name="content"
            label="正文"
            multiline
            component={RenderTextField}
            validate={checkMaxStringLength255}
            normalize={trim}
          />
        </Grid>
        <Grid item>
          <Field
            name="attachments"
            component={RenderFileUpload}
            dispatch={dispatch}
            allowExts={allowExts ? allowExts.split(';') : undefined}
            maxSize={1 * 1024 * 1024 * 1024}
            apiUrl="/upload/attachment "
          />
        </Grid>
        <Grid item container justify="center" spacing={32}>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              size="small"
              color="secondary"
              disabled={pristine || submitting || !!error}
            >
              {edit ? '保存' : '发布'}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              onClick={reset}
              disabled={pristine || submitting}
            >
              撤销
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

function mapStateToProps(state) {
  return {
    allowExts: state.system.allowExts
  };
}

export default compose(
  connect(mapStateToProps),
  reduxForm({ form: 'articleForm' })
)(ArticleForm);
