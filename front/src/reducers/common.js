export const types = {
  SHOW_MESSAGE: 'COMMON/SHOW_MESSAGE',
  CLOSE_MESSAGE: 'COMMON/CLOSE_MESSAGE'
};
export const actions = {
  /**
   * 在右下角显示提示消息
   */
  showMessage: (message, messageType) => ({
    type: types.SHOW_MESSAGE,
    message,
    messageType: ['info', 'warn', 'error'].includes(messageType)
      ? messageType
      : 'info'
  }),
  closeMessage: () => ({
    type: types.CLOSE_MESSAGE
  })
};

const initState = {
  showMessage: false,
  message: '',
  messageColor: 'info'
};

export default (state = initState, action) => {
  switch (action.type) {
    case types.SHOW_MESSAGE:
      return {
        ...state,
        showMessage: true,
        message: action.message,
        messageType: action.messageType
      };
    case types.CLOSE_MESSAGE:
      return {
        ...state,
        showMessage: false,
        message: ''
      };
    default:
      return state;
  }
};
