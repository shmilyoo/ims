import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';

const RenderInputSelect = ({
  input: { onChange, ...inputRest },
  readOnly,
  label,
  data = [], //[{label,value},...]
  meta: { touched, error },
  onSelectChange,
  ...rest
}) => {
  return (
    <TextField
      select
      SelectProps={{
        onChange: (e, child) => {
          onChange(e); // callback redux form的 onchange
          onSelectChange && onSelectChange(e, child); // 另外也把select的自身onChange暴露出来，以便获取menuitem的更多props属性
        }
      }}
      label={label}
      fullWidth
      error={!readOnly && !!(touched && error)}
      helperText={!readOnly && touched && error ? error : ' '}
      InputProps={{
        readOnly
      }}
      {...inputRest}
      {...rest}
    >
      {data.map(({ value, label, color, ...rest }) => (
        <MenuItem key={value} value={value} style={{ color: color }} {...rest}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default RenderInputSelect;
