import React, { useState, useCallback } from "react";
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
  ActivityIndicator,
  Image,
} from "react-native";
import { styles } from "./styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../types/AuthContext";
import { API_URL } from "../../components/config";
import { SpotsStackParamList } from "../../types/navigation";

interface FishingSpot {
  id: string;
  nazwa: string;
  lokalizacja: string;
}

interface CaughtFish {
  id: string;
  tripId?: string;
  gatunek: string;
  nazwa: string;
  waga: number;
  dlugosc: number;
  godzina: string;
  przyneta: string;
  notatki?: string;
  zdjecie?: string;
}

export default function NewFishing() {
  const { user, refreshUserData } = useAuth();

  const navigation = useNavigation<any>();

  const [currentDate] = useState(new Date());

  const [spots, setSpots] = useState<FishingSpot[]>([]);
  const [isLoadingSpots, setIsLoadingSpots] = useState(false);

  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null);
  const [caughtFishes, setCaughtFishes] = useState<CaughtFish[]>([]);
  const [showSpotPicker, setShowSpotPicker] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [tempSpecies, setTempSpecies] = useState("");
  const [tempWeight, setTempWeight] = useState("");
  const [tempLength, setTempLength] = useState("");
  const [tempBait, setTempBait] = useState("");
  const [tempNotes, setTempNotes] = useState("");
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchSpots = async () => {
        setIsLoadingSpots(true);
        try {
          const response = await fetch(`${API_URL}/fishingSpots`);
          
          if (!response.ok) {
            throw new Error('Błąd pobierania łowisk');
          }
          
          const data = await response.json();
          setSpots(data);
        } catch (error) {
          console.error('Błąd pobierania łowisk:', error);
          Alert.alert('Błąd', 'Nie udało się pobrać listy łowisk.');
          setSpots([]);
        } finally {
          setIsLoadingSpots(false);
        }
      };

      fetchSpots();
    }, [])
  );

  const openAddFishModal = () => {
    setTempSpecies("");
    setTempWeight("");
    setTempLength("");
    setTempBait("");
    setTempNotes("");
    setTempPhoto(null);
    setModalVisible(true);
  };

  //Wybór zdjęcia z galerii
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      setTempPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  // Zrobienie zdjęcia aparatem
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Brak zgody",
        "Musisz zezwolić aplikacji na dostęp do aparatu!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      setTempPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const saveFishFromModal = () => {
    if (!tempSpecies || !tempWeight) {
      Alert.alert("Błąd", "Podaj przynajmniej gatunek i wagę ryby.");
      return;
    }
    const newFish: CaughtFish = {
      id: Date.now().toString(),
      gatunek: tempSpecies,
      nazwa: tempSpecies,
      waga: parseFloat(tempWeight.replace(",", ".")),
      dlugosc: parseFloat(tempLength.replace(",", ".")) || 0,
      godzina: new Date().toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      przyneta: tempBait || "Brak",
      notatki: tempNotes || "",
      zdjecie: tempPhoto || undefined,
    };

    setCaughtFishes([...caughtFishes, newFish]);
    setModalVisible(false);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleGoBack = () => {
    if (caughtFishes.length > 0) {
      Alert.alert("Czy na pewno?", "Masz niezapisane dane. Czy chcesz wyjść?", [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Wyjdź",
          onPress: () => navigation.goBack(),
          style: "destructive",
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!selectedSpot) {
      Alert.alert("Błąd", "Wybierz łowisko");
      return;
    }

    if (caughtFishes.length === 0) {
      Alert.alert("Błąd", "Dodaj przynajmniej jedną rybę");
      return;
    }

    if (!user) {
      Alert.alert("Błąd", "Nie jesteś zalogowany");
      return;
    }

    try {
      // Najpierw zapisz trip bez catches żeby dostać ID
      const newTripWithoutCatches = {
        userId: user.id,
        date: formatDate(currentDate),
        startTime: formatTime(currentDate),
        spotId: selectedSpot.id,
        spotName: selectedSpot.nazwa,
        spotLocation: selectedSpot.lokalizacja,
        catches: [],
      };

      const tripResponse = await fetch(`${API_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTripWithoutCatches),
      });

      if (!tripResponse.ok) {
        throw new Error('Błąd zapisywania połowu');
      }

      const savedTrip = await tripResponse.json();
      const tripId = savedTrip.id;

      // Dodaj tripId do każdej ryby
      const catchesWithTripId = caughtFishes.map((fish) => ({
        ...fish,
        tripId: tripId,
      }));

      // Zaktualizuj trip z rybami
      const updateResponse = await fetch(`${API_URL}/trips/${tripId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ catches: catchesWithTripId }),
      });

      if (!updateResponse.ok) {
        throw new Error('Błąd aktualizacji danych');
      }

      // Odśwież dane użytkownika
      await refreshUserData?.();

      Alert.alert("Sukces", "Połów został zapisany w bazie!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Błąd zapisywania połowu:', error);
      Alert.alert("Błąd", "Nie udało się zapisać połowu. Sprawdź połączenie internetowe.");
    }
  };

  const handleRemoveFish = (fishId: string) => {
    Alert.alert(
      "Usunąć rybę?",
      "Czy na pewno chcesz usunąć tę rybę z połowu?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          onPress: () => {
            setCaughtFishes(caughtFishes.filter((f) => f.id !== fishId));
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleSpotSelect = (spot: FishingSpot) => {
    setSelectedSpot(spot);
    setShowSpotPicker(false);
  };

  const handleAddNewSpot = () => {
    setShowSpotPicker(false);
    try {
      navigation.navigate("SpotsTab", { screen: "AddFishingSpot" });
    } catch (e) {
      navigation.navigate("AddFishingSpot");
    }
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
            (!selectedSpot || caughtFishes.length === 0) &&
              styles.saveButtonDisabled,
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Łowisko</Text>

          <TouchableOpacity
            style={styles.spotSelector}
            onPress={() => setShowSpotPicker(true)}
          >
            {selectedSpot ? (
              <View style={styles.selectedSpot}>
                <View>
                  <Text style={styles.selectedSpotName}>
                    {selectedSpot.nazwa}
                  </Text>
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

          <TouchableOpacity
            style={styles.addFishButton}
            onPress={openAddFishModal}
          >
            <Text style={styles.addFishIcon}>+</Text>
            <Text style={styles.addFishText}>Dodaj rybę</Text>
          </TouchableOpacity>
        </View>

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
                  {caughtFishes
                    .reduce((sum, fish) => sum + fish.waga, 0)
                    .toFixed(2)}{" "}
                  kg
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

            {isLoadingSpots ? (
              <ActivityIndicator
                size="large"
                color="#2c5f2d"
                style={{ margin: 20 }}
              />
            ) : (
              <FlatList
                data={spots}
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
                ListEmptyComponent={
                  <Text
                    style={{ textAlign: "center", padding: 20, color: "gray" }}
                  >
                    Brak dostępnych łowisk. Dodaj nowe!
                  </Text>
                }
              />
            )}

            <TouchableOpacity
              style={styles.addNewSpotButton}
              onPress={handleAddNewSpot}
            >
              <Text style={styles.addNewSpotText}>+ Dodaj nowe łowisko</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.centeredModalOverlay}>
          <View style={styles.fishModalContainer}>
            <Text style={styles.fishModalTitle}>Dodaj Rybę</Text>

            {/* --- Gatunki --- */}
            <Text style={styles.inputLabel}>Gatunek *</Text>
            <TextInput
              style={styles.input}
              placeholder="np. Karp, Szczupak"
              value={tempSpecies}
              onChangeText={setTempSpecies}
            />

            {/* --- Waga i Długość --- */}
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

            {/* --- Przynęta --- */}
            <Text style={styles.inputLabel}>Przynęta</Text>
            <TextInput
              style={styles.input}
              placeholder="np. Kukurydza"
              value={tempBait}
              onChangeText={setTempBait}
            />

            {/* --- Notatki --- */}
            <Text style={styles.inputLabel}>Notatki</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Dodatkowe informacje"
              value={tempNotes}
              onChangeText={setTempNotes}
              multiline={true}
              numberOfLines={3}
            />

            {/* --- Zdjęcia --- */}
            <View style={styles.photoSection}>
              <Text
                style={[
                  styles.inputLabel,
                  { alignSelf: "flex-start", marginTop: 10 },
                ]}
              >
                Zdjęcie
              </Text>

              {tempPhoto ? (
                <View style={styles.previewContainer}>
                  <Image
                    source={{ uri: tempPhoto }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity onPress={() => setTempPhoto(null)}>
                    <Text style={styles.removePhotoText}>Usuń zdjęcie 🗑️</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photoOptionsRow}>
                  <TouchableOpacity
                    onPress={pickPhoto}
                    style={styles.photoButton}
                  >
                    <Text style={styles.photoButtonText}>Galeria</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={takePhoto}
                    style={styles.photoButton}
                  >
                    <Text style={styles.photoButtonText}>Aparat</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* --- Przyciski Anuluj i Dodaj --- */}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalBtnCancel}
              >
                <Text style={styles.btnTextBlack}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveFishFromModal}
                style={styles.modalBtnAdd}
              >
                <Text style={styles.btnTextWhite}>Dodaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
