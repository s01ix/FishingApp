import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  link: {
    color: '#2E7D32',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default styles;