import React from 'react';
import FileUpload from '../../components/common/FileUpload';

const RenderFileUpload = ({
  input: { value, onChange, ...inputRest },
  dispatch,
  ...rest
}) => {
  return (
    <FileUpload
      files={value || []}
      onChange={onChange}
      {...inputRest}
      {...rest}
    />
  );
};

export default RenderFileUpload;
