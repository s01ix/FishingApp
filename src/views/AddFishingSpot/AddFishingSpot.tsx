import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { API_URL } from '../../components/config'; 
import { styles } from './styles'; 
import * as Location from 'expo-location';

const SPOT_TYPES = ['Jezioro', 'Rzeka', 'Staw', 'Zalew', 'Morze', 'Inne'];



export default function AddFishingSpot() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedType, setSelectedType] = useState('Jezioro');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleGoBack = () => navigation.goBack();

  const handleGetLocation = async () => {
    try {
      setIsLoadingLocation(true);      
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Status pozwolenia:', status);
      
      if (status !== 'granted') {
        Alert.alert('Błąd', 'Brak pozwolenia na dostęp do lokalizacji.');
        return;
      }

      console.log('Pobieranie obecnej lokalizacji');
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      console.log('Lokalizacja:', location.coords);
      
      setLatitude(location.coords.latitude.toFixed(6));
      setLongitude(location.coords.longitude.toFixed(6));
      
      Alert.alert('Sukces', 'Pobrano lokalizację GPS!');
      
    } catch (error) {
      console.error('Błąd lokalizacji:', error);
      Alert.alert('Błąd', 'Nie udało się pobrać lokalizacji: ');
    } finally {
      setIsLoadingLocation(false);
    }
  }

  const handleSave = async () => {
    if (!name || !location || !latitude || !longitude) {
      Alert.alert('Błąd', 'Wypełnij wszystkie wymagane pola (Nazwa, Lokalizacja, Współrzędne).');
      return;
    }

    setIsSubmitting(true);

    const newSpot = {
      id: Date.now().toString(), 
      nazwa: name,
      lokalizacja: location,
      opis: description,
      latitude: parseFloat(latitude.replace(',', '.')),
      longitude: parseFloat(longitude.replace(',', '.')),
      rodzaj: selectedType,
      isPublic: true 
    };

    try {
      const response = await fetch(`${API_URL}/fishingSpots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSpot),
      });

      if (!response.ok) {
        throw new Error('Nie udało się zapisać łowiska.');
      }

      Alert.alert('Sukces', 'Dodano nowe łowisko!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
    } catch (error) {
      console.error(error);
      Alert.alert('Błąd', 'Wystąpił problem z połączeniem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dodaj łowisko</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          
          <Text style={styles.label}>Nazwa łowiska *</Text>
          <TextInput
            style={styles.input}
            placeholder="np. Jezioro Tajemnic"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Lokalizacja (Miejscowość) *</Text>
          <TextInput
            style={styles.input}
            placeholder="np. Giżycko, woj. warmińskie"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Rodzaj akwenu</Text>
          <View style={styles.typesRow}>
            {SPOT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeChip,
                  selectedType === type && styles.typeChipActive
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[
                  styles.typeText,
                  selectedType === type && styles.typeTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Współrzędne GPS *</Text>

          <TouchableOpacity 
            style={styles.gpsButton}  
            onPress={handleGetLocation}
            activeOpacity={0.7}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <ActivityIndicator color="#2196F3" size="small" />
            ) : (
              <Text style={styles.gpsIcon}>🎯</Text>
            )}
            <Text style={styles.gpsButtonText}>
              {isLoadingLocation ? 'Pobieranie lokalizacji...' : 'Użyj mojej obecnej lokalizacji'}
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Szer. (Lat)"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: 10 }} />
            <View style={styles.halfInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Dł. (Lon)"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
              />
            </View>
          </View>
          <Text style={styles.hint}>
            Wskazówka: Skopiuj współrzędne z Map Google (np. 52.1234)
          </Text>

          <Text style={styles.label}>Opis i uwagi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Opisz dojazd, głębokość, dominujące ryby..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Zapisz Łowisko</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}