import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Product } from '../types/product';
import { API } from '../api/api';
import { cartStore } from '../mobx/CartStore';
import { CartContext, CartContextType } from '../context/CartContext';

interface RouteParams {
  id: string;
}

interface LocationState {
  product?: Product;
}

interface Props extends RouteComponentProps<RouteParams, any, LocationState> { }

interface State {
  product: Product | null;
  activeImageIndex: number;
  loading: boolean;
  error: string;
}

export class ProductDetailPage extends Component<Props, State> {
  static contextType = CartContext;

  constructor(props: Props) {
    super(props);
    this.state = {
      product: props.location.state?.product || null,
      activeImageIndex: 0,
      loading: false,
      error: ''
    };
  }

  async componentDidMount() {
    if (!this.state.product) {
      this.fetchProduct();
    }
  }

  fetchProduct = async () => {
    const { id } = this.props.match.params;
    if (!id) return;

    this.setState({ loading: true, error: '' });
    try {
      const product = await API.getProductById(id);
      this.setState({ product, loading: false });
    } catch (e: any) {
      this.setState({ error: e.message || 'Failed to fetch product', loading: false });
    }
  }

  handleAddToCart = () => {
    const { product } = this.state;
    if (product) {
      cartStore.addItem(product);

      if (this.context) {
        const { addToCart } = this.context as CartContextType;
        addToCart(product);
      }

      alert('Item added to cart!');
    }
  }

  handleBack = () => {
    this.props.history.push('/');
  }

  render() {
    const { product, loading, error, activeImageIndex } = this.state;

    if (loading) {
      return <div style={{ padding: '32px', textAlign: 'center', fontSize: '20px' }}>Loading product details...</div>;
    }

    if (error) {
      return (
        <div style={{ padding: '32px', textAlign: 'center', color: 'red' }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={this.handleBack} style={{ padding: '8px 16px', cursor: 'pointer' }}>Back to Home</button>
        </div>
      );
    }

    if (!product) {
      return (
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <h2>Product Not Found</h2>
          <button onClick={this.handleBack} style={{ padding: '8px 16px', cursor: 'pointer' }}>Back to Home</button>
        </div>
      );
    }

    // Parse images array safely as EscuelaJS API occasionally returns stringified array as first element
    let images: string[] = [];
    if (product.images && product.images.length > 0) {
      images = [...product.images];
      if (images[0] && images[0].startsWith('[') && images[0].endsWith(']')) {
        try {
          images = JSON.parse(images[0]);
        } catch (e) { }
      }
    }

    const mainImage = images[activeImageIndex] || '';

    return (
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '32px', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '32px',
          maxWidth: '800px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <button
            onClick={this.handleBack}
            style={{
              alignSelf: 'flex-start',
              padding: '8px 16px',
              marginBottom: '24px',
              backgroundColor: 'transparent',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>

          <img
            src={mainImage}
            alt={product.title}
            style={{ width: '100%', maxWidth: '400px', height: '400px', objectFit: 'contain', marginBottom: '16px', borderRadius: '8px' }}
          />

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', padding: '4px', maxWidth: '100%' }}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} thumbnail ${idx}`}
                  onClick={() => this.setState({ activeImageIndex: idx })}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: activeImageIndex === idx ? '2px solid #2563eb' : '1px solid #ddd'
                  }}
                />
              ))}
            </div>
          )}

          <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', textAlign: 'center' }}>{product.title}</h2>

          {product.category && (
            <div style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 'bold' }}>
              {product.category.name}
            </div>
          )}

          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', margin: '0 0 24px 0' }}>
            ${Number(product.price).toFixed(2)}
          </p>

          <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6', textAlign: 'center', marginBottom: '32px' }}>
            {product.description}
          </p>

          <button
            onClick={this.handleAddToCart}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              fontSize: '18px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)'
            }}
          >
            Add to MyCart
          </button>
        </div>
      </div>
    );
  }
}
