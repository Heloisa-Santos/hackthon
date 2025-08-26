# EmprestimoApp 💰

Sistema de gestão de produtos de empréstimo desenvolvido com React Native e Expo.

## 🚀 Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o projeto

```bash
npx expo start
```

### 3. Executar no dispositivo

Após iniciar o projeto, você pode executá-lo em:

- **📱 Expo Go**: Escaneie o QR code com o app Expo Go
- **🤖 Android**: Pressione `a` no terminal para abrir no emulador Android
- **🍎 iOS**: Pressione `i` no terminal para abrir no simulador iOS (apenas macOS)
- **🌐 Web**: Pressione `w` no terminal para abrir no navegador

## 🧪 Executar testes

### Executar todos os testes:
```bash
npm test
```

### Executar testes em modo watch:
```bash
npm run test:watch
```

### Executar testes com relatório de cobertura:
```bash
npm run test:coverage
```

### Executar testes específicos:
```bash
# Teste do cadastro de produtos
npm test cadastrarProduto.test.tsx

# Teste da listagem de produtos
npm test listProdutos.test.tsx

# Teste da simulação de empréstimos
npm test loanSimulation.test.tsx
```

## 🔧 Comandos úteis

```bash
# Limpar cache do Expo
npx expo start --clear

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar na web
npm run web
```

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Para Android: [Android Studio](https://developer.android.com/studio)
- Para iOS: [Xcode](https://developer.apple.com/xcode/) (apenas macOS)
