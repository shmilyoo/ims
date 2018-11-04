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
  '/account/info': '资料',
  '/account/changePasswd': '修改密码',
  '/account/changePasswd2': '修改密码2',
  '/account/changePasswd3': '修改密码3',
  '/about': '关于',
  '/admin/organ/dept': '部门管理',
  '/admin/organ/person': '人员管理',
  '/admin/interface/api': '接口注册',
  '/admin/interface/sso': 'sso管理',
  '/admin/super/addAdmin': '添加管理',
  '/admin/super/admins': '管理列表',
  '/admin/about': '关于'
};

// 没有children就有path属性，反之则有state属性表明类别
export const leftMenu = [
  {
    title: '概况',
    state: 'brief', // 用于有子元素的菜单，在this.state中标记下拉是否展开
    icon: AccountBox,
    children: [
      { title: pathTitle['/brief/mine'], path: '/brief/mine' },
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
  { title: '关于', path: '/about', icon: AccountBox }
];

export default config;
