import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { colors, createStyles, globalStyles } from '../styles';

export default function HomeScreen() {
  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.header, styles.homeHeader]}>
        <Image 
          source={require('../assets/images/caixa_logo_volume_positiva .png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Link href="/cadastrarProduto" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons 
              name="add-circle-outline" 
              size={24} 
              color={colors.textPrimary} 
              style={styles.buttonIcon} 
            />
            <Text style={styles.navButtonText}>
              Cadastrar Novo Produto
            </Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/listProdutos" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons 
              name="list-outline" 
              size={24} 
              color={colors.textPrimary} 
              style={styles.buttonIcon} 
            />
            <Text style={styles.navButtonText}>
              Listar Produtos
            </Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/loanSimulation" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons 
              name="calculator-outline" 
              size={24} 
              color={colors.textPrimary} 
              style={styles.buttonIcon} 
            />
            <Text style={styles.navButtonText}>
              Simular Empréstimo
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = createStyles({
  homeHeader: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
    paddingTop: 0,
  },
  
  logoImage: {
    width: "80%",
    height: undefined,
    aspectRatio: 4,
    alignSelf: 'center',
    marginBottom: 20,
  },
  
  buttonContainer: {
    flex: 1,
    
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  
  navButton: {
    backgroundColor: colors.backgroundDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftColor: colors.primary,
    borderLeftWidth: 8,
    width: '100%',
    maxWidth: 400,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  
  buttonIcon: {
    marginRight: 12,
    
  },
  
  navButtonText: {
    fontSize: 16,
    fontFamily: 'CAIXAStd-SemiBold',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
});