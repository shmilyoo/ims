export const types = {
  SAGA_ADD_WORK: 'WORK/SAGA_ADD_WORK',
  SAGA_UPDATE_WORK_BASIC: 'WORK/SAGA_UPDATE_WORK_BASIC'
};
export const actions = {
  sagaAddWork: (resolve, values) => ({
    type: types.SAGA_ADD_WORK,
    resolve,
    values
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
