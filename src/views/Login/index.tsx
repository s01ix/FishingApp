import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../types/AuthContext';
import { styles } from './styles';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola');
      return;
    }
    try {
      login(email, password);
    } catch (error) {
      Alert.alert('Błąd logowania', 'Nieprawidłowy login lub hasło');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎣 Fishing App</Text>
      <Text style={styles.subtitle}>Zaloguj się</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Zaloguj</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>Nie masz konta? Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

