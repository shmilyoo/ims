import React from 'react';
import { TextField } from '@material-ui/core';

const RenderTextField = ({
  input,
  label,
  readOnly, // 模式：只读为readOnly
  meta: { touched, error },
  ...rest
}) => {
  return (
    <TextField
      label={label}
      error={!readOnly && !!(touched && error)}
      helperText={!readOnly && touched && error ? error : ' '}
      InputProps={{ readOnly }}
      fullWidth
      {...input}
      {...rest}
    />
  );
};

export default RenderTextField;
