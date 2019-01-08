import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  withStyles,
  Paper,
  Button
} from '@material-ui/core';
import Axios from 'axios';
import ChannelForm from '../../../forms/work/ChannelForm';
import { getWorkChannels, delChannel } from '../../../services/utility';

const style = {
  listItem: {},
  left: {
    width: '20rem'
  }
};

class EditWorkChannel extends React.PureComponent {
  state = {
    channels: null,
    selectedChannel: {}
  };
  componentDidMount() {
    getWorkChannels(this.props.id).then(res => {
      if (res.success) {
        this.setState({ channels: res.data });
      }
    });
  }
  channelItemClick = channel => {
    this.setState({
      selectedChannel:
        channel.id === this.state.selectedChannel.id ? {} : channel
    });
  };
  handleSwitchClick = () => {
    this.setState({ selectedChannel: {} });
  };

  handleDelChannel = () => {
    if (!this.state.selectedChannel.id) return;
    delChannel('work', this.state.selectedChannel.id, this.props.id).then(
      res => {
        if (res.success) {
          this.setState({ selectedChannel: {}, channels: res.data });
        }
      }
    );
  };
  handleSubmit = values => {
    const init = { name: '', content: '', order: NaN };
    return new Promise((resolve, reject) => {
      if (this.state.selectedChannel.id) {
        Axios.post('/work/channel/update', {
          values,
          workId: this.props.id
        }).then(res => {
          if (res.success) {
            this.setState({ selectedChannel: values, channels: res.data });
            resolve();
          } else {
            reject({
              _error: res.error
            });
          }
        });
      } else {
        this.setState({ selectedChannel: values });
        Axios.post('/work/channel/add', {
          values,
          workId: this.props.id
        }).then(res => {
          if (res.success) {
            this.setState({ selectedChannel: init, channels: res.data });
            resolve();
          } else {
            reject({
              _error: res.error
            });
          }
        });
      }
    });
  };
  render() {
    const { classes } = this.props;
    const { channels, selectedChannel } = this.state;
    return (
      <Grid container spacing={16} wrap="nowrap" style={{ height: '100%' }}>
        <Grid item className={classes.left}>
          <Paper style={{ height: '100%' }}>
            <List>
              {channels && channels.length > 0 ? (
                channels.map(channel => (
                  <ListItem
                    className={classes.listItem}
                    button
                    divider
                    key={channel.id}
                    selected={
                      selectedChannel && selectedChannel.id === channel.id
                    }
                    onClick={() => {
                      this.channelItemClick(channel);
                    }}
                  >
                    <ListItemText primary={`${channel.name}`} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="频道为空" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs container spacing={16} direction="column" wrap="nowrap">
          <Grid item>
            <Button
              disabled={!selectedChannel.id}
              onClick={this.handleSwitchClick}
            >
              添加频道
            </Button>
          </Grid>
          <Grid item>
            <ChannelForm
              form="channelForm"
              edit={!!selectedChannel.id}
              enableReinitialize
              onSubmit={this.handleSubmit}
              onDelChannel={this.handleDelChannel}
              initialValues={selectedChannel}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

EditWorkChannel.propTypes = {
  id: PropTypes.string.isRequired // 需要编辑的work 的id
};

export default compose(withStyles(style))(EditWorkChannel);
