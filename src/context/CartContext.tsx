import React, { Component, createContext, ReactNode } from 'react';
import { Product } from '../types/product';

export interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number | string) => void;
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

  removeFromCart = (productId: number | string) => {
    this.setState((prevState) => {
      const index = prevState.cartItems.findIndex(item => item.id === productId);
      if (index === -1) return prevState;
      const newItems = [...prevState.cartItems];
      newItems.splice(index, 1);
      return { cartItems: newItems };
    });
  }

  render() {
    return (
      <CartContext.Provider
        value={{
          cartItems: this.state.cartItems,
          addToCart: this.addToCart,
          removeFromCart: this.removeFromCart
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}
