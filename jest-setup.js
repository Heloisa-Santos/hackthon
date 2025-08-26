import '@testing-library/jest-native/extend-expect';

// Mock do Expo Router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
  Link: 'Link',
}));

// Mock do Expo Font
jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

// Mock do Expo Splash Screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// Mock das imagens
jest.mock('@/assets/images/CAIXA_elemento_cor_chapado_positivo.png', () => 'test-image');

// Mock do useColorScheme
jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

// Suprimir warnings do React Native
jest.mock('react-native/Libraries/LogBox/LogBox');

// Mock global do Alert
global.alert = jest.fn();