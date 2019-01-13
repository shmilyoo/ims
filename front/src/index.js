import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CountDownRedirect from './containers/CountDownRedirect';
import history from './history';
import { Provider } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import configureStore from './store';
import 'typeface-roboto';
import './index.css';
// import './assets/css/quillFont.css';
import 'nprogress/nprogress.css';
import configureAxios from './axios';
import * as serviceWorker from './serviceWorker';
import AuthOk from './containers/account/AuthOk';
import Login from './containers/account/Login';
import Reg from './containers/account/Reg';
import Bind from './containers/account/Bind';
import theme from './services/theme';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import Message from './containers/Message';

const store = configureStore();
configureAxios(store.dispatch, history);
// initAuthInfoAtStart(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/reg" component={Reg} />
          <Route exact path="/bind" component={Bind} />
          <Route exact path="/auth/ok" component={AuthOk} />
          <Route exact path="/redirect" component={CountDownRedirect} />
          <Route path="/" component={App} />
        </Switch>
        <Message />
      </MuiThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
