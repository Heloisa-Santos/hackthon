import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import CadastrarProduto from '../app/cadastrarProduto';
import { mockApi } from '../utils/mockData';

// Mock do expo-router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    back: mockBack,
  },
}));

// Mock do mockApi
jest.mock('../utils/mockData', () => ({
  mockApi: {
    createProduct: jest.fn(),
  },
}));

// Mock do Alert
const mockAlert = jest.spyOn(Alert, 'alert');

describe('CadastrarProduto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização inicial', () => {
    it('deve renderizar todos os elementos da tela', () => {
      const { getByText, getByPlaceholderText } = render(<CadastrarProduto />);

      expect(getByText('Cadastrar Produto')).toBeTruthy();
      expect(getByText('Preencha as informações do produto de empréstimo')).toBeTruthy();
      expect(getByText('Nome do Produto')).toBeTruthy();
      expect(getByText('Taxa Anual de Juros (%)')).toBeTruthy();
      expect(getByText('Prazo Máximo (meses)')).toBeTruthy();
      expect(getByPlaceholderText('Ex: Empréstimo Pessoal')).toBeTruthy();
      expect(getByPlaceholderText('Ex: 12.5')).toBeTruthy();
      expect(getByPlaceholderText('Ex: 60')).toBeTruthy();
      expect(getByText('Cancelar')).toBeTruthy();
    });

    it('deve ter todos os campos vazios inicialmente', () => {
      const { getByPlaceholderText } = render(<CadastrarProduto />);

      const nomeInput = getByPlaceholderText('Ex: Empréstimo Pessoal');
      const taxaInput = getByPlaceholderText('Ex: 12.5');
      const prazoInput = getByPlaceholderText('Ex: 60');

      expect(nomeInput.props.value).toBe('');
      expect(taxaInput.props.value).toBe('');
      expect(prazoInput.props.value).toBe('');
    });

    it('deve ter botão de cadastrar ativo inicialmente', () => {
      const { getAllByText } = render(<CadastrarProduto />);

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      expect(submitButton.props.disabled).toBeFalsy();
    });
  });

  describe('Preenchimento de campos', () => {
    it('deve permitir digitar no campo nome', () => {
      const { getByPlaceholderText } = render(<CadastrarProduto />);

      const nomeInput = getByPlaceholderText('Ex: Empréstimo Pessoal');
      fireEvent.changeText(nomeInput, 'Empréstimo Teste');

      expect(nomeInput.props.value).toBe('Empréstimo Teste');
    });

    it('deve permitir digitar no campo taxa', () => {
      const { getByPlaceholderText } = render(<CadastrarProduto />);

      const taxaInput = getByPlaceholderText('Ex: 12.5');
      fireEvent.changeText(taxaInput, '15.5');

      expect(taxaInput.props.value).toBe('15.5');
    });

    it('deve permitir digitar no campo prazo', () => {
      const { getByPlaceholderText } = render(<CadastrarProduto />);

      const prazoInput = getByPlaceholderText('Ex: 60');
      fireEvent.changeText(prazoInput, '48');

      expect(prazoInput.props.value).toBe('48');
    });
  });

  describe('Validação de campos obrigatórios', () => {
    it('deve mostrar erro quando todos os campos estão vazios', () => {
      const { getAllByText } = render(<CadastrarProduto />);

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    });

    it('deve mostrar erro quando apenas nome está preenchido', () => {
      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    });

    it('deve mostrar erro quando apenas taxa está preenchida', () => {
      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    });

    it('deve mostrar erro quando apenas prazo está preenchido', () => {
      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    });
  });

  describe('Validação de tipos de dados', () => {
    it('deve mostrar erro quando taxa não é um número', () => {
      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), 'abc');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Taxa e prazo devem ser números válidos');
    });

    it('deve mostrar erro quando prazo não é um número', () => {
      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10.5');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), 'xyz');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Taxa e prazo devem ser números válidos');
    });

    it('deve mostrar erro quando ambos taxa e prazo não são números', () => {
      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), 'abc');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), 'xyz');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Taxa e prazo devem ser números válidos');
    });
  });

  describe('Validação de valores positivos', () => {
    it('deve mostrar erro quando taxa é zero', () => {
      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '0');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Taxa e prazo devem ser maiores que zero');
    });

    it('deve mostrar erro quando taxa é negativa', () => {
      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '-5');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Taxa e prazo devem ser maiores que zero');
    });

    it('deve mostrar erro quando prazo é zero', () => {
      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10.5');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '0');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Taxa e prazo devem ser maiores que zero');
    });

    it('deve mostrar erro quando prazo é negativo', () => {
      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10.5');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '-10');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Taxa e prazo devem ser maiores que zero');
    });
  });

  describe('Validação em tempo real', () => {
    it('deve mostrar mensagem de erro para taxa inválida', () => {
      const { getByPlaceholderText, getByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '-5');

      expect(getByText('Taxa deve ser maior que zero')).toBeTruthy();
    });

    it('deve mostrar mensagem de erro para prazo inválido', () => {
      const { getByPlaceholderText, getByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '0');

      expect(getByText('Prazo deve ser maior que zero')).toBeTruthy();
    });

    it('não deve mostrar erro quando taxa é válida', () => {
      const { getByPlaceholderText, queryByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10.5');

      expect(queryByText('Taxa deve ser maior que zero')).toBeNull();
    });

    it('não deve mostrar erro quando prazo é válido', () => {
      const { getByPlaceholderText, queryByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      expect(queryByText('Prazo deve ser maior que zero')).toBeNull();
    });
  });

  describe('Cadastro de produto', () => {
    it('deve cadastrar produto com sucesso', async () => {
      (mockApi.createProduct as any).mockResolvedValue(undefined);

      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Empréstimo Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '15.5');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '48');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockApi.createProduct).toHaveBeenCalledWith({
          name: 'Empréstimo Teste',
          taxaAnual: 15.5,
          prazoMaximo: 48,
        });
      });

      expect(mockAlert).toHaveBeenCalledWith(
        'Sucesso',
        'Produto cadastrado com sucesso!',
        expect.arrayContaining([
          expect.objectContaining({ text: 'OK' })
        ])
      );
    });

    it('deve mostrar estado de loading durante cadastro', async () => {
      (mockApi.createProduct as any).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { getByPlaceholderText, getAllByText, getByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      expect(getByText('Cadastrando...')).toBeTruthy();

      await waitFor(() => {
        expect(getAllByText('Cadastrar Produto').length).toBeGreaterThan(0);
      });
    });

    it('deve desabilitar campos durante loading', async () => {
      (mockApi.createProduct as any).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      const nomeInput = getByPlaceholderText('Ex: Empréstimo Pessoal');
      expect(nomeInput.props.editable).toBe(false);

      await waitFor(() => {
        expect(nomeInput.props.editable).toBe(true);
      });
    });

    it('deve mostrar erro quando falha ao cadastrar', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      (mockApi.createProduct as any).mockRejectedValue(new Error('Network error'));

      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Erro', 'Não foi possível cadastrar o produto. Tente novamente.');
      });

      expect(consoleError).toHaveBeenCalledWith('Erro ao cadastrar produto:', expect.any(Error));
      consoleError.mockRestore();
    });

    it('deve limpar campos e voltar após sucesso', async () => {
      (mockApi.createProduct as any).mockResolvedValue(undefined);

      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Sucesso',
          'Produto cadastrado com sucesso!',
          expect.arrayContaining([
            expect.objectContaining({ text: 'OK' })
          ])
        );
      });

      // Simula clique no OK do Alert de sucesso
      const alertCall = mockAlert.mock.calls.find(
        call => call[0] === 'Sucesso'
      );
      const okButton = alertCall?.[2]?.find((button: any) => button.text === 'OK');
      if (okButton && okButton.onPress) {
        okButton.onPress();
      }

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Navegação', () => {
    it('deve voltar quando clica em cancelar', () => {
      const { getByText } = render(<CadastrarProduto />);

      const cancelarButton = getByText('Cancelar');
      fireEvent.press(cancelarButton);

      expect(mockBack).toHaveBeenCalled();
    });

    it('deve desabilitar botão cancelar durante loading', async () => {
      (mockApi.createProduct as any).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { getByPlaceholderText, getAllByText, getByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      const cancelarButton = getByText('Cancelar');
      expect(cancelarButton.props.disabled).toBe(true);

      await waitFor(() => {
        expect(cancelarButton.props.disabled).toBe(false);
      });
    });
  });

  describe('Formatação de dados', () => {
    it('deve fazer trim no nome do produto', async () => {
      (mockApi.createProduct as any).mockResolvedValue(undefined);

      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), '  Teste  ');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '10');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockApi.createProduct).toHaveBeenCalledWith({
          name: 'Teste',
          taxaAnual: 10,
          prazoMaximo: 36,
        });
      });
    });

    it('deve converter taxa para float e prazo para int', async () => {
      (mockApi.createProduct as any).mockResolvedValue(undefined);

      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '15.75');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '48');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockApi.createProduct).toHaveBeenCalledWith({
          name: 'Teste',
          taxaAnual: 15.75,
          prazoMaximo: 48,
        });
      });
    });

    it('deve aceitar taxa com vírgula convertida para ponto', async () => {
      (mockApi.createProduct as any).mockResolvedValue(undefined);

      const { getByPlaceholderText, getAllByText } = render(<CadastrarProduto />);

      fireEvent.changeText(getByPlaceholderText('Ex: Empréstimo Pessoal'), 'Teste');
      fireEvent.changeText(getByPlaceholderText('Ex: 12.5'), '12,5');
      fireEvent.changeText(getByPlaceholderText('Ex: 60'), '36');

      const cadastrarButtons = getAllByText('Cadastrar Produto');
      const submitButton = cadastrarButtons[cadastrarButtons.length - 1];
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockApi.createProduct).toHaveBeenCalledWith({
          name: 'Teste',
          taxaAnual: 12.5,
          prazoMaximo: 36,
        });
      });
    });
  });

  describe('Teclado numérico', () => {
    it('deve usar teclado numérico para campo taxa', () => {
      const { getByPlaceholderText } = render(<CadastrarProduto />);

      const taxaInput = getByPlaceholderText('Ex: 12.5');
      expect(taxaInput.props.keyboardType).toBe('numeric');
    });

    it('deve usar teclado numérico para campo prazo', () => {
      const { getByPlaceholderText } = render(<CadastrarProduto />);

      const prazoInput = getByPlaceholderText('Ex: 60');
      expect(prazoInput.props.keyboardType).toBe('numeric');
    });
  });
});