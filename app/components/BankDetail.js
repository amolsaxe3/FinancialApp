import React, { Component } from 'react';
import styles from './BankList.css';

const BankDetail = props => {
  console.error('props in BankDetail: ', props)
  return <div>
    <button className={styles.backButton} onClick={props.onClickBackButton}>Back to the list of banks</button>
    <div className={styles.container}>
    <h1>{props.name}</h1>
    <div className={styles.bankList}>
    <table className={styles.tableBorder}>
      <tr className={styles.headerRow}>
        <th>Account Name</th>
        <th>Balance</th>
      </tr>
    {props.accounts.map(account => {
      return <tr>
            <td>{account.official_name}</td>
            <td>{account.balances.current}</td>
          </tr>
    })}
    </table>
    </div>
    </div>
  </div>
}

export default BankDetail
