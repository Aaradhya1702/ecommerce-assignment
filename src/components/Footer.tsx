import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cartStore } from '../mobx/CartStore';

class FooterComponent extends Component {
  render() {
    return (
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#333',
        color: 'white',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <span style={{ fontSize: '18px' }}>Total Items: {cartStore.totalCount}</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Price: ${cartStore.totalPrice.toFixed(2)}</span>
      </footer>
    );
  }
}

export const Footer = observer(FooterComponent);
