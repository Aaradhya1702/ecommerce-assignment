import { makeAutoObservable, reaction } from 'mobx';
import { Product } from '../types/product';

export class CartStore {
  items: Product[] = [];
  searchQuery: string = '';

  constructor() {
    makeAutoObservable(this);
    this.loadCart();

    reaction(
      () => this.items.slice(),
      (items) => {
        localStorage.setItem('mobx_cartItems', JSON.stringify(items));
      }
    );
  }

  addItem = (product: Product) => {
    this.items.push(product);
  }

  removeItem = (productId: number | string) => {
    const index = this.items.findIndex(item => item.id === productId);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  setSearchQuery = (query: string) => {
    this.searchQuery = query;
  }

  loadCart = () => {
    try {
      const stored = localStorage.getItem('mobx_cartItems');
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
  }

  get totalPrice(): number {
    return this.items.reduce((total, item) => total + Number(item.price), 0);
  }

  get totalCount(): number {
    return this.items.length;
  }
}

export const cartStore = new CartStore();
