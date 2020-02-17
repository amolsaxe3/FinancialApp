// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { HashHistory } from 'history';
import counter from './counter';
import bankList from './banklist';

const setItems = items => {
  localStorage.setItem('items', JSON.stringify(items));
};

export default function createRootReducer(history: HashHistory) {
  // console.log('bankList.items: ', bankList.items)
  // setItems(bankList.items)
  // console.error('local storage is: ', localStorage.getItem('items'))
  return combineReducers<{}, *>({
    router: connectRouter(history),
    bankList
  });
}
