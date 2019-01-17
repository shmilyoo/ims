import React from 'react';
import { Tabs, Tab, Grid, Button } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import qs from 'qs';
import history from '../../../history';
import { toRedirectPage } from '../../../services/utility';
import EditWorkBasic from './EditWorkBasic';
import EditWorkChannel from './EditWorkChannel';
import ManageWorkArticles from './ManageWorkArticles';
import ManageWorkTasks from './ManageWorkTasks';

class WorkEdit extends React.PureComponent {
  constructor(props) {
    super(props);
    const { type = 'basic', id } = qs.parse(props.location.search, {
      ignoreQueryPrefix: true
    });
    if (!id) toRedirectPage('错误的请求参数', '/');
    this.state = {
      type,
      id
    };
  }

  tabChange = (_event, value) => {
    this.setState({ type: value });
    history.push(
      `/work/edit?${qs.stringify({ type: value, id: this.state.id })}`
    );
  };
  render() {
    const { type, id } = this.state;
    return (
      <Grid
        container
        direction="column"
        wrap="nowrap"
        style={{ height: '100%' }}
      >
        <Grid item container alignItems="flex-end">
          <Grid item>
            <Button
              title="返回工作信息页面"
              size="small"
              variant="text"
              style={{ padding: 0 }}
              onClick={() => {
                history.push(`/work/info?id=${id}`);
              }}
            >
              <UndoIcon />
            </Button>
          </Grid>
          <Grid item xs>
            <Tabs
              value={type}
              onChange={this.tabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab key="basic" label="基本信息" value="basic" />
              <Tab key="task" label="任务管理" value="task" />
              <Tab key="channel" label="频道管理" value="channel" />
              <Tab key="article" label="文章管理" value="article" />
              <Tab key="discuss" label="讨论管理" value="discuss" />
            </Tabs>
          </Grid>
        </Grid>
        <Grid item xs style={{ marginTop: '2rem' }}>
          {type === 'basic' && <EditWorkBasic id={id} />}
          {type === 'task' && <ManageWorkTasks id={id} />}
          {type === 'channel' && <EditWorkChannel id={id} />}
          {type === 'article' && <ManageWorkArticles id={id} />}
          {type === 'discuss' && 'discuss'}
        </Grid>
      </Grid>
    );
  }
}

export default WorkEdit;
