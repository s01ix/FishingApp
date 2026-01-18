import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../types/AuthContext';
import { styles } from './styles';
import { API_URL } from '../../components/config';
import { calculateUserStats } from '../../components/statsCalculator';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';

export default function LoginScreen() {
  const { login } = useAuth();
  
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola.');
      return;
    }

    const url = `${API_URL}/users?email=${encodeURIComponent(email)}&_embed=trips`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Błąd sieciowy');
      
      const users = await response.json();

      if (users.length === 0) {
        Alert.alert('Błąd', 'Nie znaleziono użytkownika.');
        return;
      }
      
      const rawUser = users[0];

      if (rawUser.password !== password) {
        Alert.alert('Błąd', 'Nieprawidłowe hasło.');
        return;
      }

      const processedUser = calculateUserStats(rawUser);

      login(processedUser);

    } catch (error) {
      Alert.alert('Błąd', 'Wystąpił problem z logowaniem.');
      console.error(error);
    }
  };
  
  const handleRegisterNavigation = () => {
    navigation.navigate('Register');
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

      <TouchableOpacity onPress={handleRegisterNavigation}>
        <Text style={styles.link}>Nie masz konta? Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}