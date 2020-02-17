const BankDetail = props => {
  return <div>
    <h1>props.name</h1>
    <h3>Your account details are: </h3>
    {props.accounts.map(account => {
      return <div>
        {account.balances.current}
      </div>
    })}
  </div>
}
