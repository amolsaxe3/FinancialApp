import React, { Component } from 'react';
import plaid from 'plaid';
import PlaidLink from 'react-plaid-link';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import routes from '../constants/routes.json';
import { CLIENT_ID, SECRET, PUBLIC_KEY } from './Secret'
// TODO: Change these to your credentials

const KEY_ITEMS = 'items';


const getItems = () => {
  //clear local storage
  localStorage.clear();
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
    this.fetchBalance();
  }

  fetchBalance() {
    const items = getItems();

    if (items.allIds.length > 0) {
      const item = items.byId[items.allIds[0]];
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

        return this.fetchBalance();
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

    return (
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
                    <td><Link to={`/banks/${bank_id}`}>{items.byId[bank_id].name}</Link></td>
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
