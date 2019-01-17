import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import {
  RenderInputSelect,
  RenderDateRangePicker,
  RenderTextField
} from '../renderFields';
import { dateRangeRequired, required } from '../validate';

class WorkTaskSearchForm extends React.PureComponent {
  state = {
    searchKind: 'text'
  };
  handleInputSelectChange = (e, child) => {
    this.setState({ searchKind: child.props.kind });
    this.props.change('value', '');
  };
  handleReset = () => {
    const { onReset, reset } = this.props;
    reset();
    onReset && onReset();
  };
  render() {
    const {
      pristine,
      submitting,
      error,
      handleSubmit,
      selectData
    } = this.props;
    const { searchKind } = this.state;
    return (
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={8}
          wrap="nowrap"
          alignItems="center"
          justify="center"
        >
          <Grid item>
            {searchKind === 'text' ? (
              <Field
                name="value"
                label="搜索标题*"
                component={RenderTextField}
                validate={required}
              />
            ) : (
              <Field
                name="value"
                component={RenderDateRangePicker}
                validate={dateRangeRequired}
              />
            )}
          </Grid>
          <Grid item style={{ minWidth: '10rem' }}>
            <Field
              name="name"
              label="搜索类别"
              component={RenderInputSelect}
              onSelectChange={this.handleInputSelectChange}
              data={selectData}
              validate={required}
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
              搜索
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              onClick={this.handleReset}
              disabled={pristine || submitting}
            >
              清空
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default compose(reduxForm({ form: 'workTaskSearchForm' }))(
  WorkTaskSearchForm
);
