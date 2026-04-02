import React, { Component, createContext, ReactNode } from 'react';
import { Product } from '../types/product';

export interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

interface State {
  cartItems: Product[];
}

export class CartProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let initialCart: Product[] = [];
    try {
      const stored = localStorage.getItem('context_cartItems');
      if (stored) {
        initialCart = JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    this.state = {
      cartItems: initialCart,
    };
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (prevState.cartItems !== this.state.cartItems) {
      localStorage.setItem('context_cartItems', JSON.stringify(this.state.cartItems));
    }
  }

  addToCart = (product: Product) => {
    this.setState((prevState) => ({
      cartItems: [...prevState.cartItems, product]
    }));
  }

  render() {
    return (
      <CartContext.Provider
        value={{
          cartItems: this.state.cartItems,
          addToCart: this.addToCart,
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}
