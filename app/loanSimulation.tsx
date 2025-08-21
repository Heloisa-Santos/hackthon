import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { colors, createStyles, globalStyles } from '../styles';
import { MonthlyPayment, Product, SimulationResult } from '../types';
import { mockApi } from '../utils/mockData';

export default function LoanSimulation() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState('');
  const [installments, setInstallments] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await mockApi.getProducts();
      setProducts(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    } finally {
      setLoading(false);
    }
  };

  const calculateLoan = async () => {
    if (!selectedProductId || !loanAmount || !installments) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) {
      Alert.alert('Erro', 'Produto não encontrado');
      return;
    }

    const principal = parseFloat(loanAmount);
    const months = parseInt(installments);

    if (months > product.prazoMaximo) {
      Alert.alert(
        'Erro', 
        `O prazo máximo para este produto é de ${product.prazoMaximo} meses`
      );
      return;
    }

    if (principal <= 0 || months <= 0) {
      Alert.alert('Erro', 'Valor e prazo devem ser maiores que zero');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const annualRate = product.taxaAnual / 100;
      const monthlyRate = annualRate / 12;

      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                            (Math.pow(1 + monthlyRate, months) - 1);

      const totalAmount = monthlyPayment * months;

      const paymentSchedule: MonthlyPayment[] = [];
      let remainingBalance = principal;

      for (let month = 1; month <= months; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const amortizationPayment = monthlyPayment - interestPayment;
        remainingBalance -= amortizationPayment;

        paymentSchedule.push({
          month,
          interest: interestPayment,
          amortization: amortizationPayment,
          balance: Math.max(0, remainingBalance)
        });
      }

      setSimulationResult({
        product,
        requestedAmount: principal,
        term: months,
        monthlyRate: monthlyRate * 100,
        monthlyPayment,
        totalAmount,
        paymentSchedule
      });

      setModalVisible(true);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar a simulação');
    }
  };

  const renderPaymentRow = ({ item }: { item: MonthlyPayment }) => (
    <View style={styles.paymentRow}>
      <Text style={styles.paymentMonth}>Mês {item.month}:</Text>
      <Text style={styles.paymentDetail}>
        Juros R$ {item.interest.toFixed(2)} | Amortização R$ {item.amortization.toFixed(2)} | Saldo: R$ {item.balance.toFixed(2)}
      </Text>
    </View>
  );

  const renderProductOption = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productOption}
      onPress={() => {
        setSelectedProductId(item.id);
        setShowProductPicker(false);
      }}
    >
      <Text style={styles.productOptionText}>
        {item.name} ({item.taxaAnual}% a.a.)
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={globalStyles.centerContainer}>
        <Text style={globalStyles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Simulação de Empréstimo</Text>
        <Text style={globalStyles.subtitle}>Calcule as condições do seu empréstimo</Text>
      </View>

      <View style={globalStyles.form}>
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Produto</Text>
          <TouchableOpacity 
            style={globalStyles.pickerButton}
            onPress={() => setShowProductPicker(true)}
          >
            <Text style={[globalStyles.pickerButtonText, !selectedProduct && globalStyles.pickerPlaceholder]}>
              {selectedProduct ? `${selectedProduct.name} (${selectedProduct.taxaAnual}% a.a.)` : 'Selecione um produto'}
            </Text>
            <Text style={globalStyles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          {selectedProduct && (
            <Text style={globalStyles.productInfoText}>
              Prazo máximo: {selectedProduct.prazoMaximo} meses
            </Text>
          )}
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Valor do Empréstimo (R$)</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Ex: 10000"
            value={loanAmount}
            onChangeText={setLoanAmount}
            keyboardType="numeric"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Número de Parcelas</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Ex: 12"
            value={installments}
            onChangeText={setInstallments}
            keyboardType="numeric"
            placeholderTextColor={colors.textLight}
          />
          {selectedProduct && installments && parseInt(installments) > selectedProduct.prazoMaximo && (
            <Text style={globalStyles.errorText}>
              Máximo permitido: {selectedProduct.prazoMaximo} meses
            </Text>
          )}
        </View>

        <TouchableOpacity style={globalStyles.button} onPress={calculateLoan}>
          <Text style={globalStyles.buttonText}>Simular Empréstimo</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para seleção de produto */}
      <Modal
        visible={showProductPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductPicker(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Selecione um Produto</Text>
            <FlatList
              data={products}
              renderItem={renderProductOption}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowProductPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Resultado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={globalStyles.modalTitle}>Resultado da Simulação</Text>
              
              {simulationResult && (
                <>
                  <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Produto:</Text>
                      <Text style={styles.summaryValue}>{simulationResult.product.name}</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Valor solicitado:</Text>
                      <Text style={styles.summaryValue}>
                        R$ {simulationResult.requestedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Prazo:</Text>
                      <Text style={styles.summaryValue}>{simulationResult.term} meses</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Taxa efetiva mensal:</Text>
                      <Text style={styles.summaryValue}>{simulationResult.monthlyRate.toFixed(2)}%</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Parcela mensal:</Text>
                      <Text style={[styles.summaryValue, globalStyles.highlightValue]}>
                        R$ {simulationResult.monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Valor total com juros:</Text>
                      <Text style={styles.summaryValue}>
                        R$ {simulationResult.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.scheduleTitle}>Memória de Cálculo:</Text>
                  <ScrollView 
                    style={styles.scheduleContainer}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {simulationResult.paymentSchedule.map((item) => (
                      <View key={item.month} style={styles.paymentRow}>
                        <Text style={styles.paymentMonth}>Mês {item.month}:</Text>
                        <Text style={styles.paymentDetail}>
                          Juros R$ {item.interest.toFixed(2)} | Amortização R$ {item.amortization.toFixed(2)} | Saldo: R$ {item.balance.toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </>
              )}

              <TouchableOpacity 
                style={globalStyles.button}
                onPress={() => setModalVisible(false)}
              >
                <Text style={globalStyles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Estilos específicos da tela
const styles = createStyles({
  pickerModal: {
    backgroundColor: colors.backgroundLight,
    margin: 20,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  
  pickerTitle: {
    fontSize: 20,
    fontFamily: 'CAIXAStd-Bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.textPrimary,
  },
  
  productOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  productOptionText: {
    fontSize: 16,
    fontFamily: 'CAIXAStd-Regular',
    color: colors.textPrimary,
  },
  
  cancelButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: colors.grayLighter,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'CAIXAStd-Regular',
    color: colors.caixaOrange,
  },
  
  summaryContainer: {
    marginBottom: 20,
    backgroundColor: colors.backgroundDark,
    padding: 15,
    borderRadius: 12,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'CAIXAStd-Regular',
    color: colors.textSecondary,
    flex: 1,
  },
  
  summaryValue: {
    fontSize: 14,
    fontFamily: 'CAIXAStd-SemiBold',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  
  scheduleTitle: {
    fontSize: 18,
    fontFamily: 'CAIXAStd-Bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  
  scheduleContainer: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  paymentRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  paymentMonth: {
    fontSize: 14,
    fontFamily: 'CAIXAStd-SemiBold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  
  paymentDetail: {
    fontSize: 12,
    fontFamily: 'CAIXAStd-Regular',
    color: colors.textSecondary,
  },
});