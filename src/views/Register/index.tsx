import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../../views/Login/styles'; 
import { API_URL } from '../../components/config';
import { AuthStackParamList } from '../../types/navigation';

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Błąd', 'Hasła nie są identyczne.');
      return;
    }

    setIsLoading(true);

    try {
      const checkUrl = `${API_URL}/users?email=${encodeURIComponent(email)}`;
      const checkResponse = await fetch(checkUrl);
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        Alert.alert('Błąd', 'Taki adres email jest już zarejestrowany.');
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: Date.now().toString(), 
        email: email.trim(),
        username: email.split('@')[0], 
        password: password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        favoriteFish: "Nie podano",
        bio: "Nowy wędkarz w aplikacji!",
      };

      const createResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!createResponse.ok) {
        throw new Error('Nie udało się utworzyć konta.');
      }

      Alert.alert(
        'Sukces', 
        'Konto zostało utworzone! Możesz się teraz zalogować.', 
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );

    } catch (error) {
      console.error(error);
      Alert.alert('Błąd', 'Wystąpił problem z połączeniem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎣 Dołącz do nas!</Text>
        <Text style={styles.subtitle}>Utwórz nowe konto</Text>

        <TextInput
          style={styles.input}
          placeholder="Imię"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Nazwisko"
          value={lastName}
          onChangeText={setLastName}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Potwierdź hasło"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && { opacity: 0.7 }]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Zarejestruj się</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackToLogin}>
          <Text style={styles.link}>Masz już konto? Zaloguj się</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}