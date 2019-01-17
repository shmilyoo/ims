'use strict';

const Service = require('egg').Service;
const shell = require('shelljs');
const path = require('path');
const format = require('date-fns/format');
const filenamify = require('filenamify');

class WorkService extends Service {
  /**
   * 将工作负责人和参加人列表加入到相应的工作或者task中
   * @param {array} usersInCharge 工作负责人列表
   * @param {array} usersAttend 工作参加人列表
   * @param {string} workTaskId  work或者task的id
   * @param {?bool} isWork 是否是work,还是task
   * @return {array} 返回创建的userWork或者userTask 列表
   */
  async addUserWorkTaskWithInChargeAndAttendArray(
    usersInCharge,
    usersAttend,
    workTaskId,
    isWork = true
  ) {
    const usersArrayInWorkTask = usersInCharge.map((user, index) => ({
      userId: user.id,
      [isWork ? 'workId' : 'taskId']: workTaskId,
      isInCharge: true,
      order: index + 1,
    }));
    if (usersAttend && usersAttend.length > 0) {
      usersAttend.forEach((user, index) => {
        usersArrayInWorkTask.push({
          userId: user.id,
          [isWork ? 'workId' : 'taskId']: workTaskId,
          isInCharge: false,
          order: index + 1,
        });
      });
    }
    return await (isWork
      ? this.ctx.model.UserWork
      : this.ctx.model.UserTask
    ).bulkCreate(usersArrayInWorkTask);
  }

  async dealPhases(phases, workId) {
    if (phases && phases.length > 0) {
      const addList = [];
      const deleteList = [];
      phases.forEach(phase => {
        if (phase.type === 'add') addList.push(phase);
        if (phase.type === 'delete' && phase.id) deleteList.push(phase.id);
      });
      if (addList.length > 0) {
        await this.ctx.model.Phase.bulkCreate(
          addList.map(phase => Object.assign(phase, { workId }))
        );
      }
      if (deleteList.length > 0) {
        await this.ctx.model.Phase.destroy({
          where: {
            id: {
              [this.ctx.model.Op.in]: deleteList,
            },
          },
        });
      }
    }
  }

