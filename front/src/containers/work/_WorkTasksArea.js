import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import WorkTaskList from './WorkTaskList';
import SearchTextFieldWithType from '../../components/common/SearchTextFieldWithType';

class WorkTasksArea extends PureComponent {
  state = { showSearch: true, searchValue: '', searchType: '' };
  handleSearchInputChange = searchValue => {
    this.setState({ searchValue });
    // if (typeof searchValue === 'string') {
    //   if (this.state.searchType) {
    //     this.debounceShowTasks();
    //   }
    // } else if (
    //   typeof searchValue === 'object' &&
    //   searchValue.from &&
    //   searchValue.to
    // ) {
    //   this.debounceShowTasks();
    // }
  };
  handleSearchTypeChange = searchType => {
    this.setState({ searchType });
  };
  render() {
    const { workId, taskShowStyle } = this.props;
    const { showSearch, searchType, searchValue } = this.state;
    return (
      <div>
        {showSearch && (
          <Grid item container justify="center">
            <Grid item xs={6}>
              <SearchTextFieldWithType
                label="搜索输入栏"
                value={searchValue}
                type={searchType}
                onInputChange={this.handleSearchInputChange}
                onTypeChange={this.handleSearchTypeChange}
                types={[
                  { value: 'title', label: '标题', searchKind: 'text' },
                  { value: 'from', label: '开始时间', searchKind: 'date' },
                  { value: 'to', label: '结束时间', searchKind: 'date' },
                  {
                    value: 'createTime',
                    label: '创建时间',
                    searchKind: 'date'
                  },
                  {
                    value: 'updateTime',
                    label: '更新时间',
                    searchKind: 'date'
                  }
                ]}
              />
            </Grid>
          </Grid>
        )}
        <Grid item>
          {taskShowStyle === 'list' && <WorkTaskList workId={workId} />}
          {taskShowStyle === 'timeline' && null}
        </Grid>
      </div>
    );
  }
}

WorkTasksArea.propTypes = {};

export default WorkTasksArea;
