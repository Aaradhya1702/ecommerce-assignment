import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';
import { Product } from '../types/product';
import { API } from '../api/api';
import { ProductCard } from '../components/ProductCard';
import { cartStore } from '../mobx/CartStore';

interface State {
  products: Product[];
  categories: any[];
  selectedCategorySlug: string;
  sortOrder: 'asc' | 'desc' | '';
  columns: number;
  loading: boolean;
  error: string;
  priceMin: string;
  priceMax: string;
  page: number;
  limit: number;
}

class HomePageComponent extends Component<{}, State> {
  searchReactionDispose?: () => void;

  constructor(props: {}) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      selectedCategorySlug: '',
      sortOrder: '',
      columns: this.getColumns(),
      loading: true,
      error: '',
      priceMin: '',
      priceMax: '',
      page: 0,
      limit: 12
    };
  }

  getColumns = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 4;
  }

  handleResize = () => {
    this.setState({ columns: this.getColumns() });
  }

  async componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    await this.fetchCategories();
    await this.fetchProducts();

    this.searchReactionDispose = reaction(
      () => cartStore.searchQuery,
      () => {
        this.setState({ page: 0 }, this.fetchProducts);
      },
      { delay: 300 }
    );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.searchReactionDispose) this.searchReactionDispose();
  }

  fetchCategories = async () => {
    try {
      const categories = await API.getCategories();
      this.setState({ categories });
    } catch (e) {
      console.error(e);
    }
  }

  fetchProducts = async () => {
    const { priceMin, priceMax, selectedCategorySlug, page, limit } = this.state;
    this.setState({ loading: true, error: '' });

    try {
      const products = await API.getProducts({
        title: cartStore.searchQuery,
        price_min: priceMin,
        price_max: priceMax,
        categorySlug: selectedCategorySlug,
        offset: page * limit,
        limit: limit
      });
      this.setState({ products, loading: false });
    } catch (e: any) {
      this.setState({ error: e.message || 'Failed to fetch products', loading: false });
    }
  }

  handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, page: 0 } as unknown as Pick<State, keyof State>, () => {
      this.fetchProducts();
    });
  }

  handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ sortOrder: e.target.value as any });
  }

  handleNextPage = () => {
    this.setState(prev => ({ page: prev.page + 1 }), this.fetchProducts);
  }

  handlePrevPage = () => {
    this.setState(prev => ({ page: Math.max(0, prev.page - 1) }), this.fetchProducts);
  }

  getSortedProducts = () => {
    const { products, sortOrder } = this.state;
    const arr = [...products];
    if (sortOrder === 'asc') {
      arr.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      arr.sort((a, b) => b.price - a.price);
    }
    return arr;
  }

  scrollToProducts = () => {
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    const { categories, selectedCategorySlug, sortOrder, columns, loading, error, priceMin, priceMax, page } = this.state;
    const displayedProducts = this.getSortedProducts();

    return (
      <div style={{ backgroundColor: '#eaeded', minHeight: '100vh', paddingBottom: '100px', fontFamily: '"Amazon Ember", Arial, sans-serif' }}>
        
        {/* HERO SECTION */}
        <div style={{
          width: '100%',
          height: '300px',
          background: 'linear-gradient(to right, #232f3e, #37475a)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 16px 0' }}>Discover Your Style</h1>
          <p style={{ fontSize: '20px', margin: '0 0 32px 0', maxWidth: '600px' }}>
            Shop the latest trends and everyday essentials. Fast shipping, easy returns, and endless choices.
          </p>
          <button 
            onClick={this.scrollToProducts}
            style={{
              backgroundColor: '#ffd814',
              color: '#0f1111',
              border: 'none',
              borderRadius: '24px',
              padding: '14px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          >
            Shop Now
          </button>
        </div>

        <div id="products-section" style={{ padding: '0 16px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* FILTER BAR MINIMAL HORIZONTAL */}
          <div style={{ 
            backgroundColor: '#fafafa', 
            padding: '12px 24px', 
            borderRadius: '4px', 
            marginBottom: '24px', 
            border: '1px solid #ddd', 
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f1111', marginRight: '8px' }}>Filters:</span>
            
            <input
              name="priceMin"
              type="number"
              value={priceMin}
              onChange={this.handleFilterChange}
              placeholder="Min $"
              style={{ padding: '8px 12px', fontSize: '14px', borderRadius: '4px', border: '1px solid #a6a6a6', outline: 'none', width: '90px' }}
            />

            <input
              name="priceMax"
              type="number"
              value={priceMax}
              onChange={this.handleFilterChange}
              placeholder="Max $"
              style={{ padding: '8px 12px', fontSize: '14px', borderRadius: '4px', border: '1px solid #a6a6a6', outline: 'none', width: '90px' }}
            />

            <select
              name="selectedCategorySlug"
              value={selectedCategorySlug}
              onChange={this.handleFilterChange}
              style={{ padding: '8px 12px', fontSize: '14px', borderRadius: '4px', border: '1px solid #a6a6a6', outline: 'none', minWidth: '150px' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug || cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={this.handleSortChange}
              style={{ padding: '8px 12px', fontSize: '14px', borderRadius: '4px', border: '1px solid #a6a6a6', outline: 'none', marginLeft: 'auto' }}
            >
              <option value="">Sort by: Featured</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          {error && (
            <div style={{ color: '#b12704', padding: '16px', backgroundColor: '#fcf4f4', borderRadius: '4px', border: '1px solid #e2a09f', marginBottom: '24px' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', fontSize: '20px', color: '#565959' }}>
              <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #f3a847', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '24px',
                marginBottom: '32px'
              }}>
                {displayedProducts.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', fontSize: '18px', color: '#565959' }}>No products found matching your criteria.</div>
                ) : (
                  displayedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button
                  onClick={this.handlePrevPage}
                  disabled={page === 0}
                  style={{ padding: '10px 24px', backgroundColor: page === 0 ? '#f3f3f3' : '#fff', color: page === 0 ? '#888' : '#0f1111', border: '1px solid #d5d9d9', borderRadius: '8px', fontSize: '14px', cursor: page === 0 ? 'not-allowed' : 'pointer', boxShadow: '0 2px 5px rgba(213,217,217,.5)' }}
                >
                  Previous
                </button>
                <div style={{ padding: '10px', fontSize: '16px', color: '#565959' }}>Page {page + 1}</div>
                <button
                  onClick={this.handleNextPage}
                  disabled={displayedProducts.length < this.state.limit}
                  style={{ padding: '10px 24px', backgroundColor: displayedProducts.length < this.state.limit ? '#f3f3f3' : '#fff', color: displayedProducts.length < this.state.limit ? '#888' : '#0f1111', border: '1px solid #d5d9d9', borderRadius: '8px', fontSize: '14px', cursor: displayedProducts.length < this.state.limit ? 'not-allowed' : 'pointer', boxShadow: '0 2px 5px rgba(213,217,217,.5)' }}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export const HomePage = observer(HomePageComponent);
