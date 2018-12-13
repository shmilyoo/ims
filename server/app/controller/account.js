'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');

class AccountController extends Controller {
  async reg() {
    const { ctx, config } = this;
    const { username, password, casUsername } = ctx.request.body;
    const reqConfig = await ctx.service.auth.addSsoTokenToConfig();
    const res = await axios.post(
      config.ssoUserBind,
      {
        sysName: config.sysName,
        casUsername, // 需要绑定的cas用户名
        username, // 第三方系统的用户名
      },
      reqConfig
    );
    if (res.success) {
      const passwordCrypto = this.service.common.getCryptoPasswdSync(
        password,
        username
      );
      try {
        const id = res.data.id;
        const user = await ctx.model.User.findOne({ where: { id } });
        if (user) {
          // 用户使用授权登录方式使用过系统，数据库存在指定id用户，更新用户名密码即可、
          if (user.username || user.password) {
            throw '用户注册服务端处理时，这里的用户名密码应该都为空';
          }
          await ctx.model.User.update(
            {
              username,
              password: passwordCrypto,
            },
            { where: { id } }
          );
        } else {
          await ctx.model.User.create({
            username,
            password: passwordCrypto,
            name: res.data.name,
            deptId: res.data.deptId,
            id, // 创建本地用户和绑定的cas用户id一致
          });
        }
      } catch (e) {
        ctx.body = ctx.helper.getRespBody(
          false,
          `统一认证系统用户有效，但本地注册出错:${
            e.message
          }，请到统一认证系统删除绑定关系`
        );
        return;
      }
    }
    ctx.body = ctx.helper.getRespBody(
      res.success,
      res.success ? res.data : res.error
    );
  }

  async bind() {
    const { ctx, config } = this;
    const { username, password, casUsername } = ctx.request.body;
    const user = await ctx.service.account.checkUserPasswd(username, password);
    if (!user) {
      ctx.body = ctx.helper.getRespBody(false, '用户名密码不正确');
      return;
    }
    const reqConfig = await ctx.service.auth.addSsoTokenToConfig();
    const res = await axios.post(
      config.ssoUserBind,
      {
        sysName: config.sysName,
        casUsername, // 需要绑定的cas用户名
        username, // 第三方系统的用户名
      },
      reqConfig
    );
    ctx.body = ctx.helper.getRespBody(
      res.success,
      res.success ? res.data : res.error
    );
  }

  /**
   * 用户注册时后台异步验证用户名是否已经占用/是否可用
   */
  async checkUser() {
    const ctx = this.ctx;
    const username = ctx.params.username.toLowerCase();
    const user = await ctx.model.User.findOne({ where: { username } });
    ctx.body = ctx.helper.getRespBody(true, {
      isNameExist: !!user,
    });
  }

  async login() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    const { username, password, remember } = body;
    const user = await ctx.service.account.checkUserPasswd(username, password);
    if (user) {
      const res = await ctx.service.auth.checkBind(user.id, username);
      // 验证绑定失败包括用户未激活被禁用或者没有对应用户，未同意绑定等
      if (!res.success) {
        ctx.body = res;
        return;
      }
      // 登录认证通过，设置cookie，服务端session
      const authType = 'local';
      const [ expires, maxAge ] = ctx.helper.getExpiresAndMaxAge('week', 1);
      await ctx.service.account.setCache(user.id, authType, maxAge, remember);
      await ctx.service.account.setCookie(
        user.id,
        authType,
        maxAge,
        expires,
        remember
      );
      const _user = Object.assign(res.data.user, {
        isSuperAdmin: user.isSuperAdmin,
        username: user.username,
        // 用户实际工作所在部门
        deptId: user.deptId,
        id: user.id,
      });
      ctx.body = ctx.helper.getRespBody(true, {
        authType,
        user: _user,
      });
    } else {
      ctx.body = ctx.helper.getRespBody(false, '用户名或密码不正确');
    }
  }

  async logout() {
    const ctx = this.ctx;
    const { kind } = ctx.request.body;
    // kind: all || system
    if (kind === 'system') {
      // 本系统退出，删除redis的session缓存即可
      await ctx.app.redis.del(`ims:user:${ctx.user.id}`);
    } else if (kind === 'local') {
      // 什么都不做，统一清除cookie即可
    } else {
      // 全统一系统退出，发送请求,kind==='all'
      await axios.post();
    }
    ctx.helper.clearCookie();
    ctx.body = ctx.helper.getRespBody(true);
  }

  /**
   * 在用户进入系统的home页面获取用户的一些信息，包括
   * info用户资料 {name,status,position}
   * dept用户组织关系部门信息，workDept实际工作部门信息 {id,name,names}
   * 用户担任管理角色的部门id列表 [id1,id2]
   */
  async accountInfo() {
    const ctx = this.ctx;
    const id = ctx.user.id;
    const user = await ctx.model.User.findOne({
      include: [
        {
          model: ctx.model.DeptManager,
          attributes: [ 'deptId' ],
          as: 'manageDepts',
          required: false,
        },
      ],
      where: { id },
      attributes: [ 'name', 'deptId', 'status', 'position' ],
    });
    const deptDic = await ctx.service.cache.getDeptDic();
    const dept = deptDic[user.deptId];
    const deptNames = ctx.service.dept.getDeptNamesSync(user.deptId, deptDic);
    // const workDept = await ctx.service.dept.getRelationDept(dept.id, deptDic);
    const manageDepts = user.manageDepts.map(mDept => mDept.deptId);

    ctx.body = ctx.helper.getRespBody(true, {
      info: {
        name: user.name,
        status: user.status,
        position: user.position,
      },
      dept: { id: dept.id, name: dept.name, names: deptNames.join('-') },
      // workDept,
      manageDepts,
    });
  }

  async setUserInfo() {
    const ctx = this.ctx;
    const {
      values: { dept, status, position },
      id,
    } = ctx.request.body;
    if (id !== ctx.user.id) throw '提交修改资料的用户id与cookie中id不一致';
    await ctx.model.User.update(
      { deptId: dept.id, status, position },
      { where: { id } }
    );
    ctx.body = ctx.helper.getRespBody(true);
    // todotodo 返回添加了workdept，在front的saga中更新store中的workdept
  }
}

module.exports = AccountController;
