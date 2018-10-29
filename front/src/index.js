import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import history from './history';
import { Provider } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import configureStore from './store';
import 'typeface-roboto';
import './index.css';
import 'nprogress/nprogress.css';
import configureAxios from './axios';
// import { initAuthInfoAtStart } from './services/utility';
import * as serviceWorker from './serviceWorker';
import AuthOk from './containers/account/AuthOk';

const store = configureStore();
configureAxios(store.dispatch, history);
// initAuthInfoAtStart(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/auth/ok" component={AuthOk} />
        <Route path="/" component={App} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
