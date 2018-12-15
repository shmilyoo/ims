# todo

把 cas 的 dept 表定时复制过来，json 格式存缓存，每次同步复制和 json 格式对比，不相同则更新；
本地建立 dept 表，有利于层次管理， deptrelation 不需要了， work 直接设置 deptId，
部门取其 work 的时候，可以直接检索包含所有下级目录的 work，（因为有 dept 表）
----done------
UserPicker 组件完善，后台 deptUsers controller 完善
----done------
开始做 发布工作

## front 前台系统

前台系统，也就没有 workDept 的概念了，用户可以修改自己的 dept，表示实际工作地变化

# redis 缓存格式

## 针对每个登录用户的 session

用户如果点击记住我，则保存一个星期，否则一个小时  
redis key 为 ims:user:${user.id}，value 为一个 Object json.stringfy 后的字符串  
因为 session 有过期设置，所以采用 json 格式转换为字符串后存储，同时设置过期时间  
Object 格式为：

```javascript
{
  authType: sso || local,
  active: 0 || 1 || 2,
}
```

## ims:cache ———— 针对 ims 系统的全局缓存，hash 格式，无过期时间

```javascript
{
  // deptArray 和 deptTree 在后台定时更新,deptTree可以由前台自己计算
  deptArray:[{id:string,name:string,...},...], // 部门结构列表，按照level order 排序
  deptDic:{id1:dept1,id2:dept2,...},
  // deptTree:[{id:string,name:'root1',children:[...],...},{id:'',name:'root2',...}]
}
```

# set cookies 格式

> ims_id : 用户 id，和 sso 系统用户 id 保持一致; httpOnly
> auth_type: sso || local 用户认证方式，统一授权或者本地登录; not httpOnly,前端需要判断是否有 cookie
