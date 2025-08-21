import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, createStyles, globalStyles } from '../styles';
import { mockApi } from '../utils/mockData';

export default function CadastrarProduto() {
  const [name, setName] = useState('');
  const [taxaAnual, setTaxaAnual] = useState('');
  const [prazoMaximo, setPrazoMaximo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !taxaAnual || !prazoMaximo) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (isNaN(Number(taxaAnual)) || isNaN(Number(prazoMaximo))) {
      Alert.alert('Erro', 'Taxa e prazo devem ser números válidos');
      return;
    }

    if (parseFloat(taxaAnual) <= 0 || parseInt(prazoMaximo) <= 0) {
      Alert.alert('Erro', 'Taxa e prazo devem ser maiores que zero');
      return;
    }

    setLoading(true);

    try {
      await mockApi.createProduct({
        name: name.trim(),
        taxaAnual: parseFloat(taxaAnual),
        prazoMaximo: parseInt(prazoMaximo),
      });

      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            setName('');
            setTaxaAnual('');
            setPrazoMaximo('');
            router.back();
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o produto. Tente novamente.');
      console.error('Erro ao cadastrar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Cadastrar Produto</Text>
        <Text style={globalStyles.subtitle}>Preencha as informações do produto de empréstimo</Text>
      </View>
      
      <View style={globalStyles.form}>
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Nome do Produto</Text>
          <TextInput
            style={[globalStyles.input, loading && styles.inputDisabled]}
            placeholder="Ex: Empréstimo Pessoal"
            value={name}
            onChangeText={setName}
            editable={!loading}
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Taxa Anual de Juros (%)</Text>
          <TextInput
            style={[globalStyles.input, loading && styles.inputDisabled]}
            placeholder="Ex: 12.5"
            value={taxaAnual}
            onChangeText={setTaxaAnual}
            keyboardType="numeric"
            editable={!loading}
            placeholderTextColor={colors.textLight}
          />
          {taxaAnual && parseFloat(taxaAnual) <= 0 && (
            <Text style={globalStyles.errorText}>Taxa deve ser maior que zero</Text>
          )}
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Prazo Máximo (meses)</Text>
          <TextInput
            style={[globalStyles.input, loading && styles.inputDisabled]}
            placeholder="Ex: 60"
            value={prazoMaximo}
            onChangeText={setPrazoMaximo}
            keyboardType="numeric"
            editable={!loading}
            placeholderTextColor={colors.textLight}
          />
          {prazoMaximo && parseInt(prazoMaximo) <= 0 && (
            <Text style={globalStyles.errorText}>Prazo deve ser maior que zero</Text>
          )}
        </View>

        <TouchableOpacity 
          style={[globalStyles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.buttonSecondary, loading && styles.buttonSecondaryDisabled]} 
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={globalStyles.buttonSecondaryText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Estilos específicos da tela
const styles = createStyles({
  inputDisabled: {
    backgroundColor: colors.grayLighter,
    color: colors.textLight,
  },
  
  buttonDisabled: {
    backgroundColor: colors.gray,
    shadowOpacity: 0.1,
  },
  
  buttonSecondaryDisabled: {
    borderColor: colors.gray,
    opacity: 0.6,
  },
});