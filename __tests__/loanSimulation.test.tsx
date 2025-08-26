import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import LoanSimulation from '../app/loanSimulation';
import { mockApi } from '../utils/mockData';

// Mock do expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock do mockApi
jest.mock('../utils/mockData', () => ({
  mockApi: {
    getProducts: jest.fn(),
  },
}));

// Mock do Alert
const mockAlert = jest.spyOn(Alert, 'alert');

const mockProducts = [
  {
    id: '1',
    name: 'Empréstimo Pessoal',
    taxaAnual: 12.0,
    prazoMaximo: 60,
  },
  {
    id: '2',
    name: 'Empréstimo Consignado',
    taxaAnual: 8.5,
    prazoMaximo: 84,
  },
  {
    id: '3',
    name: 'Crédito Imobiliário',
    taxaAnual: 10.2,
    prazoMaximo: 420,
  },
];

describe('LoanSimulation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock para setTimeout usado na simulação
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Carregamento de produtos', () => {
    it('deve mostrar loading enquanto carrega produtos', () => {
      (mockApi.getProducts as any).mockImplementation(
        () => new Promise(() => {}) // Promise que nunca resolve
      );

      const { getByText } = render(<LoanSimulation />);

      expect(getByText('Carregando produtos...')).toBeTruthy();
    });

    it('deve carregar e exibir produtos com sucesso', async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);

      const { getByText } = render(<LoanSimulation />);

      await waitFor(() => {
        expect(getByText('Simulação de Empréstimo')).toBeTruthy();
        expect(getByText('Calcule as condições do seu empréstimo')).toBeTruthy();
      });
    });

    it('deve mostrar erro quando falha ao carregar produtos', async () => {
      (mockApi.getProducts as any).mockRejectedValue(new Error('Network error'));

      render(<LoanSimulation />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Erro', 'Não foi possível carregar os produtos');
      });
    });
  });

  describe('Renderização inicial', () => {
    beforeEach(async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);
    });

    it('deve renderizar todos os elementos da tela', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        expect(getByText('Simulação de Empréstimo')).toBeTruthy();
        expect(getByText('Calcule as condições do seu empréstimo')).toBeTruthy();
        expect(getByText('Produto')).toBeTruthy();
        expect(getByText('Valor do Empréstimo (R$)')).toBeTruthy();
        expect(getByText('Número de Parcelas')).toBeTruthy();
        expect(getByText('Selecione um produto')).toBeTruthy();
        expect(getByPlaceholderText('Ex: 10000')).toBeTruthy();
        expect(getByPlaceholderText('Ex: 12')).toBeTruthy();
        expect(getByText('Simular Empréstimo')).toBeTruthy();
      });
    });

    it('deve ter campos vazios inicialmente', async () => {
      const { getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        const valorInput = getByPlaceholderText('Ex: 10000');
        const parcelasInput = getByPlaceholderText('Ex: 12');

        expect(valorInput.props.value).toBe('');
        expect(parcelasInput.props.value).toBe('');
      });
    });

    it('deve ter placeholder de produto selecionado', async () => {
      const { getByText } = render(<LoanSimulation />);

      await waitFor(() => {
        expect(getByText('Selecione um produto')).toBeTruthy();
      });
    });
  });

  describe('Seleção de produto', () => {
    beforeEach(async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);
    });

    it('deve abrir modal de seleção ao clicar no picker', async () => {
      const { getByText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      expect(getByText('Selecione um Produto')).toBeTruthy();
      expect(getByText('Empréstimo Pessoal (12% a.a.)')).toBeTruthy();
      expect(getByText('Empréstimo Consignado (8.5% a.a.)')).toBeTruthy();
      expect(getByText('Crédito Imobiliário (10.2% a.a.)')).toBeTruthy();
    });

    it('deve selecionar produto e fechar modal', async () => {
      const { getByText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        expect(getByText('Empréstimo Pessoal (12% a.a.)')).toBeTruthy();
        expect(getByText('Prazo máximo: 60 meses')).toBeTruthy();
      });
    });

    it('deve cancelar seleção de produto', async () => {
      const { getByText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Cancelar'));

      await waitFor(() => {
        expect(getByText('Selecione um produto')).toBeTruthy();
      });
    });

    it('deve mostrar informações do produto selecionado', async () => {
      const { getByText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Consignado (8.5% a.a.)'));

      await waitFor(() => {
        expect(getByText('Empréstimo Consignado (8.5% a.a.)')).toBeTruthy();
        expect(getByText('Prazo máximo: 84 meses')).toBeTruthy();
      });
    });
  });

  describe('Preenchimento de campos', () => {
    beforeEach(async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);
    });

    it('deve permitir digitar valor do empréstimo', async () => {
      const { getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        const valorInput = getByPlaceholderText('Ex: 10000');
        fireEvent.changeText(valorInput, '50000');
        expect(valorInput.props.value).toBe('50000');
      });
    });

    it('deve permitir digitar número de parcelas', async () => {
      const { getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        const parcelasInput = getByPlaceholderText('Ex: 12');
        fireEvent.changeText(parcelasInput, '24');
        expect(parcelasInput.props.value).toBe('24');
      });
    });

    it('deve usar teclado numérico para valor', async () => {
      const { getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        const valorInput = getByPlaceholderText('Ex: 10000');
        expect(valorInput.props.keyboardType).toBe('numeric');
      });
    });

    it('deve usar teclado numérico para parcelas', async () => {
      const { getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        const parcelasInput = getByPlaceholderText('Ex: 12');
        expect(parcelasInput.props.keyboardType).toBe('numeric');
      });
    });
  });

  describe('Validação de campos', () => {
    beforeEach(async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);
    });

    it('deve mostrar erro quando todos os campos estão vazios', async () => {
      const { getByText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    });

    it('deve mostrar erro quando produto não está selecionado', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '50000');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '24');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    });

    it('deve mostrar erro quando valor está vazio', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '24');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    });

    it('deve mostrar erro quando parcelas está vazio', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '50000');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    });
  });

  describe('Validação de prazo máximo', () => {
    beforeEach(async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);
    });

    it('deve mostrar mensagem de erro quando prazo excede o máximo', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '70'); // Máximo é 60
      });

      expect(getByText('Máximo permitido: 60 meses')).toBeTruthy();
    });

    it('deve mostrar erro ao simular com prazo acima do máximo', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '50000');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '70');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'O prazo máximo para este produto é de 60 meses');
    });

    it('não deve mostrar erro quando prazo está dentro do limite', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '36');
      });

      expect(queryByText('Máximo permitido: 60 meses')).toBeNull();
    });
  });

  describe('Validação de valores', () => {
    beforeEach(async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);
    });

    it('deve mostrar erro quando valor é zero', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '0');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '24');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Valor e prazo devem ser maiores que zero');
    });

    it('deve mostrar erro quando parcelas é zero', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '50000');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '0');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Valor e prazo devem ser maiores que zero');
    });

    it('deve mostrar erro quando valor é negativo', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '-1000');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '24');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Valor e prazo devem ser maiores que zero');
    });
  });

  describe('Simulação de empréstimo', () => {
    beforeEach(async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);
    });

    it('deve realizar simulação com sucesso', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '10000');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '12');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      // Avança o tempo para simular o delay da simulação
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(getByText('Resultado da Simulação')).toBeTruthy();
        expect(getByText('Produto:')).toBeTruthy();
        expect(getByText('Empréstimo Pessoal')).toBeTruthy();
        expect(getByText('Valor solicitado:')).toBeTruthy();
        expect(getByText('Prazo:')).toBeTruthy();
        expect(getByText('12 meses')).toBeTruthy();
        expect(getByText('Taxa efetiva mensal:')).toBeTruthy();
        expect(getByText('Parcela mensal:')).toBeTruthy();
        expect(getByText('Valor total com juros:')).toBeTruthy();
        expect(getByText('Memória de Cálculo:')).toBeTruthy();
      });
    });

    it('deve mostrar cronograma de pagamentos na simulação', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '10000');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '12');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(getByText('Mês 1:')).toBeTruthy();
        expect(getByText('Mês 12:')).toBeTruthy();
      });
    });

    it('deve fechar modal de resultado', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '10000');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '12');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(getByText('Resultado da Simulação')).toBeTruthy();
      });

      // Busca o botão "Fechar" dentro do modal
      const fecharButtons = getByText('Fechar');
      fireEvent.press(fecharButtons);

      await waitFor(() => {
        expect(queryByText('Resultado da Simulação')).toBeNull();
      });
    });

    it('deve calcular valores corretos na simulação', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '1000');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '12');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(getByText('R$ 1.000,00')).toBeTruthy(); // Valor solicitado
        expect(getByText('1,00%')).toBeTruthy(); // Taxa mensal (12% anual / 12)
      });
    });
  });

  describe('Produtos com diferentes taxas', () => {
    beforeEach(async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);
    });

    it('deve simular corretamente com produto de taxa menor', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Consignado (8.5% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '10000');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '12');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(getByText('Empréstimo Consignado')).toBeTruthy();
        expect(getByText('0,71%')).toBeTruthy(); // Taxa mensal (8.5% anual / 12)
      });
    });

    it('deve permitir prazo maior para produto com prazo máximo maior', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Crédito Imobiliário (10.2% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '360'); // Dentro do limite de 420
      });

      expect(queryByText(/Máximo permitido:/)).toBeNull();
    });
  });

  describe('Estados da interface', () => {
    beforeEach(async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);
    });

    it('deve esconder loading após carregar produtos', async () => {
      const { getByText, queryByText } = render(<LoanSimulation />);

      await waitFor(() => {
        expect(queryByText('Carregando produtos...')).toBeNull();
        expect(getByText('Simulação de Empréstimo')).toBeTruthy();
      });
    });

    it('deve mostrar informações do produto apenas quando selecionado', async () => {
      const { getByText, queryByText } = render(<LoanSimulation />);

      await waitFor(() => {
        expect(queryByText(/Prazo máximo:/)).toBeNull();
      });

      fireEvent.press(getByText('Selecione um produto'));
      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        expect(getByText('Prazo máximo: 60 meses')).toBeTruthy();
      });
    });
  });

  describe('Edge cases', () => {
    beforeEach(async () => {
      (mockApi.getProducts as any).mockResolvedValue(mockProducts);
    });

    it('deve lidar com lista de produtos vazia', async () => {
      (mockApi.getProducts as any).mockResolvedValue([]);

      const { getByText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      expect(getByText('Selecione um Produto')).toBeTruthy();
      expect(getByText('Cancelar')).toBeTruthy();
    });

    it('deve mostrar erro quando produto não é encontrado na simulação', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      // Simula situação onde produto não existe mais
      (mockApi.getProducts as any).mockResolvedValue([]);

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '10000');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '12');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro', 'Produto não encontrado');
    });

    it('deve lidar com valores decimais', async () => {
      const { getByText, getByPlaceholderText } = render(<LoanSimulation />);

      await waitFor(() => {
        fireEvent.press(getByText('Selecione um produto'));
      });

      fireEvent.press(getByText('Empréstimo Pessoal (12% a.a.)'));

      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Ex: 10000'), '1500.50');
        fireEvent.changeText(getByPlaceholderText('Ex: 12'), '24');
        fireEvent.press(getByText('Simular Empréstimo'));
      });

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(getByText('Resultado da Simulação')).toBeTruthy();
      });
    });
  });
});