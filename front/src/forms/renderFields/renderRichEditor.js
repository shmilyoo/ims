import React from 'react';
// import RichEditor from '../../components/common/RichEditor';
import Loading from '../../components/common/Loading';
import Loadable from 'react-loadable';

const LoadableRichEditor = Loadable({
  loader: () => import('../../components/common/RichEditor'),
  loading: Loading
});

const RenderRichEditor = ({ simple, input, label, ...rest }) => {
  return (
    <LoadableRichEditor
      simple={simple}
      placeholder={label}
      {...input}
      {...rest}
    />
    // <RichEditor simple={simple} placeholder={label} {...input} {...rest} />
  );
};

export default RenderRichEditor;
