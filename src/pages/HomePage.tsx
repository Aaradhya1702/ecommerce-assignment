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
    return 3;
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
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '32px', paddingBottom: '100px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', maxWidth: '1200px', margin: '0 auto 32px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>Filters</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 200px' }}>
              <label style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>Search Title</label>
              <input
                name="searchTitle"
                type="text"
                value={searchTitle}
                onChange={this.handleFilterChange}
                placeholder="e.g. shirt"
                style={{ padding: '10px 16px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 120px' }}>
              <label style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>Min Price</label>
              <input
                name="priceMin"
                type="number"
                value={priceMin}
                onChange={this.handleFilterChange}
                placeholder="0"
                style={{ padding: '10px 16px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 120px' }}>
              <label style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>Max Price</label>
              <input
                name="priceMax"
                type="number"
                value={priceMax}
                onChange={this.handleFilterChange}
                placeholder="500"
                style={{ padding: '10px 16px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 200px' }}>
              <label style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
              <select
                name="selectedCategorySlug"
                value={selectedCategorySlug}
                onChange={this.handleFilterChange}
                style={{ padding: '10px 16px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug || cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 200px' }}>
              <label style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>Local Sorting</label>
              <select
                value={sortOrder}
                onChange={this.handleSortChange}
                style={{ padding: '10px 16px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Default Sort</option>
                <option value="asc">Price Low to High</option>
                <option value="desc">Price High to Low</option>
              </select>
            </div>

            <button
              onClick={this.handleApplyFilters}
              style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Apply Filters API
            </button>
          </div>
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
