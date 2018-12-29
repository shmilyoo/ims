'use strict';

const Controller = require('egg').Controller;
const path = require('path');

class CommonController extends Controller {
  async uploadAttachment() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    ctx.body = ctx.helper.getRespBody(
      !!file,
      file ? { tmpPath: file.filepath } : '无法获得上传文件'
    );
  }
}

module.exports = CommonController;
