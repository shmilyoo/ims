import AccountBox from '@material-ui/icons/AccountBox';

const config = {};

export const sysName = '办公信息管理系统';
export const system = 'ims';
export const server_base_url_product = '';
export const server_baseURL_dev = 'http://localhost:8001';
export const ssoBaseUrl = 'http://localhost:3000';
export const ssoRegUrl = 'http://localhost:3000/reg';
export const ssoAuthLoginPage = 'http://localhost:3000/auth/login';
export const ssoLoginPage = 'http://localhost:3000/login';
export const ssoCheckPage = 'http://localhost:3000/auth/check';
export const ssoAuthOk = 'http://localhost:4000/auth/ok'; // sso认证成功后，重定向到本地此页面进行cookie和缓存的操作

export const pathTitle = {
  '/': '首页',
  '/brief/mine': '我的概况',
  '/brief/department': '我的部门',
  '/brief/schedule': '我的日程',
  '/account/info': '资料',
  '/account/changePasswd': '修改密码',
  '/account/changePasswd2': '修改密码2',
  '/account/changePasswd3': '修改密码3',
  '/about': '关于',
  '/sa/system': '系统设置',
  '/sa/admin': '权限管理',
  '/sa/deptRelation': '部门关系'
};

// 没有children就有path属性，反之则有state属性表明类别
export const leftMenu = [
  {
    title: '概况',
    state: 'brief', // 用于有子元素的菜单，在this.state中标记下拉是否展开
    icon: AccountBox,
    children: [
      { title: pathTitle['/brief/mine'], path: '/brief/mine' },
      { title: pathTitle['/brief/schedule'], path: '/brief/schedule' },
      { title: pathTitle['/brief/department'], path: '/brief/department' }
    ]
  },
  {
    title: '用户',
    state: 'account',
    icon: AccountBox,
    children: [
      { title: pathTitle['/account/info'], path: '/account/info' },
      {
        title: pathTitle['/account/changePasswd'],
        path: '/account/changePasswd'
      },
      {
        title: pathTitle['/account/changePasswd2'],
        path: '/account/changePasswd2'
      },
      {
        title: pathTitle['/account/changePasswd3'],
        path: '/account/changePasswd3'
      }
    ]
  },
  {
    title: '超级管理',
    state: 'sa',
    icon: AccountBox,
    superAdmin: true,
    children: [
      { title: pathTitle['/sa/system'], path: '/sa/system' },
      { title: pathTitle['/sa/deptRelation'], path: '/sa/deptRelation' },
      { title: pathTitle['/sa/admin'], path: '/sa/admin' }
    ]
  },
  { title: '关于', path: '/about', icon: AccountBox }
];

export default config;
