import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../types/AuthContext';
import { styles } from '../EditProfile/styles';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [favoriteFish, setFavoriteFish] = useState(user?.favoriteFish ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Błąd', 'Imię i nazwisko są wymagane.');
      return;
    }

    try {
      if (updateUser) {
        updateUser({
          ...user,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          favoriteFish: favoriteFish.trim(),
          bio: bio.trim(),
        });
        Alert.alert("Sukces", "Profil został zaktualizowany");
        navigation.goBack();
      }
    } catch (error) {
      console.error('Błąd aktualizacji profilu:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować profilu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Wróć</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edytuj profil</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Imię</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Wpisz imię"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nazwisko</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Wpisz nazwisko"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ulubiona ryba</Text>
          <TextInput
            style={styles.input}
            value={favoriteFish}
            onChangeText={setFavoriteFish}
            placeholder="Np. Karp, Szczupak"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Opowiedz coś o sobie..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Anuluj</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}