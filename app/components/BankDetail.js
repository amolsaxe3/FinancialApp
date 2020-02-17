import React, { Component } from 'react';

const BankDetail = props => {
  console.error('props in BankDetail: ', props)
  return <div>
    <button onClick={props.onClickBackButton}>Back</button>
    <h1>{props.name}</h1>
    <h3>Your bank details are: </h3>
    {props.accounts.map(account => {
      return <div>
        <label>{account.official_name}</label>
        <span>{account.balances.current}</span>
      </div>
    })}
  </div>
}

export default BankDetail
