import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
  position: 'absolute',
  margin: 16,
  right: 16,
  bottom: 16,
  backgroundColor: '#007bff',
},

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  card: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  input: {
    marginBottom: 12,
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#2563EB',
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#2563EB',
  },
  deleteButton: {
    marginTop: 16,
    backgroundColor: '#DC2626',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

