import accountReducer from './account';
import commonReducer from './common';
import systemReducer from './system';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  account: accountReducer,
  common: commonReducer,
  form: formReducer,
  system: systemReducer
});

export default rootReducer;
