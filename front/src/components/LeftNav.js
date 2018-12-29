import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import {
  withStyles,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import history from '../history';
import classnames from 'classnames';
import account from '../sagas/account';

const drawerWidth = 250;

const style = {
  left: {
    // height: "100%",
    width: drawerWidth
  },
  leftPage: {
    width: drawerWidth,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 0 // pager原本zindex为1200， NProgress会被遮住
  },
  leftHeader: {
    height: '64px',
    lineHeight: '64px',
    color: '#FFF'
  },
  link: {
    color: '#FFF',
    opacity: 0.8,
    fontWeight: 'bold',
    fontSize: '1.8rem'
  },
  link2: {
    fontSize: '1.5rem',
    paddingLeft: '10px'
  },
  selected: {
    backgroundColor: '#333'
  }
};

class LeftNav extends React.PureComponent {
  state = {};

  static getDerivedStateFromProps(props, state) {
    const key = props.location.pathname.split('/')[1];
    if (!state[key]) {
      return {
        [key]: true
      };
    }
    return null;
  }

  drawItemClick = url => () => {
    // this.props.dispatch({ type: commonTypes.CHANGE_TITLE, title }); 在各自页面中设置title
    // console.log(this.props.location.pathname, url);
    if (this.props.location.pathname === url) {
      return;
    }
    history.push(url);
  };

  render() {
    const {
      classes,
      open,
      location,
      header,
      menu,
      isSuperAdmin,
      manageDept
    } = this.props;
    console.log('home left render');
    return (
      <div className={classes.left}>
        <Drawer
          classes={{ paper: classes.leftPage }}
          variant="persistent"
          open={open}
        >
          <Typography
            className={classes.leftHeader}
            component="div"
            align="center"
            variant="h6"
          >
            {header}
          </Typography>
          <Divider style={{ margin: '0 20px' }} />
          <List component="nav">
            {menu.map(
              ele =>
                (!ele.superAdmin || isSuperAdmin) &&
                (!ele.manageDept || !!manageDept) && (
                  <div key={ele.title}>
                    <ListItem
                      button
                      className={classnames({
                        [classes.selected]: ele.path === location.pathname
                      })} // 适用于没有子菜单的元素，也可以被选中
                      onClick={
                        ele.children
                          ? () => {
                              this.setState({
                                [ele.state]: !this.state[ele.state]
                              });
                            }
                          : this.drawItemClick(ele.path, ele.title)
                      }
                    >
                      {ele.icon && <ListItemIcon>{<ele.icon />}</ListItemIcon>}
                      <ListItemText
                        inset
                        primary={ele.title}
                        primaryTypographyProps={{ className: classes.link }}
                      />
                      {ele.children ? (
                        this.state[ele.state] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )
                      ) : null}
                    </ListItem>

                    {ele.children ? (
                      <Collapse
                        in={this.state[ele.state] ? true : false}
                        timeout="auto"
                      >
                        <List component="nav" disablePadding>
                          {ele.children.map(child => (
                            <ListItem
                              key={child.title}
                              className={classnames({
                                [classes.selected]:
                                  child.path === location.pathname
                              })}
                              button
                              onClick={this.drawItemClick(
                                child.path,
                                child.title
                              )}
                            >
                              <ListItemText
                                inset
                                primary={child.title}
                                primaryTypographyProps={{
                                  className: classnames(
                                    classes.link,
                                    classes.link2
                                  )
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    ) : null}
                  </div>
                )
            )}
          </List>
        </Drawer>
      </div>
    );
  }
}

LeftNav.propTypes = {
  type: PropTypes.string, // 代表是被哪个页面调用
  menu: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  header: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    isSuperAdmin: state.account.isSuperAdmin,
    manageDept: state.account.manageDept
  };
}

export default compose(
  withRouter,
  withStyles(style),
  connect(mapStateToProps)
)(LeftNav);
