import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Empréstimo Pessoal',
    taxaAnual: 12.5,
    prazoMaximo: 60,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Crédito Consignado',
    taxaAnual: 8.9,
    prazoMaximo: 84,
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Financiamento Veicular',
    taxaAnual: 15.2,
    prazoMaximo: 48,
    createdAt: '2024-01-25T09:15:00Z'
  }
];

// Simulação de AsyncStorage para persistir dados
let localProducts = [...mockProducts];

export const mockApi = {
  // Buscar produtos
  getProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return localProducts;
  },

  // Criar produto
  createProduct: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    localProducts.push(newProduct);
    return newProduct;
  },

  // Deletar produto
  deleteProduct: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    localProducts = localProducts.filter(p => p.id !== id);
  }
};