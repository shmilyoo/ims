import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  withStyles,
  TextField,
  CircularProgress
} from '@material-ui/core';
import Axios from 'axios';
import { imageUploadUrl, imageUrlPrefix } from '../../config';

const style = {
  radioGroup: {
    display: 'flex',
    flexDirection: 'row'
  },
  radio: {
    marginLeft: '1rem',
    marginRight: '1rem'
  },
  dialog: {
    minWidth: '50rem',
    minHeight: '20rem'
  },
  img: {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%'
  }
};

class UploadImageDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultType || 'external',
      imgSrc: '', // preview img at left’s src
      error: '',
      file: null,
      showProgress: false, // show uploading when uploading file
      value: '' // the real image url to commit
    };
    this.inputFile = React.createRef();
  }

  handleTypeChange = event => {
    if (this.props.canChange)
      this.setState({ type: event.target.value, imgSrc: '', value: '' });
  };
  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  handleExternalUrlChange = e => {
    const url = e.target.value;
    this.setState({ imgSrc: url, value: url });
  };
  handleUploadInputTextClick = () => {
    this.inputFile.current.click();
  };
  handleUploadInputFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      this.getBase64(file)
        .then(data => {
          this.setState({ imgSrc: data, file, error: '' });
        })
        .catch(error => {
          this.setState({ file, error: error.message });
        });
    }
  };
  handleUpload = () => {
    console.log('click upload');
    const { file } = this.state;
    const { maxSize } = this.props;
    const allowExts = ['.jpg', '.png', '.gif'];
    if (!file) return;
    console.log('click upload');
    let ext = path.extname(file.name).toLowerCase();
    if (!allowExts.includes(ext)) {
      this.setState({
        error: `只允许${allowExts.join(' ')}扩展名`
      });
      return;
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
    this.setState({ showProgress: true });
    Axios.post(imageUploadUrl, data, {
      onUploadProgress: this.handlePropgress,
      timeout: 0 // 全局设置了5000ms的过期时间
    })
      .then(res => {
        if (res.success) {
          this.inputFile.current.value = null;
          const imageUrl = path.join(imageUrlPrefix, res.data.path);
          this.setState({
            value: imageUrl,
            imgSrc: imageUrl,
            file: null,
            showProgress: false
          });
        } else {
          this.setState({ showProgress: false });
        }
      })
      .catch(err => {
        this.setState({ showProgress: false, error: err.message });
      });
  };

  handleConfirmBtn = () => {
    this.props.onOk && this.props.onOk(this.state.value);
    this.setState({
      imgSrc: '',
      error: '',
      file: null,
      showProgress: false,
      value: ''
    });
  };

  render() {
    const { open, onClose, classes, canChange } = this.props;
    const { type, file, error, imgSrc, value, showProgress } = this.state;
    return (
      <Dialog open={open}>
        <DialogTitle>插入图片</DialogTitle>
        <DialogContent className={classes.dialog}>
          <Grid container direction="column" wrap="nowrap" spacing={16}>
            <Grid item container justify="center">
              <RadioGroup
                name="type"
                className={classes.radioGroup}
                value={type}
                onChange={this.handleTypeChange}
              >
                <FormControlLabel
                  disabled={!canChange && type !== 'external'}
                  className={classes.radio}
                  value="external"
                  control={<Radio />}
                  label="输入地址"
                />
                <FormControlLabel
                  disabled={!canChange && type !== 'upload'}
                  className={classes.radio}
                  value="upload"
                  control={<Radio />}
                  label="本地上传"
                />
              </RadioGroup>
            </Grid>
            <Grid item container spacing={8} wrap="nowrap">
              <Grid item xs={5}>
                <img alt="显示图片" className={classes.img} src={imgSrc} />
              </Grid>
              {type === 'upload' && (
                <Grid item xs container direction="column">
                  <Grid
                    item
                    container
                    justify="center"
                    alignItems="center"
                    spacing={8}
                  >
                    <Grid item xs>
                      <input
                        ref={this.inputFile}
                        onChange={this.handleUploadInputFileChange}
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
                        onClick={this.handleUploadInputTextClick}
                        label="选择上传的文件"
                        style={{ cursor: 'pointer' }}
                        value={file ? file.name : ''}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        disabled={!file}
                        onClick={this.handleUpload}
                        size="small"
                      >
                        上传
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item>
                    {value && `成功上传，地址为 ${value}`}
                    {showProgress && (
                      <FormControlLabel
                        label="  正在上传"
                        control={
                          <CircularProgress color="secondary" size={20} />
                        }
                      />
                    )}
                  </Grid>
                </Grid>
              )}
              {type === 'external' && (
                <Grid item xs container justify="flex-start">
                  <Grid item xs>
                    <TextField
                      onBlur={this.handleExternalUrlChange}
                      fullWidth
                      multiline
                      label="请输入图片的url地址"
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleConfirmBtn}
            disabled={!value}
            variant="contained"
            color="secondary"
          >
            插入
          </Button>
          <Button onClick={onClose}>关闭</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

UploadImageDialog.propTypes = {
  defaultType: PropTypes.string,
  canChange: PropTypes.bool, // 是否可以切换type
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  maxSize: PropTypes.number // the max file size (byte) to be allowed
};

UploadImageDialog.defaultProps = {
  uploadPath: '',
  canChange: true
};

export default withStyles(style)(UploadImageDialog);
