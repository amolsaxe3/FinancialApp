import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import BankList from './components/BankList';
import BankDetail from './components/BankDetail';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.BANKLIST} component={BankList} />
      <Route path={routes.BANKDETAIL} component={BankDetail} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
