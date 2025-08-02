import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  item: {
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    paddingVertical: 8,
    minHeight: 56,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  secondary: {
    fontSize: 11,
    color: '#9E9E9E',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 16,
    elevation: 4,
  },

  sectionHeader: {
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  card: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  input: {
    marginBottom: 12,
    borderRadius: 8,
  },
  addButton: {
    marginTop: 16,
  },
  saveButton: {
    marginTop: 16,
  },
  deleteButton: {
    marginTop: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 12,
  },
});

