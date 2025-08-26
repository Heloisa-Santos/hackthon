import { render } from '@testing-library/react-native';
import React from 'react';
import ListProdutos from '../app/listProdutos';
import { mockApi } from '../utils/mockData';

// Mock do expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    push: mockPush,
  },
}));

// Mock do mockApi
jest.mock('../utils/mockData', () => ({
  mockApi: {
    getProducts: jest.fn(),
    deleteProduct: jest.fn(),
  },
}));

const mockProducts = [
  {
    id: '1',
    name: 'Empréstimo Pessoal',
    taxaAnual: 12.5,
    prazoMaximo: 60,
  },
  {
    id: '2',
    name: 'Empréstimo Consignado',
    taxaAnual: 8.9,
    prazoMaximo: 84,
  },
];

describe('ListProdutos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar loading inicialmente', () => {
    (mockApi.getProducts as any).mockImplementation(
      () => new Promise(() => {}) // Promise que nunca resolve
    );

    const { getByText } = render(<ListProdutos />);
    
    expect(getByText('Carregando produtos...')).toBeTruthy();
  });

  it('deve renderizar sem crashar', () => {
    (mockApi.getProducts as any).mockResolvedValue([]);
    
    const component = render(<ListProdutos />);
    
    expect(component).toBeTruthy();
  });
});