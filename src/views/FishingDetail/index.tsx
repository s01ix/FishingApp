import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { styles } from './styles';

// Typy danych
interface FishingSpot {
  id: string;
  nazwa: string;
  lokalizacja: string;
  latitude: number;
  longitude: number;
}

interface CaughtFish {
  id: string;
  zdjecie?: string;
  gatunek: string;
  nazwa: string;
  waga: number;
  dlugosc: number;
  godzina: string;
  przyneta: string;
  notatki?: string;
}

interface FishingSession {
  id: string;
  data: string;
  godzinaRozpoczecia: string;
  godzinaZakonczenia?: string;
  lowisko: FishingSpot;
  ryby: CaughtFish[];
  pogoda?: string;
  temperatura?: number;
  notatki?: string;
}

export default function FishingDetail() {
  // Przykładowe dane połowu
  const [polowData] = useState<FishingSession>({
    id: '#12345',
    data: '15.01.2024',
    godzinaRozpoczecia: '06:30',
    godzinaZakonczenia: '14:45',
    lowisko: {
      id: '1',
      nazwa: 'Jezioro Białe',
      lokalizacja: 'Okuninka, woj. lubelskie',
      latitude: 51.3032,
      longitude: 23.1248,
    },
    pogoda: 'Słonecznie',
    temperatura: 18,
    ryby: [
      {
        id: '1',
        zdjecie: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
        gatunek: 'Karp',
        nazwa: 'Karpik',
        waga: 5.2,
        dlugosc: 65,
        godzina: '08:15',
        przyneta: 'Kukurydza',
        notatki: 'Ciężko było złapać, walczył przez 15 minut!',
      },
      {
        id: '2',
        zdjecie: 'https://images.unsplash.com/photo-1520990683880-f48dcc6148de?w=400',
        gatunek: 'Szczupak',
        nazwa: 'Szczupaczek',
        waga: 3.8,
        dlugosc: 58,
        godzina: '10:30',
        przyneta: 'Błystka',
      },
      {
        id: '3',
        gatunek: 'Karp',
        nazwa: 'Mały karp',
        waga: 2.1,
        dlugosc: 42,
        godzina: '13:20',
        przyneta: 'Robak',
      },
    ],
    notatki: 'Świetny dzień! Woda była czysta, dużo brań. Polecam stanowisko przy pomoście.',
  });

  const handleGoBack = () => {
    console.log('Powrót do listy');
    // navigation.goBack()
  };

  const handleEdit = () => {
    console.log('Edycja połowu:', polowData.id);
    // navigation.navigate('EditFishing', { sessionId: polowData.id })
  };

  const handleDelete = () => {
    Alert.alert(
      'Usunąć połów?',
      'Czy na pewno chcesz usunąć ten połów? Operacja jest nieodwracalna.',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          onPress: () => {
            console.log('Usuwanie połowu:', polowData.id);
            // Logika usuwania
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleFishPress = (fishId: string) => {
    console.log('Szczegóły ryby:', fishId);
    // navigation.navigate('FishDetail', { fishId })
  };

  const openMaps = (latitude: number, longitude: number, label: string): void => {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url as string).catch(() => {
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
      Linking.openURL(webUrl);
    });
  };

  // Obliczenia statystyk
  const getTotalWeight = (): number => {
    return polowData.ryby.reduce((sum, fish) => sum + fish.waga, 0);
  };

  const getBiggestFish = (): CaughtFish | null => {
    if (polowData.ryby.length === 0) return null;
    return polowData.ryby.reduce((max, fish) => (fish.waga > max.waga ? fish : max));
  };

  const getAverageWeight = (): number => {
    if (polowData.ryby.length === 0) return 0;
    return getTotalWeight() / polowData.ryby.length;
  };

  const getDuration = (): string => {
    if (!polowData.godzinaZakonczenia) return 'W trakcie...';
    
    const [startH, startM] = polowData.godzinaRozpoczecia.split(':').map(Number);
    const [endH, endM] = polowData.godzinaZakonczenia.split(':').map(Number);
    
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const diffMinutes = endMinutes - startMinutes;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours}h ${minutes}min`;
  };

  const biggestFish = getBiggestFish();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Połów {polowData.id}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Główne informacje */}
        <View style={styles.mainInfo}>
          <Text style={styles.date}>{polowData.data}</Text>
          <View style={styles.timeRow}>
            <Text style={styles.time}>
              🕐 {polowData.godzinaRozpoczecia}
              {polowData.godzinaZakonczenia && ` - ${polowData.godzinaZakonczenia}`}
            </Text>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{getDuration()}</Text>
            </View>
          </View>
        </View>

        {/* Łowisko */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Łowisko</Text>
          <View style={styles.spotCard}>
            <View style={styles.spotInfo}>
              <Text style={styles.spotName}>{polowData.lowisko.nazwa}</Text>
              <Text style={styles.spotLocation}>
                📍 {polowData.lowisko.lokalizacja}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() =>
                openMaps(
                  polowData.lowisko.latitude,
                  polowData.lowisko.longitude,
                  polowData.lowisko.nazwa
                )
              }
            >
              <Text style={styles.mapIcon}>🗺️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Warunki */}
        {(polowData.pogoda || polowData.temperatura) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Warunki</Text>
            <View style={styles.conditionsCard}>
              {polowData.pogoda && (
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionIcon}>☀️</Text>
                  <Text style={styles.conditionText}>{polowData.pogoda}</Text>
                </View>
              )}
              {polowData.temperatura && (
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionIcon}>🌡️</Text>
                  <Text style={styles.conditionText}>{polowData.temperatura}°C</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Statystyki */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statystyki</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🎣</Text>
              <Text style={styles.statValue}>{polowData.ryby.length}</Text>
              <Text style={styles.statLabel}>Liczba ryb</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⚖️</Text>
              <Text style={styles.statValue}>{getTotalWeight().toFixed(2)} kg</Text>
              <Text style={styles.statLabel}>Łączna waga</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statValue}>{getAverageWeight().toFixed(2)} kg</Text>
              <Text style={styles.statLabel}>Średnia waga</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🏆</Text>
              <Text style={styles.statValue}>
                {biggestFish ? `${biggestFish.waga} kg` : '-'}
              </Text>
              <Text style={styles.statLabel}>Największa</Text>
            </View>
          </View>
        </View>

        {/* Lista złowionych ryb */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Złowione ryby ({polowData.ryby.length})
          </Text>
          {polowData.ryby.map((fish) => (
            <TouchableOpacity
              key={fish.id}
              style={styles.fishCard}
              onPress={() => handleFishPress(fish.id)}
              activeOpacity={0.7}
            >
              {fish.zdjecie && (
                <Image source={{ uri: fish.zdjecie }} style={styles.fishImage} />
              )}
              <View style={styles.fishInfo}>
                <View style={styles.fishHeader}>
                  <Text style={styles.fishName}>{fish.nazwa}</Text>
                  <Text style={styles.fishTime}>{fish.godzina}</Text>
                </View>
                <Text style={styles.fishSpecies}>{fish.gatunek}</Text>
                <View style={styles.fishStats}>
                  <Text style={styles.fishStat}>⚖️ {fish.waga} kg</Text>
                  <Text style={styles.fishStat}>📏 {fish.dlugosc} cm</Text>
                  <Text style={styles.fishStat}>🎣 {fish.przyneta}</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notatki */}
        {polowData.notatki && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notatki</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesIcon}>📝</Text>
              <Text style={styles.notesText}>{polowData.notatki}</Text>
            </View>
          </View>
        )}

        {/* Akcje */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>✏️ Edytuj</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>🗑️ Usuń</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}