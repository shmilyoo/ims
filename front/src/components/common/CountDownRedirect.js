import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography } from '@material-ui/core';
import history from '../../history';
import compose from 'recompose/compose';

const style = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  link: theme.sharedClass.link
});

class CountDownRedirect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countDown: props.seconds
    };
  }
  count = () => {
    this.setState({ countDown: this.state.countDown - 1 });
  };
  componentDidMount() {
    this.timer = setInterval(this.count, 1000);
  }

  render() {
    const { children, redirect, classes } = this.props;
    const { countDown } = this.state;
    if (countDown === 0) {
      clearInterval(this.timer);
      history.push(redirect);
    }
    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={1} />
        <Grid item xs={2}>
          {countDown}
        </Grid>
        <Grid item xs>
          <div>
            <Typography>{children}</Typography>
          </div>
          <div>
            <Typography>
              直接
              <Typography className={classes.link} onClick={this.redirect}>
                点击此处
              </Typography>
              跳转
            </Typography>
          </div>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    );
  }
}

CountDownRedirect.propTypes = {
  redirect: PropTypes.string.isRequired,
  seconds: PropTypes.number
};

CountDownRedirect.defaultValue = {
  countDown: 5
};

export default compose(withStyles(style))(CountDownRedirect);
