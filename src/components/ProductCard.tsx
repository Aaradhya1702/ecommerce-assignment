import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Product } from '../types/product';

interface Props extends RouteComponentProps {
  product: Product;
}

class ProductCardComponent extends Component<Props> {
  handleClick = () => {
    this.props.history.push({
      pathname: `/product/${this.props.product.id}/details`,
      state: { product: this.props.product }
    });
  }

  render() {
    const { product } = this.props;

    // Safety check for images array since sometimes API returns badly formatted strings
    let imageUrl = '';
    if (product.images && product.images.length > 0) {
      let firstImg = product.images[0];
      if (firstImg.startsWith('[') && firstImg.endsWith(']')) {
        try {
          firstImg = JSON.parse(firstImg)[0];
        } catch (e) { }
      }
      imageUrl = firstImg;
    }

    return (
      <div
        onClick={this.handleClick}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '16px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.2s',
          minHeight: '350px'
        }}
      >
        <img
          src={imageUrl}
          alt={product.title}
          style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: '16px' }}
        />
        <div style={{ alignSelf: 'flex-start', color: '#888', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {product.category?.name}
        </div>
        <h3 style={{
          fontSize: '16px',
          margin: '0 0 8px 0',
          textAlign: 'center',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '38px',
          width: '100%'
        }}>
          {product.title}
        </h3>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb', marginTop: 'auto' }}>
          ${Number(product.price).toFixed(2)}
        </span>
      </div>
    );
  }
}

export const ProductCard = withRouter(ProductCardComponent);
