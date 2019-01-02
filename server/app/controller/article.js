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
      relativeId,
      channelId,
      numberPerPage,
      currentPage,
      orderBy,
      direction,
      withChannel,
      withRelative,
      withPublisher,
    } = ctx.request.body;
    const include = ctx.service.getArticleIncludeSync(
      withPublisher,
      withChannel,
      withRelative,
      from
    );
    const where = { relativeId };
    if (channelId) where.channelId = channelId;
    const { count, articles } = await ctx.model.Article.findAndCountAll({
      include,
      where,
      limit: numberPerPage,
      offset: (currentPage - 1) * numberPerPage,
      order: [[ orderBy, direction ]],
    });
    ctx.body = ctx.helper.getRespBody(true, {
      articleList: articles || [],
      totalNumber: count,
    });
  }
}

module.exports = ArticleController;
