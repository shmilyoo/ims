import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Typography, Chip, Button, TextField } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import ColorPicker from '../../components/common/ColorPicker';
import { compose } from 'recompose';
import { actions as systemActions } from '../../reducers/system';
import { actions as commonAction } from '../../reducers/common';

class SystemConfigTag extends React.PureComponent {
  state = {
    isEdit: false,
    tagName: '',
    tagOrder: 1,
    tagColor: '',
    selectId: ''
  };

  componentDidMount() {
    if (!this.props.tags) {
      this.props.dispatch(systemActions.sagaGetTags());
    }
  }

  colorPickerChange = color => {
    this.setState({ tagColor: color });
  };
  tagNameChange = e => {
    this.setState({ tagName: e.target.value.trim() });
  };
  orderChange = e => {
    this.setState({ tagOrder: e.target.value });
  };
  tagClick = (id, name, color, order) => {
    if (this.state.selectId === id) {
      this.setState({ selectId: '', tagName: '', tagColor: '', tagOrder: NaN });
    } else {
      this.setState({
        selectId: id,
        tagName: name,
        tagColor: color,
        tagOrder: order
      });
    }
  };
  tagAddUpdate = () => {
    const { selectId, tagName, tagColor, tagOrder } = this.state;
    if (!(tagName && tagColor && tagOrder)) {
      this.props.dispatch(
        commonAction.showMessage('标签名、颜色、排序不能为空', 'error')
      );
      return;
    }
    const order = Number.parseInt(tagOrder);
    if (!(order && order > 0 && order < 1000)) {
      this.props.dispatch(
        commonAction.showMessage('排序必须是大于0小于1000的整数', 'error')
      );
      return;
    }
    if (!!selectId) {
      // 编辑模式
      this.props.dispatch(
        systemActions.sagaUpdateTag(selectId, tagName, tagColor, order)
      );
    } else {
      // 添加模式
      this.props.dispatch(systemActions.sagaAddTag(tagName, tagColor, order));
    }
  };
  delTag = id => {
    this.setState({ selectId: '', tagName: '', tagColor: '', tagOrder: NaN });
    this.props.dispatch(systemActions.sagaDeleteTag(id));
  };
  render() {
    const { tagOrder, tagName, tagColor, selectId } = this.state;
    const { tags, theme } = this.props;
    return (
      <Grid container direction="column" spacing={8}>
        <Grid item>
          <Typography variant="h6">标签管理:</Typography>
        </Grid>
        <Grid item>
          {tags &&
            tags.map(tag => (
              <Chip
                key={tag.id}
                label={tag.name}
                onClick={() => {
                  tag.name !== '其他' &&
                    this.tagClick(tag.id, tag.name, tag.color, tag.order);
                }}
                onDelete={
                  tag.name === '其他'
                    ? null
                    : () => {
                        this.delTag(tag.id);
                      }
                }
                style={{
                  color: theme.palette.getContrastText(tag.color),
                  backgroundColor: tag.color,
                  marginRight: '1rem',
                  boxShadow: tag.id === selectId ? '0 0 20px red' : ''
                }}
              />
            ))}
        </Grid>
        <Grid item container alignItems="flex-end" spacing={8}>
          <Grid item>
            <TextField
              label="标签名"
              value={tagName}
              onChange={this.tagNameChange}
            />
          </Grid>
          <Grid item>
            <ColorPicker
              label="标签颜色"
              color={tagColor}
              onChange={this.colorPickerChange}
            />
          </Grid>
          <Grid item>
            <TextField
              label="排序"
              value={tagOrder}
              onChange={this.orderChange}
              inputProps={{ type: 'number', min: 1 }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color={!!selectId ? 'primary' : 'secondary'}
              size="small"
              onClick={this.tagAddUpdate}
            >
              {!!selectId ? '编辑' : '添加'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

SystemConfigTag.propTypes = {};

function mapStateToProps(state) {
  return {
    tags: state.system.tags
  };
}
export default compose(
  connect(mapStateToProps),
  withTheme()
)(SystemConfigTag);
