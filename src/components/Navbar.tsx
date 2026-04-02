import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { cartStore } from '../mobx/CartStore';

class NavbarComponent extends Component {
  render() {
    return (
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 24px',
        backgroundColor: '#131921',
        color: 'white',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ flex: '1', display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '28px', fontWeight: 'bold' }}>
            Ganga
          </Link>
        </div>

        <div style={{ flex: '2', display: 'flex', margin: '0 24px' }}>
          <input 
            type="text" 
            placeholder="Search Ganga..." 
            style={{ 
              width: '100%', 
              padding: '10px 16px', 
              borderRadius: '4px', 
              border: 'none', 
              outline: 'none',
              fontSize: '16px'
            }} 
          />
        </div>

        <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
            <span style={{ fontSize: '12px', color: '#ccc' }}>Hello, Sign in</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Account & Lists</span>
          </div>

          <div 
            onClick={() => alert("Cart clicked! Navigate to cart page here.")}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px' }}
            onMouseEnter={(e) => e.currentTarget.style.border = '1px solid white'}
            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid transparent'}
          >
            <span style={{ 
              backgroundColor: '#febd69', 
              color: '#131921', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontWeight: 'bold', 
              marginRight: '8px' 
            }}>
              {cartStore.totalCount}
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cart</span>
          </div>
        </div>
      </nav>
    );
  }
}

export const Navbar = observer(NavbarComponent);
