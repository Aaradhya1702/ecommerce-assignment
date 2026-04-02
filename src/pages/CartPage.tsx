import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react';
import { cartStore } from '../mobx/CartStore';
import { CartContext, CartContextType } from '../context/CartContext';

interface Props extends RouteComponentProps { }

class CartPageComponent extends Component<Props> {
  static contextType = CartContext;

  handleRemove = (productId: number | string) => {
    cartStore.removeItem(productId);

    if (this.context) {
      const { removeFromCart } = this.context as CartContextType;
      removeFromCart(productId);
    }
  }

  render() {
    const items = cartStore.items;

    return (
      <div style={{ backgroundColor: '#eaeded', minHeight: '100vh', padding: '32px 16px', fontFamily: '"Amazon Ember", Arial, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

          {/* Cart Items List */}
          <div style={{ flex: '1 1 700px', backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '28px', marginTop: 0, marginBottom: '8px', paddingBottom: '16px', borderBottom: '1px solid #ddd' }}>Shopping Cart</h1>

            {items.length === 0 ? (
              <p style={{ fontSize: '18px', color: '#565959', padding: '24px 0' }}>Your Ganga Cart is empty.</p>
            ) : (
              <div>
                {items.map((item, index) => {
                  let imageUrl = '';
                  if (item.images && item.images.length > 0) {
                    let firstImg = item.images[0];
                    if (firstImg.startsWith('[') && firstImg.endsWith(']')) {
                      try {
                        firstImg = JSON.parse(firstImg)[0];
                      } catch (e) { }
                    }
                    imageUrl = firstImg;
                  }

                  return (
                    <div key={`${item.id}-${index}`} style={{ display: 'flex', borderBottom: '1px solid #ddd', padding: '24px 0', gap: '24px', flexWrap: 'wrap' }}>
                      <div style={{ width: '150px', flexShrink: 0 }}>
                        <img src={imageUrl} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '18px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.title}
                          </h3>
                          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${Number(item.price).toFixed(2)}</span>
                        </div>

                        <div style={{ fontSize: '12px', color: '#007185', textTransform: 'capitalize', marginBottom: '8px' }}>
                          {item.category?.name || 'General Product'}
                        </div>
                        <div style={{ color: '#007600', fontSize: '12px', marginBottom: '16px' }}>In Stock</div>

                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button data-testid="remove-item"
                            onClick={() => this.handleRemove(item.id)}
                            style={{ background: 'none', border: 'none', color: '#007185', padding: 0, cursor: 'pointer', fontSize: '14px' }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {items.length > 0 && (
              <div style={{ textAlign: 'right', marginTop: '24px', fontSize: '18px' }}>
                Subtotal ({cartStore.totalCount} items): <span style={{ fontWeight: 'bold' }}>${cartStore.totalPrice.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          {items.length > 0 && (
            <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '18px', marginBottom: '16px' }}>
                  Subtotal ({cartStore.totalCount} items): <span style={{ fontWeight: 'bold' }}>${cartStore.totalPrice.toFixed(2)}</span>
                </div>
                <button style={{
                  width: '100%',
                  backgroundColor: '#ffd814',
                  color: '#0f1111',
                  border: '1px solid #fcd200',
                  borderRadius: '20px',
                  padding: '10px 0',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 'normal',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  Proceed to checkout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }
}

export const CartPage = observer(CartPageComponent);
