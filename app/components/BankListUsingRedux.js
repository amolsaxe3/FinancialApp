import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PlaidLink from 'react-plaid-link';
import {fetchAllBanks, setBanks, onItemLinked} from '../actions/banklist';
import styles from './BankList.css';
import { CLIENT_ID, SECRET, PUBLIC_KEY } from '../Secret'

const BankList = props => {
  const items = props.banks
  return <div>
  <div className={styles.container} data-tid="container">
    { items.allIds.length > 0 &&
      <table>
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
          onSuccess={props.onAddNewBank}
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
}

const mapState = state => {
  // console.error('state in BankList mapState is: ', state)
  return {
    banks: state.bankList.items
}
}

const mapDispatch = (dispatch, props) => ({
  onLoadSetAllBanks: () => {
    dispatch(fetchAllBanks())
  },
  onAddNewBank: (publicToken, metadata) => {
    dispatch(onItemLinked(publicToken, metadata))
  }
})

export default connect(mapState, mapDispatch)(BankList)
