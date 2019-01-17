/**
 * 为了避免出现 The given range isn't in document 问题（手动输入第一个字符时）
 * 每一个使用此富文本编辑器的内容，在提交时都要套上一个<div> </div>(如果没有的话)
 */

import React from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../../assets/css/quillFont.css';
import ColorPicker from './ColorPicker';
import UploadImageDialog from './UploadImageDialog';
import ImageResize from 'quill-image-resize-module-mended';

var Size = Quill.import('attributors/style/size');
const fontSizeList = [
  8,
  10,
  12,
  14,
  16,
  18,
  20,
  22,
  24,
  26,
  28,
  30,
  35,
  40,
  45,
  50
];
Size.whitelist = fontSizeList.map(n => `${n}px`);
Quill.register(Size, true);
Quill.register('modules/imageResize', ImageResize);

var fonts = [
  'SimSun',
  'SimHei',
  'Microsoft-YaHei',
  'KaiTi_GB2312',
  'FangSong_GB2312',
  'Arial',
  'Times-New-Roman',
  'sans-serif'
];
var Font = Quill.import('formats/font');
Font.whitelist = fonts;
Quill.register(Font, true);

/**
 * image resize模块在设置image align的时候，content不响应的问题
 * refer to https://github.com/kensnyder/quill-image-resize-module/issues/10
 */
function fixImageNotResponseStyleAttributeIssue() {
  const BaseImageFormat = Quill.import('formats/image');
  const ImageFormatAttributesList = ['alt', 'height', 'width', 'style'];
  class ImageFormat extends BaseImageFormat {
    static formats(domNode) {
      return ImageFormatAttributesList.reduce(function(formats, attribute) {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      }, {});
    }
    format(name, value) {
      if (ImageFormatAttributesList.indexOf(name) > -1) {
        if (value) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.removeAttribute(name);
        }
      } else {
        super.format(name, value);
      }
    }
  }
  Quill.register(ImageFormat, true);
}

fixImageNotResponseStyleAttributeIssue();

const CustomToolbar = ({ simple }) => (
  <div id="toolbar">
    {!simple && (
      <select className="ql-header" defaultValue="">
        <option value="1" />
        <option value="2" />
        <option value="3" />
        <option value="4" />
        <option value="5" />
        <option value="6" />
        <option value="">正文</option>
      </select>
    )}
    <select defaultValue="14px" className="ql-size">
      {fontSizeList.map(n => (
        <option key={n} value={`${n}px`}>
          {n}
        </option>
      ))}
    </select>
    {!simple && (
      <select className="ql-font">
        {fonts.map(font => (
          <option key={font} value={font} />
        ))}
        {/* <option value="serif" />
        <option value="monospace" /> */}
        <option />
      </select>
    )}
    <button className="ql-bold" />
    <button className="ql-italic" />
    <select className="ql-align" defaultValue="">
      <option />
      <option value="center" />
      <option value="right" />
      <option value="justify" />
    </select>
    <button className="ql-underline" />
    <button className="ql-strike" />
    {!simple && (
      <React.Fragment>
        <button id="richEditorColorBtn" className="ql-color" />
        <button id="richEditorBackgroundBtn" className="ql-background" />
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
        <button className="ql-video" />
      </React.Fragment>
    )}
  </div>
);

class RichEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.editor = null;
    this.state = {
      showPicker: false,
      showImageDialog: false,
      pickerLeft: 0,
      pickerTop: 0,
      editor: null
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.value.startsWith('<div>')) {
      // 此处包含编辑页面初始加载，以及初始content有值的时候的撤销操作
      this.editor.clipboard.dangerouslyPasteHTML(this.props.value, 'silent');
    }
    if (prevProps.value && !this.props.value && this.editor) {
      console.log('此处为初始content为空时候的撤销操作 ', this.props.value);
      this.editor.clipboard.dangerouslyPasteHTML('', 'silent');
    }
  }

  componentDidMount() {
    this.createEditor().focus();
  }

  componentWillUnmount() {
    this.editor.off('editor-change', this.handleEditorChange);
    this.editor = null;
  }

  createEditor = () => {
    const { label, value } = this.props;
    // const { htmlContent } = this.state;
    this.editor = new Quill('#editor', {
      debug: 'warn',
      theme: 'snow',
      placeholder: label || '在此编辑内容',
      modules: {
        toolbar: {
          container: '#toolbar',
          handlers: {
            image: this.imageHandler,
            color: this.colorHandler,
            background: this.backgroundHandler
          }
        },
        imageResize: {}
      }
    });
    this.setState({ editor: this.editor });
    // 判断value中是否有值，如果有那么就写入编辑器中
    if (value) this.editor.clipboard.dangerouslyPasteHTML(value);
    // console.log('create htmlcontent ', htmlContent);
    // this.editor.clipboard.dangerouslyPasteHTML(htmlContent || '111111111');
    // 设置事件，change事件，
    this.editor.on('editor-change', this.handleEditorChange);
    return this.editor;
  };

  imageHandler = (image, callback) => {
    this.setState({ showImageDialog: true });
  };
  closeImageDialog = () => {
    this.setState({ showImageDialog: false });
  };
  insertImage = url => {
    const { index, length } = this.editor.getSelection(true);
    this.editor.insertEmbed(index, 'image', url);
    this.editor.setSelection(index + 1, length);
    this.closeImageDialog();
  };
  colorHandler = () => {
    this.colorPickerTarget = 'color'; // for reuse the colorpicker, you should know what you want to format when the colorpicker open
    this.showColorPicker('richEditorColorBtn');
  };
  backgroundHandler = () => {
    this.colorPickerTarget = 'background';
    this.showColorPicker('richEditorBackgroundBtn');
  };
  showColorPicker = refElmId => {
    const refElm = document.getElementById(refElmId);
    let top = refElm.offsetTop + refElm.offsetHeight;
    if (window.innerHeight - top < 300) top = refElm.offsetTop - 300;
    this.setState({
      pickerTop: top,
      pickerLeft: refElm.offsetLeft,
      showPicker: true
    });
  };
  handlePickerClose = () => {
    this.setState({ showPicker: false });
  };
  handleColorChange = color => {
    const { index, length } = this.editor.getSelection(true);
    if (length === 0) this.editor.format(this.colorPickerTarget, color);
    else this.editor.formatText(index, length, this.colorPickerTarget, color);
  };

  handleEditorChange = (
    eventType,
    rangeOrDelta,
    oldRangeOrOldDelta,
    source
  ) => {
    console.log('handleEditorChange eventType is ', eventType);
    if (eventType === Quill.events.SELECTION_CHANGE) {
      this.handleSelectionChange(rangeOrDelta, oldRangeOrOldDelta, source);
    }

    if (eventType === Quill.events.TEXT_CHANGE) {
      this.handleTextChange(rangeOrDelta, oldRangeOrOldDelta, source);
    }
  };
  handleTextChange = (delta, oldDelta, source) => {
    console.log(
      'handleTextChange delta and olddelta and source is ',
      delta,
      oldDelta,
      source
    );
    if (source === 'silent') return;
    // let html = this.editor.root.innerHTML;
    // if (!html.startsWith('<div>')) html = `<div>${html}</div>`;
    this.props.onChange && this.props.onChange(this.editor.root.innerHTML);
  };

  handleSelectionChange = (range, oldRange, source) => {
    console.log('handleSelectionChange range', range);
  };

  render() {
    const { showPicker, showImageDialog, pickerLeft, pickerTop } = this.state;
    return (
      <React.Fragment>
        <CustomToolbar simple={this.props.simple} />
        <div
          id="editor"
          style={{ resize: 'vertical', overflow: 'auto', minHeight: '15rem' }}
        />
        <ColorPicker
          show={showPicker}
          pickerTop={pickerTop}
          pickerLeft={pickerLeft}
          onChange={this.handleColorChange}
          onClose={this.handlePickerClose}
        />
        <UploadImageDialog
          open={showImageDialog}
          onClose={this.closeImageDialog}
          onOk={this.insertImage}
        />
      </React.Fragment>
    );
  }
}

export default RichEditor;
