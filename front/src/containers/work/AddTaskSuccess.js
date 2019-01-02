import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { toRedirectPage } from '../../services/utility';
import { Grid } from '@material-ui/core';

class AddTaskSuccess extends PureComponent {
  constructor(props) {
    super(props);
    const { workId, deptId, taskId } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    if (!(workId && deptId && taskId)) toRedirectPage('错误的url参数');
    this.state = { workId, deptId, taskId };
  }

  render() {
    const { workId, deptId, taskId } = this.state;
    return (
      <Grid
        style={{ height: '80%' }}
        container
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>新增任务成功，请选择下一步操作：</Grid>
        <Grid item container spacing={16} justify="center">
          <Grid item>
            <Link to={`/work/task/add?workId=${workId}`}>继续添加任务</Link>
          </Grid>
          <Grid item>
            <Link to={`/work/task/edit?id=${taskId}`}>编辑此项任务</Link>
          </Grid>
          <Grid item>
            <Link to={`/work/task/info?id=${taskId}`}>查看此项任务</Link>
          </Grid>
          <Grid item>
            <Link to={`/work/info?id=${workId}`}>查看所属工作</Link>
          </Grid>
          <Grid item>
            <Link to={`/dept/info?id=${deptId}`}>查看任务工作所属部门</Link>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default AddTaskSuccess;
