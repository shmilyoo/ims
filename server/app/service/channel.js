'use strict';

const Service = require('egg').Service;

class ChannelService extends Service {
  async getChannels(from, channelParentId) {
    const ctx = this.ctx;
    const ChannelModel =
      from === 'work' ? ctx.model.WorkChannel : ctx.model.DeptChannel;
    const channels = await ChannelModel.findAll({
      where: { [from === 'work' ? 'workId' : 'deptId']: channelParentId },
      order: [ 'order' ],
    });
    return channels;
  }
}

module.exports = ChannelService;
