import React from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

const CustomToolbar = ({ simple, onImageClick }) => (
  <div id="toolbar">
    <select className="ql-header" defaultValue="" onChange={e => e.persist()}>
      <option value="1" />
      <option value="2" />
      <option value="3" />
      <option value="4" />
      <option value="5" />
      <option value="6" />
      <option value="">正文</option>
    </select>
    <select defaultValue="" className="ql-size">
      <option value="small" />
      <option />
      <option value="large" />
      <option value="huge" />
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-color" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    <button className="ql-direction" value="rtl" />
    <button className="ql-script" value="sub" />
    <button className="ql-script" value="super" />
    <button className="ql-indent" value="-1" />
    <button className="ql-indent" value="+1" />
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <button className="ql-code-block" />
    <button className="ql-blockquote" />
    <button className="ql-link" />
    <button className="ql-image" />
    {/* <button className="ql-customImage" onClick={onImageClick}>
      <svg viewBox="0 0 18 18">
        <rect className="ql-stroke" height="10" width="12" x="3" y="4" />
        <circle className="ql-fill" cx="6" cy="7" r="1" />
        <polyline
          className="ql-even ql-fill"
          points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"
        />
      </svg>
    </button> */}
    <button className="ql-video" />
    <select className="ql-align" defaultValue="">
      <option />
      <option value="center" />
      <option value="right" />
      <option value="justify" />
    </select>
    <select className="ql-color">
      <option value="red" />
      <option value="green" />
      <option value="blue" />
      <option value="orange" />
      <option value="violet" />
      <option value="#d0d1d2" />
      <option />
    </select>
    <select className="ql-font">
      <option value="serif" />
      <option value="monospace" />
      <option />
    </select>
  </div>
);

class RenderRichEditor extends React.PureComponent {
  handleImageClick = e => {
    alert('afd');
  };
  imageHandler = (image, callback) => {
    var range = this.quillRef.getEditor().getSelection();
    var value = prompt('What is the image URL');
    if (value) {
      this.quillRef
        .getEditor()
        .insertEmbed(range.index, 'image', value, 'user');
    }
  };
  render() {
    const {
      simple,
      input: { value, onChange, onBlur, ...restInput },
      label,
      // meta: { touched, error },
      ...rest
    } = this.props;
    return (
      <div className="text-editor">
        <CustomToolbar simple={simple} onImageClick={this.handleImageClick} />
        <ReactQuill
          ref={el => (this.quillRef = el)}
          value={value}
          placeholder={label}
          modules={{
            toolbar: {
              container: '#toolbar',
              handlers: {
                image: this.imageHandler
              }
            }
          }}
          theme="snow"
          onChange={(newValue, delta, source) => {
            if (source === 'user') {
              onChange(newValue);
            }
          }}
          onBlur={(range, source, quill) => {
            onBlur(quill.getHTML());
          }}
          {...restInput}
          {...rest}
        >
          {/* <div
            // id="editor"
            className="my-editing-area"
            // style={{
            //   minHeight: '10rem',
            //   height: '20rem',
            //   resize: 'vertical',
            //   overflow: 'auto'
            // }}
          /> */}
        </ReactQuill>
      </div>
    );
  }
}

export default RenderRichEditor;
