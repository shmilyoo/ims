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
export const userStatusDic = {
  ONDUTY: 'onDuty',
  ONHOLIDAY: 'onHoliday',
  ONTRIP: 'onTrip',
  ONSEA: 'onSea',
  ONEXCHANGE: 'onExchange',
  OTHER: 'other'
};
export const userStatus = [
  { label: '在位', value: userStatusDic.ONDUTY },
  { label: '休假', value: userStatusDic.ONHOLIDAY },
  { label: '出差', value: userStatusDic.ONTRIP },
  { label: '出海', value: userStatusDic.ONSEA },
  { label: '代职', value: userStatusDic.ONEXCHANGE },
  { label: '其他', value: userStatusDic.OTHER }
];
export const numberPerPage = 20; // 列表页默认每页显示多少项

export const pathTitle = {
  '/work/mine': '我的工作',
  '/work/schedule': '我的日程',
  '/work/schedule/manage': '日程管理',
  '/work/info': '查看工作',
  '/work/edit': '编辑大项工作',
  '/work/article/add': '添加工作文章',
  '/work/article/edit': '编辑工作文章',
  '/work/task/add': '添加工作的任务',
  '/work/task/edit': '编辑工作的任务',
  '/work/task/info': '查看任务',
  '/work/task/add/success': '添加任务成功',
  '/dept/mine': '我的部门',
  '/dept/work': '部门工作',
  '/dept/info': '查看部门情况',
  '/dept-manage/announcement': '部门公告',
  '/dept-manage/work': '部门工作',
  '/dept-manage/work/add': '发布工作',
  '/dept-manage/work/add/success': '发布工作成功',
  '/dept-manage/news': '部门文章',
  '/dept-manage/news/add': '发布文章',
  '/dept-manage/news/category': '文章分类',
  '/dept-manage/news/edit': '编辑文章',
  '/user/info': '我的资料',
  '/user/changePasswd': '修改密码',
  '/about': '关于',
  '/sa/system': '系统设置',
  '/sa/admin': '权限管理',
  '/sa/deptRelation': '部门关系',
  '/sa/deptAdmin': '部门设置'
};

// 没有children就有path属性，反之则有state属性表明类别
export const leftMenu = [
  {
    title: '我的页面',
    path: '/brief',
    icon: AccountBox
  },
  {
    title: '工作日程',
    state: 'work', // 用于有子元素的菜单，在this.state中标记下拉是否展开
    icon: AccountBox,
    children: [
      { title: pathTitle['/work/mine'], path: '/work/mine' },
      { title: pathTitle['/work/schedule'], path: '/work/schedule' },
      { title: pathTitle['/work/info'], path: '/work/info' },
      {
        title: pathTitle['/work/schedule/manage'],
        path: '/work/schedule/manage'
      }
      // { title: pathTitle['/work/info'], path: '/work/info' }
    ]
  },
  {
    title: '部门信息',
    state: 'dept', // 用于有子元素的菜单，在this.state中标记下拉是否展开
    icon: AccountBox,
    children: [
      { title: pathTitle['/dept/mine'], path: '/dept/mine' },
      { title: pathTitle['/dept/work'], path: '/dept/work' }
    ]
  },
  {
    title: '部门管理',
    state: 'dept-manage', // 用于有子元素的菜单，在this.state中标记下拉是否展开
    icon: AccountBox,
    manageDept: true,
    children: [
      {
        title: pathTitle['/dept-manage/announcement'],
        path: '/dept-manage/announcement'
      },
      { title: pathTitle['/dept-manage/work'], path: '/dept-manage/work' },
      {
        title: pathTitle['/dept-manage/work/add'],
        path: '/dept-manage/work/add'
      },
      { title: pathTitle['/dept-manage/news'], path: '/dept-manage/news' },
      {
        title: pathTitle['/dept-manage/news/category'],
        path: '/dept-manage/news/category'
      },
      {
        title: pathTitle['/dept-manage/news/add'],
        path: '/dept-manage/news/add'
      }
    ]
  },
  {
    title: '用户设置',
    state: 'user',
    icon: AccountBox,
    children: [
      { title: pathTitle['/user/info'], path: '/user/info' },
      {
        title: pathTitle['/user/changePasswd'],
        path: '/user/changePasswd'
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
      { title: pathTitle['/sa/deptAdmin'], path: '/sa/deptAdmin' },
      { title: pathTitle['/sa/admin'], path: '/sa/admin' }
    ]
  },
  { title: '关于', path: '/about', icon: AccountBox }
];

export default config;
