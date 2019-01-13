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
    const { id } = ctx.request.body;
    const transaction = await ctx.model.transaction();
    try {
      const works = await ctx.model.Work.findAll({ where: { tagId: id } });
      if (works && works.length > 0) {
        const [ defaultTag ] = await ctx.model.Tag.findOrCreate({
          where: { name: '其他' },
          defaults: { name: '其他', color: '#666', order: 1000 },
        });
        await ctx.model.Work.update(
          { tagId: defaultTag.id },
          {
            where: {
              id: {
                [ctx.model.Op.in]: works.map(work => work.id),
              },
            },
          }
        );
      }
      await ctx.model.Tag.destroy({ where: { id } });
      const tags = await ctx.model.Tag.findAll({ order: [ 'order' ] });
      await transaction.commit();
      ctx.body = ctx.helper.getRespBody(true, tags);
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, error.message);
    }
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

  async setConfig() {
    const ctx = this.ctx;
    // {amFrom,amTo,pmFrom,pmTo}
    const values = ctx.request.body;
    const data = [];
    for (const key in values) {
      data.push({ name: key, value: values[key] });
    }
    await ctx.model.System.bulkCreate(data, {
      updateOnDuplicate: [ 'name', 'value' ],
    });
    ctx.body = ctx.helper.getRespBody(true);
  }
}

module.exports = SystemController;
