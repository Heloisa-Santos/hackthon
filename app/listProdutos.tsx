import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { colors, createStyles, globalStyles } from '../styles';
import { Product } from '../types';
import { mockApi } from '../utils/mockData';

export default function ListProdutos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await mockApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await mockApi.deleteProduct(id);
              await fetchProducts(); // Recarregar lista
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o produto');
            }
          }
        }
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={globalStyles.productCard}>
      <View style={globalStyles.productInfo}>
        <Text style={globalStyles.productName}>{item.name}</Text>
        <Text style={globalStyles.productDetail}>Taxa: {item.taxaAnual}% ao ano</Text>
        <Text style={globalStyles.productDetail}>Prazo máximo: {item.prazoMaximo} meses</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id, item.name)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={globalStyles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.header, styles.listHeader]}>
        <Text style={globalStyles.title}>Lista de Produtos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/cadastrarProduto')}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <View style={globalStyles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
          <TouchableOpacity 
            style={globalStyles.button}
            onPress={() => router.push('/cadastrarProduto')}
          >
            <Text style={globalStyles.buttonText}>Cadastrar primeiro produto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// Estilos específicos da tela
const styles = createStyles({
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  addButtonText: {
    color: colors.textWhite,
    fontFamily: 'CAIXAStd-SemiBold',
    fontSize: 14,
  },
  
  listContainer: {
    padding: 20,
  },
  
  deleteButton: {
    padding: 10,
    borderRadius: 8,
  },
  
  deleteButtonText: {
    fontSize: 20,
  },
  
  emptyText: {
    fontSize: 18,
    fontFamily: 'CAIXAStd-Regular',
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
});