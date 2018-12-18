import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import qs from 'qs';
import history from '../../history';
import { toRedirectPage } from '../../services/utility';
import { Grid, Typography } from '@material-ui/core';

class AddWorkSuccess extends PureComponent {
  constructor(props) {
    super(props);
    const { id, deptId } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    if (!(id && deptId)) toRedirectPage('错误的url参数');
    this.state = { id, deptId };
  }

  render() {
    const { id, deptId } = this.state;
    return (
      <Grid
        style={{ height: '80%' }}
        container
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>新增大项工作成功，请选择下一步操作：</Grid>
        <Grid item container spacing={16} justify="center">
          <Grid item>
            <Link to="/dept-manage/work/add">继续添加</Link>
          </Grid>
          <Grid item>
            <Link to={`/dept-manage/work/edit/${id}`}>编辑此项工作</Link>
          </Grid>
          <Grid item>
            <Link to={`/work/${id}`}>查看此项工作</Link>
          </Grid>
          <Grid item>
            <Link to={`/dept/${deptId}`}>查看工作所属部门</Link>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

AddWorkSuccess.propTypes = {};

export default AddWorkSuccess;
