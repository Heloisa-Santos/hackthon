import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { borderRadius, spacing } from './spacing';
import { typography } from './typography';

export const globalStyles = StyleSheet.create({
  // Container padrão
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    marginBottom: spacing.lg,
  },
  
  // Header padrão
  header: {
    padding: spacing.lg,
    paddingTop: spacing['5xl'], // 64px para status bar
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  // Títulos
  title: {
    ...typography.textStyles.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  
  subtitle: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
  },
  
  // Formulários
  form: {
    padding: spacing.lg,
  },
  
  inputGroup: {
    marginBottom: spacing.lg,
  },
  
  label: {
    ...typography.textStyles.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  
  input: {
    backgroundColor: colors.backgroundLight,
    padding: spacing.base - 1, 
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular, 
    color: colors.textPrimary,
  },
  
  // Botões
  button: {
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    padding: spacing.lg + 2, // 18px
    borderRadius: borderRadius.base,
    alignItems: 'center',
    marginTop: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semibold, 
    color: colors.textWhite,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    borderColor: colors.primary,
    padding: spacing.lg + 2, 
    borderRadius: borderRadius.base,
    alignItems: 'center',
    marginTop: spacing.lg,
    shadowOpacity: 0, 
  },
  buttonSecondaryText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semibold,
    color: colors.primary, 
  },
  navButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  // Cards
  card: {
    backgroundColor: colors.backgroundLight,
    padding: spacing.base - 1, // 15px
    borderRadius: borderRadius.base,
    marginBottom: spacing.base - 1, // 15px
    shadowColor: colors.graphite,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: colors.backgroundLight,
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.xl + 1, // 25px
    maxHeight: '90%',
    shadowColor: colors.graphite,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  modalTitle: {
    ...typography.textStyles.h3,
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.textPrimary,
  },
  
  // Utilitários
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
  },
  
  errorText: {
    ...typography.textStyles.caption,
    color: colors.error,
    marginTop: spacing.xs + 1, // 5px
  },
  
  // Texto destacado
  highlightValue: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
  },
  
  // Lista e produtos
  productCard: {
    backgroundColor: colors.backgroundLight,
    padding: spacing.base,
    borderRadius: borderRadius.base,
    marginBottom: spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRightColor: colors.secondary,
    borderRightWidth: 8,
    shadowColor: colors.graphite,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  productInfo: {
    flex: 1,
  },
  
  productName: {
    ...typography.textStyles.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  productDetail: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  
  // Picker customizado
  pickerButton: {
    backgroundColor: colors.backgroundLight,
    padding: spacing.base - 1, // 15px
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  pickerButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    flex: 1,
  },
  
  pickerPlaceholder: {
    color: colors.textLight,
  },
  
  pickerArrow: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  
  // Informações de produto
  productInfoText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.primary,
    marginTop: spacing.xs + 1,
  },
});