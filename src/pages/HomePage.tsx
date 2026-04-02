import React, { Component } from 'react';
import { Product } from '../types/product';
import { API } from '../api/api';
import { ProductCard } from '../components/ProductCard';

interface State {
  products: Product[];
  categories: any[];
  selectedCategorySlug: string;
  sortOrder: 'asc' | 'desc' | '';
  columns: number;
  loading: boolean;
  error: string;
  searchTitle: string;
  priceMin: string;
  priceMax: string;
  page: number;
  limit: number;
}

export class HomePage extends Component<{}, State> {
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
      searchTitle: '',
      priceMin: '',
      priceMax: '',
      page: 0,
      limit: 10
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
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
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
    const { searchTitle, priceMin, priceMax, selectedCategorySlug, page, limit } = this.state;
    this.setState({ loading: true, error: '' });

    try {
      const products = await API.getProducts({
        title: searchTitle,
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
    this.setState({ [name]: value, page: 0 } as unknown as Pick<State, keyof State>);
  }

  handleApplyFilters = () => {
    this.setState({ page: 0 }, this.fetchProducts);
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

  render() {
    const { categories, selectedCategorySlug, sortOrder, columns, loading, error, searchTitle, priceMin, priceMax, page } = this.state;
    const displayedProducts = this.getSortedProducts();

    return (
      <div style={{ backgroundColor: '#eaeded', minHeight: '100vh', padding: '16px', paddingBottom: '100px', fontFamily: '"Amazon Ember", Arial, sans-serif' }}>
        <div style={{ 
          backgroundColor: '#fafafa', 
          padding: '12px 24px', 
          borderRadius: '4px', 
          marginBottom: '24px', 
          border: '1px solid #ddd', 
          maxWidth: '1400px', 
          margin: '0 auto 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 auto' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f1111' }}>Filters:</span>
            
            <input
              name="searchTitle"
              type="text"
              value={searchTitle}
              onChange={this.handleFilterChange}
              placeholder="Search items..."
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #a6a6a6', outline: 'none', maxWidth: '150px' }}
            />

            <input
              name="priceMin"
              type="number"
              value={priceMin}
              onChange={this.handleFilterChange}
              placeholder="Min $"
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #a6a6a6', outline: 'none', width: '80px' }}
            />

            <input
              name="priceMax"
              type="number"
              value={priceMax}
              onChange={this.handleFilterChange}
              placeholder="Max $"
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #a6a6a6', outline: 'none', width: '80px' }}
            />

            <select
              name="selectedCategorySlug"
              value={selectedCategorySlug}
              onChange={this.handleFilterChange}
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #a6a6a6', outline: 'none' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug || cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={this.handleSortChange}
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #a6a6a6', outline: 'none' }}
            >
              <option value="">Sort by: Featured</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          <button
            onClick={this.handleApplyFilters}
            style={{ 
              padding: '6px 16px', 
              backgroundColor: '#fff', 
              color: '#0f1111', 
              border: '1px solid #d5d9d9', 
              borderRadius: '8px', 
              fontSize: '13px', 
              cursor: 'pointer', 
              boxShadow: '0 2px 5px rgba(213,217,217,.5)',
              whiteSpace: 'nowrap'
            }}
          >
            Apply API
          </button>
        </div>

        {error && (
          <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px', padding: '20px', backgroundColor: '#ffebe9', borderRadius: '8px', maxWidth: '1200px', margin: '0 auto 20px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '20px', fontWeight: 'bold', color: '#555' }}>
            Loading products...
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: '24px',
              maxWidth: '1200px',
              margin: '0 auto 32px'
            }}>
              {displayedProducts.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', fontSize: '18px', color: '#555' }}>No products found.</div>
              ) : (
                displayedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', maxWidth: '1200px', margin: '0 auto' }}>
              <button
                onClick={this.handlePrevPage}
                disabled={page === 0}
                style={{ padding: '10px 20px', backgroundColor: page === 0 ? '#ccc' : '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <span style={{ padding: '10px', fontSize: '16px', fontWeight: 'bold' }}>Page {page + 1}</span>
              <button
                onClick={this.handleNextPage}
                disabled={displayedProducts.length < this.state.limit}
                style={{ padding: '10px 20px', backgroundColor: displayedProducts.length < this.state.limit ? '#ccc' : '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: displayedProducts.length < this.state.limit ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
}
