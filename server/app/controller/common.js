'use strict';

const Controller = require('egg').Controller;
const shell = require('shelljs');
const path = require('path');
const format = require('date-fns/format');

class CommonController extends Controller {
  async uploadAttachment() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    ctx.body = ctx.helper.getRespBody(
      !!file,
      file ? { tmpPath: file.filepath } : '无法获得上传文件'
    );
  }
  async uploadImage() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    if (!file) {
      ctx.body = ctx.helper.getRespBody(false, '无法获得上传文件');
      return;
    }
    const now = new Date();
    const [ year, month, day ] = format(now, 'yyyy-MM-dd').split('-');
    const relativeDirectory = path.join(
      'image',
      `${year}`,
      `${month}`,
      `${day}`
    );
    const dir = path.join(ctx.app.config.uploadRoot, relativeDirectory);
    if (!shell.test('-e', dir)) shell.mkdir('-p', dir);
    const basename = path.basename(file.filepath);
    const realPath = path.join(dir, basename);
    const relativePath = path.join(relativeDirectory, basename);
    shell.mv(file.filepath, realPath);
    ctx.body = ctx.helper.getRespBody(!!file, { path: relativePath });
  }
}

module.exports = CommonController;
