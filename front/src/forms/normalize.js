// 表单的一些标准化格式化功能函数

export const trim = value => {
  return value && value.trim();
};

export const toLowerCase = value => {
  return value && value.toLowerCase();
};

export const toUpperCase = value => {
  return value && value.toUpperCase();
};
