// @flow
import { SET_BANKS, ADD_BANK, UPDATE_BALANCES} from '../actions/banklist';
// import type { Action } from './types';

const initialState = {
  items: {
    byId: {},
    allIds: []
  }
}

export default function reducer(state = initialState, action) {
  console.error('state in banklist reducer: ', state)
  let newState = Object.assign({}, state)
  switch (action.type) {
    case SET_BANKS:
      newState.banks = action.banks;
      break;
    case ADD_BANK:
      newState.banks.push(action.bank);
      break;
    case UPDATE_BALANCES:
      // newState.banks = action.accounts.map((bank, index) => newState.items.byId[bank.id].balance = bank.);
      break;
    default:
      break;
  }
  return newState;
}
