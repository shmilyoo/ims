import React from 'react';
import UserPicker from '../../components/common/UserPicker';

const RenderUserPicker = ({
  input: { value, onChange, ...inputRest },
  disabled,
  label,
  deptArray,
  meta: { touched, error },
  ...rest
}) => {
  return (
    <UserPicker
      label={label}
      disabled={disabled}
      selectedUsers={value}
      deptArray={deptArray}
      onUserPickerChange={onChange}
      error={!disabled && !!(touched && error)}
      helperText={!disabled && touched && error ? error : ' '}
      {...inputRest}
      {...rest}
    />
  );
};

export default RenderUserPicker;
