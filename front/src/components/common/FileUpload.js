import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Grid,
  Typography,
  Button,
  TextField,
  withStyles,
  LinearProgress,
  IconButton
} from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import path from 'path';
import axios from 'axios';
import compose from 'recompose/compose';
import FileList from './FileList';

const style = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  },
  cancelBtn: {
    padding: '0',
    '&:hover': {
      color: theme.palette.error.light
    }
  },
  hide: {
    visibility: 'hidden'
  }
});

class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.inputFile = React.createRef();
    this.source = axios.CancelToken.source();
    this.state = {
      file: null,
      fileName: '',
      percent: 0,
      showProgress: false,
      error: ''
    };
  }

  handlePropgress = e => {
    if (e.lengthComputable) {
      var percent = Math.round((e.loaded * 100) / e.total);
      this.setState({ percent });
    }
  };
  inputTextClick = () => {
    this.inputFile.current.click();
  };
  handleInputFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const fileName = path.basename(file.name, path.extname(file.name));
      this.setState({ file, fileName, error: '' });
    }
  };
  handleUpload = () => {
    console.log('click upload');
    const { file, fileName } = this.state;
    const { allowExts, apiUrl, maxSize, onChange } = this.props;
    if (!file) return;
    console.log('click upload');
    let ext = path.extname(file.name).toLowerCase();
    if (allowExts && allowExts.length > 0) {
      if (!allowExts.includes(ext)) {
        this.setState({
          error: `只允许${allowExts.join(' ')}扩展名`
        });
        return;
      }
    }
    if (maxSize && file.size > maxSize) {
      this.setState({
        error:
          maxSize > 1024 * 1024
            ? `最大允许上传${(maxSize / (1024 * 1024)).toFixed(1)}MB`
            : maxSize > 1024
              ? `最大允许上传${(maxSize / 1024).toFixed(1)}KB`
              : `最大允许上传${maxSize}Byte`
      });
      return;
    }
    let data = new FormData();
    data.append('file', file);
    // data.append('name', fileName);
    this.setState({ showProgress: true });
    axios
      .post(apiUrl, data, {
        onUploadProgress: this.handlePropgress,
        cancelToken: this.source.token,
        timeout: 0 // 全局设置了5000ms的过期时间
      })
      .then(res => {
        if (res.success) {
          const tmpPath = res.data.tmpPath;
          const file = { path: tmpPath, name: fileName, ext: ext, type: 'add' };
          onChange && onChange([...this.props.files, file]);
          this.clearSelectFile();
        } else {
          this.setState({ showProgress: false, percent: 0 });
        }
      })
      .catch(err => {
        console.log('catch');
        if (!axios.isCancel(err)) this.setState({ error: err.message });
        this.setState({ showProgress: false, percent: 0 });
      });
  };
  clearSelectFile = () => {
    this.inputFile.current.value = null;
    this.setState({
      file: null,
      showProgress: false,
      percent: 0,
      fileName: ''
    });
  };
  delFile = file => {
    this.props.onChange(
      this.props.files.map(_file => {
        if (_file.path === file.path) return { ..._file, type: 'delete' };
        return _file;
      })
    );
  };
  stopPost = () => {
    this.source && this.source.cancel('手动停止上传文件');
    // 重新获取source 要不然axios就无法发请求
    this.source = axios.CancelToken.source();
  };
  render() {
    const { files, classes } = this.props;
    const { file, fileName, percent, showProgress, error } = this.state;
    return (
      <Grid container direction="column" wrap="nowrap">
        {files &&
          files.length > 0 && (
            <Grid item>
              <Typography variant="body2">附件:</Typography>
            </Grid>
          )}
        <FileList onDelFile={this.delFile} edit={true} files={files} />
        <Grid item container spacing={8} alignItems="center">
          <Grid item xs={4}>
            <input
              ref={this.inputFile}
              onChange={this.handleInputFileChange}
              type="file"
              style={{ display: 'none' }}
            />
            <TextField
              fullWidth
              error={!!error}
              helperText={error || ' '}
              InputProps={{
                readOnly: true
              }}
              onClick={this.inputTextClick}
              label="选择上传的文件"
              style={{ cursor: 'pointer' }}
              value={file ? file.name : ''}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              helperText=" "
              label="文件名称"
              value={fileName}
              onChange={e => this.setState({ fileName: e.target.value })}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              disabled={showProgress || !file}
              onClick={this.handleUpload}
              size="small"
            >
              上传
            </Button>
          </Grid>
          {showProgress && (
            <Grid item xs container spacing={8} alignItems="center">
              <Grid item style={{ minWidth: '4rem' }}>
                <Typography align="right">{percent}%</Typography>
              </Grid>
              <Grid item xs>
                <LinearProgress
                  color="secondary"
                  variant="determinate"
                  value={percent}
                />
              </Grid>
              <Grid item>
                <IconButton
                  className={classnames(classes.cancelBtn, {
                    [classes.hide]: percent < 1 || percent > 99
                  })}
                  onClick={this.stopPost}
                >
                  <Cancel />
                </IconButton>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }
}

FileUpload.propTypes = {
  edit: PropTypes.bool,
  allowTypes: PropTypes.array, // 允许的上传扩展名，不设置为允许所有，扩展名不带.
  maxSize: PropTypes.number, // 允许上传最大字节数，0为不限制
  apiUrl: PropTypes.string, // 服务端接口
  onChange: PropTypes.func, // 受控组件回调
  // [{name,path,ext,type?}..],type: add||delete||undefined, 用来后端区别
  files: PropTypes.array
};

FileUpload.defaultProps = {
  maxSize: 50 * 1024 * 1024,
  edit: false
};

export default compose(withStyles(style))(FileUpload);
