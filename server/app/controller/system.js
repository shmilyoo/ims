'use strict';

const Controller = require('egg').Controller;

class SystemController extends Controller {
  async allConfig() {
    const ctx = this.ctx;
    const configs = await ctx.model.System.findAll({
      attributes: [ 'name', 'value' ],
    });
    ctx.body = ctx.helper.getRespBody(true, configs);
  }

  async tags() {
    const ctx = this.ctx;
    const tags = await ctx.model.Tag.findAll({ order: [ 'order' ] });
    ctx.body = ctx.helper.getRespBody(true, tags);
  }

  async addTag() {
    const ctx = this.ctx;
    const { name, color, order } = ctx.request.body;
    await ctx.model.Tag.create({ name, color, order });
    const tags = await ctx.model.Tag.findAll({ order: [ 'order' ] });
    ctx.body = ctx.helper.getRespBody(true, tags);
  }

  async deleteTag() {
    const ctx = this.ctx;
    const { name } = ctx.request.body;
    await ctx.model.Tag.destroy({ where: { name } });
    const tags = await ctx.model.Tag.findAll({ order: [ 'order' ] });
    ctx.body = ctx.helper.getRespBody(true, tags);
  }

  async updateTag() {
    const ctx = this.ctx;
    const { name, color, order, id } = ctx.request.body;
    await ctx.model.Tag.update({ name, color, order }, { where: { id } });
    const tags = await ctx.model.Tag.findAll({ order: [ 'order' ] });
    ctx.body = ctx.helper.getRespBody(true, tags);
  }

  async timeScale() {
    const ctx = this.ctx;
    // {amFrom,amTo,pmFrom,pmTo}
    const body = ctx.request.body;
    const data = [];
    for (const key in body) {
      data.push({ name: key, value: body[key] });
    }
    await ctx.model.System.bulkCreate(data, {
      updateOnDuplicate: [ 'name', 'value' ],
    });
    ctx.body = ctx.helper.getRespBody(true);
  }
}

module.exports = SystemController;
