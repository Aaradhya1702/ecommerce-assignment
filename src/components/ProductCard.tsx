import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Product } from '../types/product';
import { cartStore } from '../mobx/CartStore';

interface Props extends RouteComponentProps {
  product: Product;
}

interface State {
  isHovered: boolean;
  buttonHovered: boolean;
}

class ProductCardComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isHovered: false,
      buttonHovered: false
    };
  }

  handleNavigate = () => {
    this.props.history.push({
      pathname: `/product/${this.props.product.id}/details`,
      state: { product: this.props.product }
    });
  }

  handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    cartStore.addItem(this.props.product);
    alert('Item added to cart!');
  }

  render() {
    const { product } = this.props;
    const { isHovered, buttonHovered } = this.state;
    
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
        onClick={this.handleNavigate}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
        style={{
          backgroundColor: 'white',
          borderRadius: '4px',
          padding: '16px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
          minHeight: '400px',
          boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
          transform: isHovered ? 'translateY(-2px)' : 'none',
          border: '1px solid #eee'
        }}
      >
        <img
          src={imageUrl}
          alt={product.title}
          style={{ width: '100%', height: '220px', objectFit: 'contain', marginBottom: '12px' }}
        />
        
        <div style={{ color: '#565959', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
          {product.category?.name}
        </div>
        
        <h3 style={{
          fontSize: '16px',
          lineHeight: '1.4',
          margin: '0 0 8px 0',
          color: '#0f1111',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '44px'
        }}>
          {product.title}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ color: '#ffa41c', fontSize: '18px', marginRight: '4px' }}>&#9733;&#9733;&#9733;&#9733;&#9734;</span>
          <span style={{ color: '#007185', fontSize: '14px' }}>1,234</span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f1111', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', verticalAlign: 'top' }}>$</span>
            {Math.floor(product.price)}
            <span style={{ fontSize: '14px', verticalAlign: 'top' }}>
              {(product.price % 1).toFixed(2).substring(2)}
            </span>
          </div>

          <button 
            onClick={this.handleAddToCart}
            onMouseEnter={() => this.setState({ buttonHovered: true })}
            onMouseLeave={() => this.setState({ buttonHovered: false })}
            style={{
              width: '100%',
              backgroundColor: buttonHovered ? '#f3a847' : '#ffd814',
              color: '#0f1111',
              border: '1px solid #fcd200',
              borderRadius: '20px',
              padding: '8px 0',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'normal',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s'
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    );
  }
}

export const ProductCard = withRouter(ProductCardComponent);
