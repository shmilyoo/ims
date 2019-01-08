'use strict';

const Controller = require('egg').Controller;

class ChannelController extends Controller {
  async deleteChannel() {
    const ctx = this.ctx;
    const { from, id, channelParentId } = ctx.request.body;
    if (!id || !from || !channelParentId) ctx.throw('错误的请求参数！');
    const ArticleModel =
      from === 'work' ? ctx.model.WorkArticle : ctx.model.DeptArticle;
    const count = await ArticleModel.count({
      where: { channelId: id },
    });
    if (count) {
      ctx.body = ctx.helper.getRespBody(false, '无法删除包含文章的频道');
      return;
    }
    const ChannelModel =
      from === 'work' ? ctx.model.WorkChannel : ctx.model.DeptChannel;
    await ChannelModel.destroy({ where: { id } });
    const channels = await ctx.service.channel.getChannels(
      from,
      channelParentId
    );
    ctx.body = ctx.helper.getRespBody(true, channels);
  }
}

module.exports = ChannelController;
