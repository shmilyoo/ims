import React from 'react';
import { Tabs, Tab, Grid } from '@material-ui/core';
import qs from 'qs';
import history from '../../../history';
import UserInfoBasic from './UserInfoBasic';

class UserInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    const { type = 'basic' } = qs.parse(props.location.search, {
      ignoreQueryPrefix: true
    });
    this.state = {
      type
    };
  }

  tabChange = (_event, value) => {
    this.setState({ type: value });
    history.push(`/user/info?${qs.stringify({ type: value })}`);
  };
  render() {
    const { type } = this.state;
    return (
      <Grid
        container
        direction="column"
        wrap="nowrap"
        style={{ height: '100%' }}
      >
        <Grid>
          <Tabs
            value={type}
            onChange={this.tabChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab key="basic" label="基本信息" value="basic" />
            <Tab key="password" label="修改密码" value="password" />
            <Tab key="photo" label="设置头像" value="photo" />
          </Tabs>
        </Grid>
        <Grid item xs style={{ marginTop: '2rem' }}>
          {type === 'basic' && <UserInfoBasic />}
          {type === 'password' && null}
          {type === 'photo' && null}
        </Grid>
      </Grid>
    );
  }
}

export default UserInfo;
