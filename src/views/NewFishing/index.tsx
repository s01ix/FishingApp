import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  Platform,
  TextInput,
  FlatList,
} from 'react-native';
import { styles } from './styles';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../types/AuthContext';
import {API_URL} from '../../components/config';


// Import typów z innych ekranów
interface FishingSpot {
  id: string;
  nazwa: string;
  lokalizacja: string;
}

interface CaughtFish {
  id: string;
  gatunek: string;
  nazwa: string;
  waga: number;
  dlugosc: number;
  godzina: string;
  przyneta: string;
  notatki?: string;
}

export default function NewFishing() {
  const { user } = useAuth();



  const [currentDate] = useState(new Date());
  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null);
  const [caughtFishes, setCaughtFishes] = useState<CaughtFish[]>([]);
  const [showSpotPicker, setShowSpotPicker] = useState(false);

  //stany dla modala dodawania ryby
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempSpecies, setTempSpecies] = useState('');
  const [tempWeight, setTempWeight] = useState('');
  const [tempLength, setTempLength] = useState('');
  const [tempBait, setTempBait] = useState('');
//funkcje dla modala dodawania ryby
const openAddFishModal = () => {
    // Czyścimy pola przed otwarciem
    setTempSpecies('');
    setTempWeight('');
    setTempLength('');
    setTempBait('');
    setModalVisible(true);
  };
// Zapisz rybę z modala
const saveFishFromModal = () => {
    if (!tempSpecies || !tempWeight) {
      Alert.alert("Błąd", "Podaj przynajmniej gatunek i wagę ryby.");
      return;
    }
    // Tworzenie obiektu ryby
    const newFish: CaughtFish = {
      id: Date.now().toString(),
      gatunek: tempSpecies,
      nazwa: tempSpecies,
      waga: parseFloat(tempWeight.replace(',', '.')), 
      dlugosc: parseFloat(tempLength.replace(',', '.')) || 0,
      godzina: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      przyneta: tempBait || 'Brak',
      notatki: ''
    };

    // Dodanie do listy
    setCaughtFishes([...caughtFishes, newFish]);
    
    // Zamknięcie modala
    setModalVisible(false);
  };

  // Przykładowe łowiska
  const availableSpots: FishingSpot[] = [
    {
      id: '1',
      nazwa: 'Jezioro Białe',
      lokalizacja: 'Okuninka, woj. lubelskie',
    },
    {
      id: '2',
      nazwa: 'Zalew Zegrzyński',
      lokalizacja: 'Nieporęt, woj. mazowieckie',
    },
    {
      id: '3',
      nazwa: 'Staw Kowalski',
      lokalizacja: 'Kowal, woj. kujawsko-pomorskie',
    },
  ];

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

const navigation = useNavigation();

