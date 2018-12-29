import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';

const RenderInputSelect = ({
  input,
  readOnly,
  label,
  data = [], //[{label,value},...]
  meta: { touched, error },
  ...rest
}) => {
  return (
    <TextField
      select
      label={label}
      fullWidth
      error={!readOnly && !!(touched && error)}
      helperText={!readOnly && touched && error ? error : ' '}
      InputProps={{
        readOnly
      }}
      {...input}
      {...rest}
    >
      {data.map(option => (
        <MenuItem
          key={option.value}
          value={option.value}
          style={{ color: option.color }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default RenderInputSelect;
