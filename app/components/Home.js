// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h1>All-in-one FinApp</h1>
        <Link to={routes.BANKLIST}>Portfolio View</Link>
      </div>
    );
  }
}