const handleGoBack = () => {
  if (caughtFishes.length > 0) {
    Alert.alert(
      'Czy na pewno?',
      'Masz niezapisane dane. Czy chcesz wyjść?',
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Wyjdź', onPress: () => navigation.goBack(), style: 'destructive' },
      ]
    );
  } else {
    navigation.goBack();
  }
};


  const handleSave = async () => {
    if (!selectedSpot) {
      Alert.alert('Błąd', 'Wybierz łowisko');
      return;
    }

    if (caughtFishes.length === 0) {
      Alert.alert('Błąd', 'Dodaj przynajmniej jedną rybę');
      return;
    }

    if (!user) {
      Alert.alert('Błąd', 'Nie jesteś zalogowany');
      return;
    }
    
    const newTrip = {
      userId: user.id,           
      date: formatDate(currentDate),
      startTime: formatTime(currentDate),
      spotId: selectedSpot.id,   
      spotName: selectedSpot.nazwa,
      spotLocation: selectedSpot.lokalizacja,
      catches: caughtFishes 
    };

    try {
      //Wysłanie zapytania do serwera
      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrip),
      });

      if (response.ok) {
        //udało się zapisać
        Alert.alert('Sukces', 'Połów został zapisany w bazie!', [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          },
        ]);
      } else {
        throw new Error('Serwer zwrócił błąd');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Błąd', 'Nie udało się połączyć z serwerem json-server.');
    }
  };

  const handleRemoveFish = (fishId: string) => {
    Alert.alert(
      'Usunąć rybę?',
      'Czy na pewno chcesz usunąć tę rybę z połowu?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          onPress: () => {
            setCaughtFishes(caughtFishes.filter((f) => f.id !== fishId));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleSpotSelect = (spot: FishingSpot) => {
    setSelectedSpot(spot);
    setShowSpotPicker(false);
  };

  const renderFishItem = (fish: CaughtFish) => (
    <View key={fish.id} style={styles.fishCard}>
      <View style={styles.fishInfo}>
        <Text style={styles.fishName}>{fish.nazwa}</Text>
        <Text style={styles.fishSpecies}>{fish.gatunek}</Text>
        <View style={styles.fishStats}>
          <Text style={styles.fishStat}>⚖️ {fish.waga} kg</Text>
          <Text style={styles.fishStat}>📏 {fish.dlugosc} cm</Text>
          <Text style={styles.fishStat}>🕐 {fish.godzina}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeFishButton}
        onPress={() => handleRemoveFish(fish.id)}
      >
        <Text style={styles.removeFishIcon}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>×</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nowy Połów</Text>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!selectedSpot || caughtFishes.length === 0) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!selectedSpot || caughtFishes.length === 0}
        >
          <Text
            style={[
              styles.saveButtonText,
              (!selectedSpot || caughtFishes.length === 0) &&
                styles.saveButtonTextDisabled,
            ]}
          >
            Zapisz
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Informacje o połowie */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informacje</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Data</Text>
                <Text style={styles.infoValue}>{formatDate(currentDate)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🕐</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Rozpoczęcie</Text>
                <Text style={styles.infoValue}>{formatTime(currentDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Wybór łowiska */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Łowisko</Text>

          <TouchableOpacity
            style={styles.spotSelector}
            onPress={() => setShowSpotPicker(true)}
          >
            {selectedSpot ? (
              <View style={styles.selectedSpot}>
                <View>
                  <Text style={styles.selectedSpotName}>{selectedSpot.nazwa}</Text>
                  <Text style={styles.selectedSpotLocation}>
                    📍 {selectedSpot.lokalizacja}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            ) : (
              <View style={styles.placeholderSpot}>
                <Text style={styles.placeholderIcon}>📍</Text>
                <Text style={styles.placeholderText}>Wybierz łowisko</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Lista złowionych ryb */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Złowione ryby ({caughtFishes.length})
            </Text>
          </View>

          {caughtFishes.length === 0 ? (
            <View style={styles.emptyFishList}>
              <Text style={styles.emptyIcon}>🎣</Text>
              <Text style={styles.emptyText}>
                Dodaj swoją pierwszą rybę do połowu
              </Text>
            </View>
          ) : (
            <View style={styles.fishList}>
              {caughtFishes.map(renderFishItem)}
            </View>
          )}

          <TouchableOpacity style={styles.addFishButton} onPress={openAddFishModal}>
            <Text style={styles.addFishIcon}>+</Text>
            <Text style={styles.addFishText}>Dodaj rybę</Text>
          </TouchableOpacity>
        </View>

        {/* Podsumowanie */}
        {caughtFishes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Podsumowanie</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Liczba ryb:</Text>
                <Text style={styles.summaryValue}>{caughtFishes.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Łączna waga:</Text>
                <Text style={styles.summaryValue}>
                  {caughtFishes.reduce((sum, fish) => sum + fish.waga, 0).toFixed(2)} kg
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Największa ryba:</Text>
                <Text style={styles.summaryValue}>
                  {Math.max(...caughtFishes.map((f) => f.waga)).toFixed(2)} kg
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal wyboru łowiska */}
      <Modal
        visible={showSpotPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSpotPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Wybierz łowisko</Text>
              <TouchableOpacity onPress={() => setShowSpotPicker(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableSpots}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.spotOption}
                  onPress={() => handleSpotSelect(item)}
                >
                  <View>
                    <Text style={styles.spotOptionName}>{item.nazwa}</Text>
                    <Text style={styles.spotOptionLocation}>
                      📍 {item.lokalizacja}
                    </Text>
                  </View>
                  {selectedSpot?.id === item.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.addNewSpotButton}
              onPress={() => {
                setShowSpotPicker(false);
                console.log('Dodaj nowe łowisko');
              }}
            >
              <Text style={styles.addNewSpotText}>+ Dodaj nowe łowisko</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal dodawania ryby */}
      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.centeredModalOverlay}>
          <View style={styles.fishModalContainer}>
            <Text style={styles.fishModalTitle}>Dodaj Rybę</Text>

            <Text style={styles.inputLabel}>Gatunek *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="np. Karp, Szczupak" 
              value={tempSpecies}
              onChangeText={setTempSpecies}
            />

            <View style={styles.inputRow}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.inputLabel}>Waga (kg) *</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="0.0" 
                  keyboardType="numeric"
                  value={tempWeight}
                  onChangeText={setTempWeight}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Długość (cm)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="0" 
                  keyboardType="numeric"
                  value={tempLength}
                  onChangeText={setTempLength}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Przynęta</Text>
            <TextInput 
              style={styles.input} 
              placeholder="np. Kukurydza" 
              value={tempBait}
              onChangeText={setTempBait}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtnCancel}>
                <Text style={styles.btnTextBlack}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveFishFromModal} style={styles.modalBtnAdd}>
                <Text style={styles.btnTextWhite}>Dodaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}