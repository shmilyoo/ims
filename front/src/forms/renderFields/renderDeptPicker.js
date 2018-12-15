import React from 'react';
import DeptPicker from '../../components/common/DeptPicker';

const RenderDeptPicker = ({
  input: { value, onChange, ...inputRest },
  disabled,
  label,
  deptArray,
  deptDic,
  meta: { touched, error },
  ...rest
}) => {
  return (
    <DeptPicker
      label={label}
      id={value}
      disabled={disabled}
      deptArray={deptArray}
      deptDic={deptDic}
      onDeptChange={onChange}
      error={!disabled && !!(touched && error)}
      helperText={!disabled && touched && error ? error : ' '}
      {...inputRest}
      {...rest}
    />
  );
};

export default RenderDeptPicker;
