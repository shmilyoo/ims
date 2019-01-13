import React from 'react';
import RichEditor from '../../components/common/RichEditor';

const RenderRichEditor = ({ simple, input, label, ...rest }) => {
  console.log('render richeditor typeof input.value ', typeof input.value);
  if (typeof input.value !== 'string') return null;
  return (
    <RichEditor simple={simple} placeholder={label} {...input} {...rest} />
  );
};

export default RenderRichEditor;
