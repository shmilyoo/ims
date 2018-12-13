export const types = {
  SAGA_SET_DEPT_MANAGER: 'DEPT/SAGA_SET_DEPT_MANAGER'
};
export const actions = {
  sagaSetDeptManager: (resolve, id, managers) => ({
    type: types.SAGA_SET_DEPT_MANAGER,
    resolve,
    id,
    managers
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