  getWorkIncludeModelSync({
    withDept = false,
    // withUsers 和 withUsersInCharge withUsersAttend 没必要重复
    // withUsers 包括了 withUsersInCharge withUsersAttend
    withUsers = false,
    withUsersInCharge = false,
    withUsersAttend = false,
    withPublisher = false,
    withChannels = false,
    withTag = false,
    withPhases = false,
    withAttachments,
  }) {
    const ctx = this.ctx;
    const include = [];
    if (withDept) {
      include.push({
        model: ctx.model.Dept,
        as: 'dept',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withUsers) {
      include.push({
        model: ctx.model.User,
        as: 'users',
        through: {
          attributes: [ 'isInCharge' ],
        },
        attributes: [ 'id', 'name', 'deptId' ],
      });
    } else {
      if (withUsersInCharge) {
        include.push({
          model: ctx.model.User,
          as: 'usersInCharge',
          through: {
            attributes: [],
          },
          attributes: [ 'id', 'name', 'deptId' ],
        });
      }
      if (withUsersAttend) {
        include.push({
          model: ctx.model.User,
          as: 'usersAttend',
          through: {
            attributes: [],
          },
          attributes: [ 'id', 'name', 'deptId' ],
        });
      }
    }
    if (withPublisher) {
      include.push({
        model: ctx.model.User,
        as: 'publisher',
        attributes: [ 'id', 'name', 'deptId' ],
      });
    }
    if (withChannels) {
      include.push({
        model: ctx.model.WorkChannel,
        as: 'channels',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withTag) {
      include.push({
        model: ctx.model.Tag,
        as: 'tag',
      });
    }
    if (withPhases) {
      include.push({
        model: ctx.model.Phase,
        as: 'phases',
      });
    }
    if (withAttachments) {
      include.push({
        model: ctx.model.Attachment,
        as: 'attachments',
      });
    }
    return include;
  }

  getTaskIncludeModelSync({
    withWork = false,
    // withUsers 和 withUsersInCharge withUsersAttend 没必要重复
    // withUsers 包括了 withUsersInCharge withUsersAttend
    withUsers = false,
    withUsersInCharge = false,
    withUsersAttend = false,
    withPublisher = false,
    withAttachments,
  }) {
    const ctx = this.ctx;
    const include = [];
    if (withWork) {
      include.push({
        model: ctx.model.Work,
        as: 'work',
        attributes: [ 'id', 'title', 'deptId' ],
      });
    }
    if (withUsers) {
      include.push({
        model: ctx.model.User,
        as: 'users',
        through: {
          attributes: [ 'isInCharge' ],
        },
        attributes: [ 'id', 'name', 'deptId' ],
      });
    } else {
      if (withUsersInCharge) {
        include.push({
          model: ctx.model.User,
          as: 'usersInCharge',
          through: {
            attributes: [],
          },
          attributes: [ 'id', 'name', 'deptId' ],
        });
      }
      if (withUsersAttend) {
        include.push({
          model: ctx.model.User,
          as: 'usersAttend',
          through: {
            attributes: [],
          },
          attributes: [ 'id', 'name', 'deptId' ],
        });
      }
    }
    if (withPublisher) {
      include.push({
        model: ctx.model.User,
        as: 'publisher',
        attributes: [ 'id', 'name', 'deptId' ],
      });
    }
    if (withAttachments) {
      include.push({
        model: ctx.model.Attachment,
        as: 'attachments',
      });
    }
    return include;
  }

  getWorkArticleIncludeSync({
    withPublisher,
    withChannel,
    withWork,
    withDept,
    withAttachments,
  }) {
    const ctx = this.ctx;
    const include = [];
    if (withPublisher) {
      include.push({
        model: ctx.model.User,
        as: 'publisher',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withAttachments) {
      include.push({
        model: ctx.model.Attachment,
        as: 'attachments',
      });
    }
    if (withChannel) {
      include.push({
        model: ctx.model.WorkChannel,
        as: 'channel',
        include: withWork
          ? [
            {
              model: ctx.model.Work,
              as: 'work',
              attributes: [ 'id', 'title', 'deptId' ],
              include: withDept
                ? [
                  {
                    model: ctx.model.Dept,
                    as: 'dept',
                    attributes: [ 'id', 'name' ],
                  },
                ]
                : [],
            },
          ]
          : [],
      });
    }
    return include;
  }

  getWorkTasksIncludeSync({ withPublisher, withUsers, withWork, withDept }) {
    const ctx = this.ctx;
    const include = [];
    if (withPublisher) {
      include.push({
        model: ctx.model.User,
        as: 'publisher',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withUsers) {
      include.push({
        model: ctx.model.User,
        as: 'users',
        through: {
          attributes: [ 'isInCharge' ],
        },
        attributes: [ 'id', 'name', 'deptId' ],
      });
    }
    if (withWork) {
      include.push({
        model: ctx.model.Work,
        as: 'work',
        attributes: [ 'id', 'title' ],
        include: withDept
          ? [
            {
              model: ctx.model.Dept,
              as: 'dept',
              attributes: [ 'id', 'name' ],
            },
          ]
          : [],
      });
    }
    return include;
  }

  getWorkTaskOrderSync(order) {
    let _order;
    if (order) {
      _order = [];
      if (order.createTime) {
        _order.push([ 'createTime', order.createTime ]);
      }
      if (order.updateTime) {
        _order.push([ 'updateTime', order.updateTime ]);
      }
      if (order.from) {
        _order.push([ 'from', order.from ]);
      }
      if (order.to) {
        _order.push([ 'to', order.to ]);
      }
    }
    return _order;
  }

  getWorkOrderSync(order) {
    const ctx = this.ctx;
    let _order;
    if (order) {
      _order = [];
      if (order.phase) {
        _order.push([
          {
            model: ctx.model.Phase,
            as: 'phases',
          },
          'from',
          order.phase,
        ]);
      }
      if (order.user) {
        _order.push([
          {
            model: ctx.model.User,
            as: 'users',
          },
          ctx.model.UserWork,
          'order',
          order.user,
        ]);
      } else {
        if (order.usersInCharge) {
          _order.push([
            {
              model: ctx.model.User,
              as: 'usersInCharge',
            },
            ctx.model.UserWork,
            'order',
            order.usersInCharge,
          ]);
        }
        if (order.usersAttend) {
          _order.push([
            {
              model: ctx.model.User,
              as: 'usersAttend',
            },
            ctx.model.UserWork,
            'order',
            order.usersAttend,
          ]);
        }
      }
    }
    return _order;
  }

  getTaskOrderSync(order) {
    const ctx = this.ctx;
    let _order;
    if (order) {
      _order = [];
      if (order.user) {
        _order.push([
          {
            model: ctx.model.User,
            as: 'users',
          },
          ctx.model.UserTask,
          'order',
          order.user,
        ]);
      } else {
        if (order.usersInCharge) {
          _order.push([
            {
              model: ctx.model.User,
              as: 'usersInCharge',
            },
            ctx.model.UserTask,
            'order',
            order.usersInCharge,
          ]);
        }
        if (order.usersAttend) {
          _order.push([
            {
              model: ctx.model.User,
              as: 'usersAttend',
            },
            ctx.model.UserTask,
            'order',
            order.usersAttend,
          ]);
        }
      }
    }
    return _order;
  }

  getWorkArticleOrderSync(order) {
    // const ctx = this.ctx;
    let _order;
    if (order) {
      _order = [];
      if (order.createTime) {
        _order.push([ 'createTime', order.createTime ]);
      }
      if (order.updateTime) {
        _order.push([ 'updateTime', order.updateTime ]);
      }
    }
    return _order;
  }

  /**
   * 处理提交的附件信息 移动/删除文件 提交数据库等
   * todo 需要测试
   * @param {Array} attachments [{path,name,ext,type,id?}...]
   * @param {String} relativeId attachment 关联的work task article 讨论等的id
   */
  async dealAttachments(attachments, relativeId) {
    const ctx = this.ctx;
    const toDeal = { add: [], delete: { ids: [], paths: [] } };
    const uploadRoot = ctx.app.config.uploadRoot;
    // attach = {path,name,ext,type,id?}
    // type为add，为新增，type为空表示编辑页面没有动的附件,
    // type为delete且id不为空表示需要删除的附件，
    // type为delete且id为空表示前台添加后又取消的附件， 无需处理，tmp定期清除
    attachments.forEach(attach => {
      if (attach.type === 'add') toDeal.add.push(attach);
      if (attach.type === 'delete' && attach.id) {
        toDeal.delete.ids.push(attach.id);
        toDeal.delete.paths.push(attach.path);
      }
    });
    if (toDeal.add.length > 0) {
      const now = new Date();
      const [ year, month, day ] = format(now, 'yyyy-MM-dd').split('-');
      const relativeDirectory = path.join(
        'attachment',
        `${year}`,
        `${month}`,
        `${day}`
      );
      const dir = path.join(uploadRoot, relativeDirectory);
      if (!shell.test('-e', dir)) shell.mkdir('-p', dir);
      toDeal.add.forEach(file => {
        // 避免用户输入非法字符
        file.name = filenamify(file.name) || path.basename(file.path);
        const basename = path.basename(file.path);
        const realPath = path.join(dir, basename);
        const relativePath = path.join(relativeDirectory, basename); // a/b/c/d.rar
        shell.mv(file.path, realPath);
        file.path = relativePath;
        file.relativeId = relativeId;
      });
      await ctx.model.Attachment.bulkCreate(toDeal.add);
    }
    if (toDeal.delete.ids.length > 0) {
      await ctx.model.Attachment.destroy({
        where: {
          id: {
            [ctx.model.Op.in]: toDeal.delete.ids,
          },
        },
      });
      // 删除本地的文件 toDeal.delete.paths 此处存储的是相对url信息
      shell.rm(toDeal.delete.paths.map(_path => path.join(uploadRoot, _path)));
    }
  }

  async delTasks(ids) {
    const ctx = this.ctx;
    await ctx.model.UserTask.destroy({
      where: { taskId: { [ctx.model.Op.in]: ids } },
    });
    await this.delAttachments(ids);
    const number = await ctx.model.Task.destroy({
      where: { id: { [ctx.model.Op.in]: ids } },
    });
    return number;
  }

  async delArticles(ids, type = 'work') {
    const ctx = this.ctx;
    await this.delAttachments(ids);
    const Model =
      type === 'work'
        ? ctx.model.WorkArticle
        : type === 'dept'
          ? ctx.model.DeptArticle
          : ctx.throw('删除Article时类型只能是work或者dept');
    const number = await Model.destroy({
      where: { id: { [ctx.model.Op.in]: ids } },
    });
    return number;
  }

  async delChannels(ids, type = 'work') {
    const ctx = this.ctx;
    const Model =
      type === 'work'
        ? ctx.model.WorkChannel
        : type === 'dept'
          ? ctx.model.DeptChannel
          : ctx.throw('删除channel时类型只能是work或者dept');
    const number = await Model.destroy({
      where: { id: { [ctx.model.Op.in]: ids } },
    });
    return number;
  }

  async delAttachments(relativeIds) {
    const ctx = this.ctx;
    const number = await ctx.model.Attachment.destroy({
      where: { relativeId: { [ctx.model.Op.in]: relativeIds } },
    });
    return number;
  }
}

module.exports = WorkService;
