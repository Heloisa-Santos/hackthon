export const typography = {
  // Famílias de fonte (usando os nomes corretos das fontes carregadas)
  fontFamily: {
    light: 'CAIXAStd-Light',
    regular: 'CAIXAStd-Regular',
    book: 'CAIXAStd-Book',
    semibold: 'CAIXAStd-SemiBold', 
    bold: 'CAIXAStd-Bold',
    extrabold: 'CAIXAStd-ExtraBold',
    
    // Versões itálicas
    lightItalic: 'CAIXAStd-LightItalic',
    italic: 'CAIXAStd-Italic',
    bookItalic: 'CAIXAStd-BookItalic',
    semiboldItalic: 'CAIXAStd-SemiBoldItalic',
    boldItalic: 'CAIXAStd-BoldItalic',
    extraboldItalic: 'CAIXAStd-ExtraBoldItalic',
    
    // Fallback para sistema
    system: 'System',
  },
  
  // Tamanhos de fonte
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  
  // Pesos de fonte (para fallback quando fonte não estiver disponível)
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Altura de linha
  lineHeight: {
    tight: 16,
    normal: 20,
    relaxed: 24,
    loose: 28,
  },
  
  // Estilos de texto predefinidos
  textStyles: {
    h1: {
      fontSize: 32,
      fontFamily: 'CAIXAStd-Bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontFamily: 'CAIXAStd-Bold', 
      lineHeight: 36,
    },
    h3: {
      fontSize: 24,
      fontFamily: 'CAIXAStd-SemiBold',
      lineHeight: 32,
    },
    subtitle: {
      fontSize: 20,
      fontFamily: 'CAIXAStd-Book',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontFamily: 'CAIXAStd-Regular',
      lineHeight: 24,
    },
    bodyMedium: {
      fontSize: 16,
      fontFamily: 'CAIXAStd-SemiBold',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontFamily: 'CAIXAStd-Regular',
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontFamily: 'CAIXAStd-Regular',
      lineHeight: 16,
    },
  },
};