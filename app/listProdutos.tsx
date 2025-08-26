import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, createStyles, globalStyles } from '../styles';
import { Product } from '../types';
import { mockApi } from '../utils/mockData';

export default function ListProdutos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchText]);

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

  const filterProducts = () => {
    if (!searchText.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product => {
      const searchLower = searchText.toLowerCase();
      
      // Busca por nome do produto
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      
      // Busca por taxa (converte para string)
      const taxaMatch = product.taxaAnual.toString().includes(searchText);
      
      // Busca por prazo (converte para string)
      const prazoMatch = product.prazoMaximo.toString().includes(searchText);
      
      return nameMatch || taxaMatch || prazoMatch;
    });

    setFilteredProducts(filtered);
  };

  const clearSearch = () => {
    setSearchText('');
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

  const renderEmptySearch = () => (
    <View style={globalStyles.centerContainer}>
      <Text style={styles.emptySearchText}>
        Nenhum produto encontrado para "{searchText}"
      </Text>
      <TouchableOpacity 
        style={globalStyles.buttonSecondary}
        onPress={clearSearch}
      >
        <Text style={globalStyles.buttonSecondaryText}>Limpar pesquisa</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyList = () => (
    <View style={globalStyles.centerContainer}>
      <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
      <TouchableOpacity 
        style={globalStyles.button}
        onPress={() => router.push('/cadastrarProduto')}
      >
        <Text style={globalStyles.buttonText}>Cadastrar primeiro produto</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={globalStyles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} testID="activity-indicator" />
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

      {/* Campo de pesquisa */}
      {products.length > 0 && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar por nome, taxa ou prazo..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={colors.textLight}
            />
            {searchText.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {searchText.length > 0 && (
            <Text style={styles.searchResultText}>
              {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      )}

      {products.length === 0 ? (
        renderEmptyList()
      ) : filteredProducts.length === 0 && searchText.length > 0 ? (
        renderEmptySearch()
      ) : (
        <FlatList
          data={filteredProducts}
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
  
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'CAIXAStd-Regular',
    color: colors.textPrimary,
  },
  
  clearButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: colors.grayLighter,
  },
  
  clearButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  
  searchResultText: {
    fontSize: 14,
    fontFamily: 'CAIXAStd-Regular',
    color: colors.textSecondary,
    marginLeft: 5,
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
  
  emptySearchText: {
    fontSize: 16,
    fontFamily: 'CAIXAStd-Regular',
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
});