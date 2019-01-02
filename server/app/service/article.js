'use strict';

const Service = require('egg').Service;

class ArticleService extends Service {
  /**
   *
   * @param {Boolean} withPublisher 是否包含发布人
   * @param {Boolean} withChannel 是否包含频道信息
   * @param {Boolean} withRelative 是否包含work或者dept信息
   * @param {'work'|'dept'} from relative代表work还是dept
   * @return {Array} 返回include
   */
  getArticleIncludeSync(withPublisher, withChannel, withRelative, from) {
    const ctx = this.ctx;
    const include = [];
    if (withPublisher) {
      include.push({
        model: ctx.model.User,
        as: 'publisher',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withChannel) {
      include.push({
        model: ctx.model.WorkChannel,
        as: 'channel',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withRelative) {
      include.push({
        model: from === 'work' ? ctx.model.Work : ctx.model.Dept,
        as: 'from',
        attributes: [ 'id', from === 'work' ? 'title' : 'name' ],
      });
    }
    return include;
  }
}

module.exports = ArticleService;
