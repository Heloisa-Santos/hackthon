export interface Product {
  id: string;
  name: string;
  description?: string;
  value?: number;
  category?: string;
  taxaAnual: number;
  prazoMaximo: number;
  createdAt: string;
}

export interface LoanSimulation {
  productId: string;
  productValue: number;
  installments: number;
  interestRate: number;
  monthlyPayment: number;
  totalAmount: number;
}

export interface MonthlyPayment {
  month: number;
  interest: number;
  amortization: number;
  balance: number;
}

export interface SimulationResult {
  product: Product;
  requestedAmount: number;
  term: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalAmount: number;
  paymentSchedule: MonthlyPayment[];
}