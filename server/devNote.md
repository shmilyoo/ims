# redis 缓存格式

## 针对每个登录用户的缓存

用户如果点击记住我，则保存一个星期，否则一个小时  
redis key 为 ims-user-${user.id}，value 为一个 Object json.stringfy 后的字符串  
Object 格式为：

```javascript
{
}
```

## 全局缓存

- 不设置过期时间，eggjs 后台定期更新

> 部门结构缓存
>
> > 树形结构缓存  
> > array 结构缓存

# set cookies 格式

> ims_id : 用户 id，和 sso 系统用户 id 保持一致
> auth_type: sso || local 用户认证方式，统一授权或者本地登录
