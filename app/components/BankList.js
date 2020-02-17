import React, { Component } from 'react';
import plaid from 'plaid';
import PlaidLink from 'react-plaid-link';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import routes from '../constants/routes.json';
import { CLIENT_ID, SECRET, PUBLIC_KEY } from '../Secret'
import {round} from 'lodash/round'
import BankDetail from './BankDetail'
// TODO: Change these to your credentials

const KEY_ITEMS = 'items';


const getItems = () => {
  //clear local storage
   //localStorage.clear();
  let items = JSON.parse(localStorage.getItem(KEY_ITEMS));
  if (!items) {
    items = {
      byId: {},
      allIds: [],
    };
    setItems(items);
  }

  return items;
};

const setItems = items => {
  console.log('JSON.stringify(items)==>', JSON.stringify(items));
  localStorage.setItem(KEY_ITEMS, JSON.stringify(items));
};

const addItem = item => {
  const oldItems = getItems();
  if (oldItems.byId[item.id]) {
    return;
  }

  const items = {
    byId: {
      ...oldItems.byId,
      [item.id]: item,
    },
    allIds: [...oldItems.allIds, item.id],
  };

  setItems(items);
};

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: getItems(),
      balance: 0,
      loading: false,
      error: null,
      itemsWithTotalBalance: {},
      itemsWithAccounts: {},
      selectedBank: {}
    };

    this.client = new plaid.Client(
      CLIENT_ID,
      SECRET,
      PUBLIC_KEY,
      plaid.environments.sandbox
    );
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {

    const items = getItems();
    const allBankIds = items.allIds;
    console.error('inside componentWillMount: ', allBankIds)
    if(allBankIds.length > 0) {
      console.error('inside the if because the length is: ', allBankIds.length)
      console.error('items are: ', items)
      console.error('items[allBankIds[0]]: ', items.byId[allBankIds[0]])
      for(let i =0; i < allBankIds.length; i++){
        if(items.byId[allBankIds[i]]){
          console.error('calling fetchBalance with: ', items.byId[allBankIds[i]])
          this.fetchBalance(items.byId[allBankIds[i]]);
        }
      }
    }

  }

  onBankClick(bank) {
    this.setState({
      selectedBank: bank
    })
  }

  fetchBalance(item) {
    // const items = getItems();
    console.error('inside fetchBalance: ', item)

      // const item = items.byId[items.allIds[0]];
      const { accessToken } = item;
      // eslint-disable-next-line react/no-access-state-in-setstate
      this.setState({ ...this.state, loading: true });
      this.client
        .getBalance(accessToken, {})
        .then(res => {
          const balance = res.accounts.reduce((val, acct) => {
            console.error('balance of the account: ', acct)
            return val + acct.balances.current;
          }, 0);
          const itemWithBalance = Object.assign({}, item, {balance})
          const detailedItems = Object.assign({}, this.state.itemsWithAccounts, {[item.id]: res.accounts})
          const itemsWithTotalBalance = Object.assign({}, this.state.itemsWithTotalBalance, {[item.id]: balance})
          this.setState({
            itemsWithAccounts: detailedItems,
            itemsWithTotalBalance
          })
          // eslint-disable-next-line react/no-access-state-in-setstate
          this.setState({ ...this.state, balance, loading: false });
          return balance;
        })
        .catch(() => {
          this.setState({
            // eslint-disable-next-line react/no-access-state-in-setstate
            ...this.state,
            loading: false,
            error: 'Unable to get balance.'
          });
        });
  }

  onItemLinked(publicToken, metadata) {
    const { institution_id: id, name } = metadata.institution;

    this.client
      .exchangePublicToken(publicToken)
      .then(res => {
        const { access_token: accessToken } = res;
        addItem({
          id,
          name,
          publicToken,
          accessToken,
        });

        const items = getItems();
    const allBankIds = items.allIds;
    console.error('allBankIds inside onItemLinked: ', allBankIds)
    if(allBankIds.length > 0) {
      console.error('inside the if because the length is: ', allBankIds.length)
      console.error('items are: ', items)
      console.error('items[allBankIds[0]]: ', items.byId[allBankIds[0]])
      for(let i =0; i < allBankIds.length; i++){
        if(items.byId[allBankIds[i]]){
          console.error('calling fetchBalance with: ', items.byId[allBankIds[i]])
          this.fetchBalance(items.byId[allBankIds[i]]);
        }
      }
    }

        // return this.fetchBalance();
      })
      .catch(() => {
        this.setState({
          // eslint-disable-next-line react/no-access-state-in-setstate
          ...this.state,
          error: 'Unable to authenticate with service',
        });
      });
  }


  render() {
    console.error('state in render is: ', this.state)
    const { balance, loading, error } = this.state;
    const items = getItems();

    let value;
    // eslint-disable-next-line no-unused-vars
    let bankObjects;
    if (loading) {
      value = 'Loading...';
    } else {
      value = `$${balance}`;
    }

    return this.state.selectedBank.name ? <BankDetail {...this.state.selectedBank} /> : (
      <div>
        <div className={styles.container} data-tid="container">
          {!error && (
            <div>
              <h1>Total Balance</h1>
              <h2>{value}</h2>
            </div>
          )}
          {error && <h3>{error}</h3>}
          {<h3>{items.allIds.length}</h3>}
          {<h3>{items.allIds[0]}</h3>}
          {<h3>{items.allIds[1]}</h3>}
          {<table>
              <tr>
                <th>#</th>
                <th>Bank Name</th>
                <th>Balance</th>
              </tr>
              {items.allIds.length > 0 && items.allIds.map((bank_id, idx) => {
                return (
                  <tr>
                    <td>{idx+1}</td>
                    <td onClick={() => this.onBankClick({name: items.byId[bank_id].name, accounts: this.state.itemsWithAccounts[bank_id]})}>{items.byId[bank_id].name}</td>
                    <td>{this.state.itemsWithTotalBalance[bank_id]}</td>
                  </tr>
                )
        })
         }</table>}
          {items.allIds.length < 1000 && (
            <div>
              <h3>Link to your bank to view your account balance.</h3>
              <PlaidLink
                publicKey={PUBLIC_KEY}
                // product="auth"
                product={['auth', 'transactions']}
                env="sandbox"
                apiVersion={'v2'}
                clientName="All in 1 FinApp"
                onSuccess={this.onItemLinked.bind(this)}
              >
              Add Financial Institution
              </PlaidLink>
            </div>
          )}
        </div>
        <div>
        <ul>
        {
        // bankObjects = items.byId
        items.allIds.map((bank_id, idx) => {
          <li >{bank_id}</li>
          // <li >{items.byId.bank_id}</li>
        })
        }
      </ul>
        </div>
      </div>
    );
  }
}
