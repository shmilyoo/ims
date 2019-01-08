export const types = {
  SAGA_ADD_WORK: 'WORK/SAGA_ADD_WORK',
  SAGA_UPDATE_WORK_BASIC: 'WORK/SAGA_UPDATE_WORK_BASIC',
  SAGA_ADD_TASK: 'WORK/SAGA_ADD_TASK',
  SAGA_ADD_ARTICLE: 'WORK/SAGA_ADD_ARTICLE'
};
export const actions = {
  sagaAddWork: (resolve, values) => ({
    type: types.SAGA_ADD_WORK,
    resolve,
    values
  }),
  sagaAddTask: (resolve, values, deptId, workId) => ({
    type: types.SAGA_ADD_TASK,
    resolve,
    values,
    deptId,
    workId
  }),
  sagaAddArticle: (resolve, values, workId) => ({
    type: types.SAGA_ADD_ARTICLE,
    resolve,
    values,
    workId
  })
};

const initState = {};

export default (state = initState, action) => {
  switch (action.type) {
    // case types.SET_TAGS:
    //   return {
    //     ...state,
    //     tags: action.tags
    //   };
    default:
      return state;
  }
};
