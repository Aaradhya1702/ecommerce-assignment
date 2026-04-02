import { Product } from '../types/product';

const BASE_URL = 'https://api.escuelajs.co/api/v1';

export interface GetProductsParams {
  title?: string;
  price_min?: number | string;
  price_max?: number | string;
  categorySlug?: string;
  offset?: number;
  limit?: number;
}

export class API {
  static async getProducts(params: GetProductsParams = {}): Promise<Product[]> {
    const url = new URL(`${BASE_URL}/products`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }

  static async getCategories(): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  static async getProductById(id: number | string): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product by id');
    return response.json();
  }
}
