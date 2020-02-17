// @flow
import type { GetState, Dispatch } from '../reducers/types';
import plaid from 'plaid';
import PlaidLink from 'react-plaid-link';
import { CLIENT_ID, SECRET, PUBLIC_KEY } from '../Secret';

export const SET_BANKS = 'SET_BANKS';
export const ADD_BANK = 'ADD_BANK';
export const UPDATE_BALANCES = 'UPDATE_BALANCES';
export const FETCH_ALL_BANKS = 'FETCH_ALL_BANKS';

const client = new plaid.Client(
  CLIENT_ID,
  SECRET,
  PUBLIC_KEY,
  plaid.environments.development
);

export function fetchAllBanks() {
  return {
    type: FETCH_ALL_BANKS
  };
}

export function setBanks(banks) {
  return {
    type: SET_BANKS,
    banks
  };
}

export function addBank(bank) {
  return {
    type: ADD_BANK,
    bank
  };
}

export function updateAccountBalances(accounts) {
  return {
    type: UPDATE_BALANCES,
    accounts
  };
}

export function fetchBalance() {
    client.getBalance(accessToken, {})
        .then(res => {
          dispatch(updateBalance(res.accounts))
        })
        .catch(() => {
          console.log('unable to fetch balance')
        });
  }

  export function onItemLinked(publicToken, metadata) {
    const { institution_id: id, name } = metadata.institution;

    client
      .exchangePublicToken(publicToken)
      .then(res => {
        const { access_token: accessToken } = res;
        dispatch(addBank({
          id,
          name,
          publicToken,
          accessToken,
        }))
        dispatch(fetchBalance());
      })
      .catch(() => {
        console.error('error connecting to Plaid service :(')
      });
  }

// export function fetchBankList() {
//   return (dispatch: Dispatch) => {
//     setTimeout(() => {
//       dispatch(increment());
//     }, delay);
//   };
// }
