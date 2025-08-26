import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, View } from 'react-native';
import 'react-native-reanimated';
import { colors } from '../styles';

import { useColorScheme } from '@/hooks/useColorScheme';
import { caixaPalette } from '@/styles/colors';


SplashScreen.preventAutoHideAsync();

// Componente para o logo no header
function HeaderLogo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        source={require('../assets/images/CAIXA_elemento_cor_chapado_positivo.png')}
        style={{
          width: 40,
          height: 40,
          marginRight: 8,
          padding: 4,
          backgroundColor: colors.backgroundDark,
          borderRadius: 16,
         
        }}
        resizeMode="contain"
      />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    // Fontes regulares
    'CAIXAStd-Light': require('../assets/fonts/CAIXAStd-Light.ttf'),
    'CAIXAStd-Regular': require('../assets/fonts/CAIXAStd-Regular.ttf'),
    'CAIXAStd-Book': require('../assets/fonts/CAIXAStd-Book.ttf'),
    'CAIXAStd-SemiBold': require('../assets/fonts/CAIXAStd-SemiBold.ttf'),
    'CAIXAStd-Bold': require('../assets/fonts/CAIXAStd-Bold.ttf'),
    'CAIXAStd-ExtraBold': require('../assets/fonts/CAIXAStd-ExtraBold.ttf'),
    
    // Fontes itálicas
    'CAIXAStd-LightItalic': require('../assets/fonts/CAIXAStd-LightItalic.ttf'),
    'CAIXAStd-Italic': require('../assets/fonts/CAIXAStd-Italic.ttf'),
    'CAIXAStd-BookItalic': require('../assets/fonts/CAIXAStd-BookItalic.ttf'),
    'CAIXAStd-SemiBoldItalic': require('../assets/fonts/CAIXAStd-SemiBoldItalic.ttf'),
    'CAIXAStd-BoldItalic': require('../assets/fonts/CAIXAStd-BoldItalic.ttf'),
    'CAIXAStd-ExtraBoldItalic': require('../assets/fonts/CAIXAStd-ExtraBoldItalic.ttf'),
    
    
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Configuração padrão do header da Caixa
  const defaultHeaderOptions = {
    headerStyle: {
      backgroundColor: caixaPalette.azul_cx_darker_1,
      elevation: 4,
      shadowOpacity: 0.25,
      shadowRadius: 4,
      shadowColor: colors.graphiteLight,
      shadowOffset: { width: 0, height: 2 },
    },
    headerTintColor: colors.textWhite,

    headerBackTitleVisible: false,
    headerLeft: () => <HeaderLogo />,
  };

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: '',
            ...defaultHeaderOptions,
            headerStyle: {
              ...defaultHeaderOptions.headerStyle,
              
            }
          }} 
        />
        <Stack.Screen 
          name="cadastrarProduto" 
          options={{ 
            title: '',
            ...defaultHeaderOptions
          }} 
        />
        <Stack.Screen 
          name="listProdutos" 
          options={{ 
            title: '',
            ...defaultHeaderOptions
          }} 
        />
        <Stack.Screen 
          name="loanSimulation" 
          options={{ 
            title: '',
            ...defaultHeaderOptions
          }} 
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
