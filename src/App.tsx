import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';

export default class App extends Component {
  render() {
    return (
      <CartProvider>
        <Router>
          <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', position: 'relative', paddingBottom: '300px', backgroundColor: '#eaeded' }}>
            <Navbar />
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/product/:id" component={ProductDetailPage} />
              <Route path="/cart" component={CartPage} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    );
  }
}
