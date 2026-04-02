import React, { Component } from 'react';

export class Footer extends Component {
  render() {
    return (
      <footer style={{
        backgroundColor: '#232f3e',
        color: '#ffffff',
        padding: '40px 24px 20px',
        width: '100%',
        marginTop: 'auto',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Get to Know Us</h4>
            <a href="/" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>About Ganga</a>
            <a href="/" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Careers</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Help & Support</h4>
            <a href="/" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Contact Us</a>
            <a href="/" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Returns center</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Policies</h4>
            <a href="/" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a>
            <a href="/" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #3a4553', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#ccc' }}>&copy; {new Date().getFullYear()} Ganga Stores, Inc. or its affiliates</p>
        </div>
      </footer>
    );
  }
}

