'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {
  /**
   * 获取dept或者work的文章，可以指定channel id
   * 用来获取文章列表，适合分页页面
   */
  async getArticles() {
    const ctx = this.ctx;
    const {
      from,
      channelParentId,
      channelId,
      numberPerPage,
      currentPage,
      withChannel,
      withPublisher,
      withChannelParent,
      order,
    } = ctx.request.body;
    const include = ctx.service.article.getArticleIncludeSync({
      from,
      channelId,
      channelParentId,
      withChannel,
      withPublisher,
      withChannelParent,
    });
    const ArticleModel =
      from === 'work' ? ctx.model.WorkArticle : ctx.model.DeptArticle;
    // 如果只获取某一个channel的文章，在这里设置where
    // 如果获取一个work或者一个dept下面的文章，在include channel中设置where
    const where = channelId === 'all' ? {} : { channelId };
    const _order = ctx.service.article.getArticleOrderSync(order);
    const { count, rows } = await ArticleModel.findAndCountAll({
      include,
      where,
      limit: numberPerPage,
      offset: (currentPage - 1) * numberPerPage,
      order: _order,
    });
    ctx.body = ctx.helper.getRespBody(true, {
      articleList: rows || [],
      totalNumber: count,
    });
  }

  async deleteArticles() {
    const ctx = this.ctx;
    const { ids, from } = ctx.request.body;
    const ArticleModel =
      from === 'work' ? ctx.model.WorkArticle : ctx.model.DeptArticle;
    const transaction = await ctx.model.transaction();
    try {
      await ctx.model.Attachment.destroy({
        where: { relativeId: { [ctx.model.Op.in]: ids } },
      });
      await ArticleModel.destroy({
        where: { id: { [ctx.model.Op.in]: ids } },
      });
      await transaction.commit();
      ctx.body = ctx.helper.getRespBody(true);
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false);
    }
  }
}

module.exports = ArticleController;
