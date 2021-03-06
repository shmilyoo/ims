import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, withStyles, IconButton } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';

const style = theme => ({
  cancelBtn: {
    padding: '0',
    '&:hover': {
      color: theme.palette.error.light
    }
  },
  link: theme.sharedClass.link
});

class FileList extends PureComponent {
  render() {
    const { files, edit, onDelFile, classes } = this.props;
    return (
      <Grid item container spacing={8} direction="column" wrap="nowrap">
        {files &&
          files.map(
            file =>
              file.type !== 'delete' && (
                <Grid
                  item
                  key={file.path}
                  container
                  spacing={8}
                  alignItems="center"
                >
                  <Grid item>
                    <Link
                      className={classes.link}
                      download={`${file.name}${file.ext}`}
                      // type为add或者delete表示新增还没上传或者已经删除的，不需要链接
                      to={file.type ? '#' : `/upload/${file.path}`}
                    >{`${file.name}${file.ext}`}</Link>
                  </Grid>
                  {edit && (
                    <Grid item>
                      <IconButton
                        className={classes.cancelBtn}
                        onClick={() => onDelFile(file)}
                      >
                        <Cancel />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              )
          )}
      </Grid>
    );
  }
}

FileList.propTypes = {
  edit: PropTypes.bool,
  // [{name,path,ext,type?}..],type: add||delete||undefined, 用来后端区别
  files: PropTypes.array,
  delFile: PropTypes.func // 点删除的回调，在edit为true的时候必须设置
};

FileList.defaultProps = {
  edit: false
};

export default compose(withStyles(style))(FileList);
