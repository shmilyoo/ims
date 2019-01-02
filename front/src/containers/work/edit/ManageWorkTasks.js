import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, withStyles } from '@material-ui/core';
import compose from 'recompose/compose';
import TaskListWrapper from '../TaskListWrapper';

const style = theme => ({
  link: theme.sharedClass.link,
  grayLink: theme.sharedClass.grayLink
});

class ManageWorkTasks extends PureComponent {
  render() {
    const { id: workId, classes } = this.props;
    return (
      <Grid
        container
        direction="column"
        wrap="nowrap"
        spacing={8}
        className={classes.root}
      >
        <Grid item xs>
          <TaskListWrapper
            admin={true}
            workId={workId}
            hideColumns={[]}
            canChangeOrder={true}
          />
        </Grid>
      </Grid>
    );
  }
}

ManageWorkTasks.propTypes = {
  id: PropTypes.string.isRequired // workId
};

export default compose(withStyles(style))(ManageWorkTasks);
