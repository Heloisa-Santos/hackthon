import { Link } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { colors, createStyles, globalStyles } from '../styles';

export default function HomeScreen() {
  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.header, styles.homeHeader]}>
      <Image 
          source={require('../assets/images/icon.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={globalStyles.subtitle}>Caixa Econômica Federal</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Link href="/cadastrarProduto" style={[globalStyles.button, styles.navButton]}>
          <Text style={[globalStyles.buttonText, styles.navButtonText]}>Cadastrar Novo Produto</Text>
        </Link>
        
        <Link href="/listProdutos" style={[globalStyles.button, styles.navButton]}>
          <Text style={[globalStyles.buttonText, styles.navButtonText]}>Listar Produtos</Text>
        </Link>
        
        <Link href="/loanSimulation" style={[globalStyles.button, styles.navButton]}>
          <Text style={[globalStyles.buttonText, styles.navButtonText]}>Simular Empréstimo</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = createStyles({
  homeHeader: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 2,
  },
  
  navButton: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 16,
  },
  
  navButtonText: {
    fontSize: 16,
    fontFamily: 'CAIXAStd-SemiBold',
    color: colors.textWhite,
    textAlign: 'center',
    lineHeight: 20,
  },
  logoImage:{
    width: 100,
    height: 100,
    padding:10,
    marginBottom: 10,
  }
});