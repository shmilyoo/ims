import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';

const RenderCheck = ({
  input: { value, onChange, ...inputRest },
  label,
  labelPlacement = 'end',
  ...rest
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          onChange={onChange}
          {...inputRest}
          {...rest}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
    />
  );
};

export default RenderCheck;
