import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Navbar extends Component {
  render() {
    return (
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 32px',
        backgroundColor: '#2563eb',
        color: 'white',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>BasicStore</Link>
        </h1>
      </nav>
    );
  }
}
