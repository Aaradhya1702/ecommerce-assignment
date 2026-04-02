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
        backgroundColor: '#232f3e',
        color: '#ffffff',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', color: '#ccc' }}>Subtotal ({cartStore.totalCount} items):</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>${cartStore.totalPrice.toFixed(2)}</span>
        </div>
        <div>
          <button style={{
            backgroundColor: '#ffd814',
            color: '#0f1111',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            Proceed to checkout
          </button>
        </div>
      </footer>
    );
  }
}

export const Footer = observer(FooterComponent);

