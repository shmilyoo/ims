'use strict';

const Service = require('egg').Service;

class ArticleService extends Service {
  async addArticle(data, type) {
    const ctx = this.ctx;
    const Model =
      type === 'work' ? ctx.model.WorkArticle : ctx.model.DeptArticle;
    return await Model.create(data);
  }

  getArticleIncludeSync({
    from,
    channelId,
    channelParentId,
    withChannel,
    withPublisher,
    withChannelParent,
  }) {
    const ctx = this.ctx;
    const ChannelModel =
      from === 'work' ? ctx.model.WorkChannel : ctx.model.DeptChannel;
    const include = [];
    if (withChannel || channelId === 'all') {
      const includeChannel = {
        model: ChannelModel,
        as: 'channel',
        attributes: [ 'id', 'name' ],
        where:
          channelId === 'all'
            ? { [from === 'work' ? 'workId' : 'deptId']: channelParentId }
            : {},
      };
      include.push(includeChannel);
      // 作为channel的上级，Work和Dept是互斥的,统一用withChannelParent
      if (withChannelParent) {
        includeChannel.include = [
          {
            model: from === 'work' ? ctx.model.Work : ctx.model.Dept,
            as: from,
            attributes: [ 'id', from === 'work' ? 'title' : 'name' ],
          },
        ];
      }
    }
    if (withPublisher) {
      include.push({
        model: ctx.model.User,
        as: 'publisher',
        attributes: [ 'id', 'name' ],
      });
    }
    return include;
  }

  getArticleOrderSync(order) {
    const _order = [];
    if (order.updateTime) {
      _order.push([ 'updateTime', order.updateTime ]);
    }
    if (order.createTime) {
      _order.push([ 'createTime', order.createTime ]);
    }
    return _order;
  }
}

module.exports = ArticleService;
