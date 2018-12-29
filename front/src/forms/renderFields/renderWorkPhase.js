import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Grid, Button, IconButton, Typography } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import setMinutes from 'date-fns/setMinutes';
import setHours from 'date-fns/setHours';
import { RenderDatePicker, RenderTextField } from '.';
import { formatUnixTimeToDate, parseDateToUnixTime } from '../formatParse';
import { required } from '../validate';
import { trim } from '../normalize';

const renderEduExps = ({ fields }) => {
  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid
        item
        container
        justify="flex-start"
        alignItems="center"
        spacing={16}
      >
        <Grid item>
          <Typography variant="h6">大项工作的阶段</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="fab"
            mini
            color="secondary"
            onClick={() => {
              fields.push({});
            }}
          >
            <Add />
          </Button>
        </Grid>
      </Grid>
      {fields.map((phase, index) => (
        <Grid key={index} item container spacing={8} alignItems="center">
          <Grid item xs={7}>
            <Field
              name={`${phase}.title`}
              component={RenderTextField}
              label="阶段名称*"
              normalize={trim}
              validate={required}
            />
          </Grid>

          <Grid item xs={2}>
            <Field
              name={`${phase}.from`}
              label="开始时间*"
              dateFormat="YYYY-MM-dd HH:mm"
              timeFormat="HH:mm"
              showTimeSelect
              timeCaption="选择时间"
              component={RenderDatePicker}
              format={formatUnixTimeToDate}
              parse={parseDateToUnixTime}
              validate={required}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name={`${phase}.to`}
              dateFormat="YYYY-MM-dd HH:mm"
              timeFormat="HH:mm"
              showTimeSelect
              timeCaption="选择时间"
              injectTimes={[setHours(setMinutes(new Date(), 59), 23)]}
              component={RenderDatePicker}
              format={formatUnixTimeToDate}
              parse={parseDateToUnixTime}
              nullText="至今/未定"
              canClear={true}
              label="结束时间"
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={() => {
                fields.remove(index);
              }}
            >
              <Delete color="error" />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Grid item />
    </Grid>
  );
};

renderEduExps.propTypes = {
  label: PropTypes.string, // 不设置trueLabel和falseLabel时显示的文本
  trueLabel: PropTypes.string, // switch为true的时候显示的文本
  falseLabel: PropTypes.string
};

export default renderEduExps;
