import React from 'react';
import RichEditor from '../../components/common/RichEditor';

const RenderRichEditor = ({ simple, input, label, ...rest }) => {
  return (
    <RichEditor simple={simple} placeholder={label} {...input} {...rest} />
  );
};

export default RenderRichEditor;
