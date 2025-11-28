import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useAuth } from '../../types/AuthContext';
import { styles } from './styles';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_BASE_URL = Platform.select({
  android: 'http://10.161.77.16:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
  });

  const handleLogin = async () => {
    const url = `${API_BASE_URL}/users?email=${encodeURIComponent(email)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Błąd sieciowy');
      }
      const users = await response.json();

      if (users.length === 0) {
        Alert.alert('Błąd', 'Nie znaleziono użytkownika o podanym emailu.');
        return;
      }
      
      const user = users[0];

      if (user.password !== password) {
        Alert.alert('Błąd', 'Nieprawidłowe hasło.');
        return;
      }

      try {
        login(user);
      } catch  {
        Alert.alert('Błąd', 'Wystąpił błąd podczas logowania. Spróbuj ponownie.');
      }
    } catch (error) {
      Alert.alert('Błąd', 'Wystąpił błąd podczas logowania. Spróbuj ponownie.');
      console.error('Błąd logowania:', error);
      return;
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

