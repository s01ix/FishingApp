import React from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
  ListRenderItem,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { styles } from './styles';

// Typ dla łowiska
export interface FishingSpot {
  id: string;
  nazwa: string;
  lokalizacja: string;
  opis: string;
  latitude: number;
  longitude: number;
  rodzaj?: string; // np. "Jezioro", "Rzeka", "Staw"
  liczbaPolowan?: number; // ile razy użytkownik łowił w tym miejscu
}

export default function FishingSpots() {
  // Przykładowe dane - lista łowisk
  const lowiska: FishingSpot[] = [
    {
      id: '1',
      nazwa: 'Jezioro Białe',
      lokalizacja: 'Okuninka, woj. lubelskie',
      opis: 'Świetne miejsce na karpia i szczupaka',
      latitude: 51.3032,
      longitude: 23.1248,
      rodzaj: 'Jezioro',
      liczbaPolowan: 12,
    },
    {
      id: '2',
      nazwa: 'Zalew Zegrzyński',
      lokalizacja: 'Nieporęt, woj. mazowieckie',
      opis: 'Duże łowisko z różnorodnością gatunków',
      latitude: 52.4667,
      longitude: 21.0500,
      rodzaj: 'Zalew',
      liczbaPolowan: 8,
    },
    {
      id: '3',
      nazwa: 'Staw Kowalski',
      lokalizacja: 'Kowal, woj. kujawsko-pomorskie',
      opis: 'Prywatne łowisko, spokojne miejsce',
      latitude: 52.5167,
      longitude: 18.8833,
      rodzaj: 'Staw',
      liczbaPolowan: 3,
    },
  ];

  const handleGoBack = () => {
    console.log('Powrót do menu głównego');
    // Tutaj będzie navigation.goBack()
  };

  const handleAddNew = () => {
    console.log('Dodawanie nowego łowiska');
    // Tutaj będzie navigation.navigate('AddFishingSpot')
  };

  const handleSpotPress = (spot: FishingSpot) => {
    console.log('Szczegóły łowiska:', spot.id);
    // Tutaj będzie navigation.navigate('FishingSpotDetail', { spotId: spot.id })
  };

  // Funkcja otwierająca Google Maps
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
      // Fallback do przeglądarki jeśli nie ma aplikacji Maps
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
      Linking.openURL(webUrl);
    });
  };

  // Render pojedynczego łowiska
  const renderItem: ListRenderItem<FishingSpot> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSpotPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.nazwa}>{item.nazwa}</Text>
          {item.rodzaj && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{item.rodzaj}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.lokalizacja}>📍 {item.lokalizacja}</Text>
        <Text style={styles.opis}>{item.opis}</Text>
        
        {item.liczbaPolowan !== undefined && item.liczbaPolowan > 0 && (
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              🎣 {item.liczbaPolowan} {item.liczbaPolowan === 1 ? 'połów' : 'połowów'}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.pinButton}
        onPress={(e) => {
          e.stopPropagation();
          openMaps(item.latitude, item.longitude, item.nazwa);
        }}
      >
        <Text style={styles.pinIcon}>📍</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render pustej listy
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎣</Text>
      <Text style={styles.emptyTitle}>Brak łowisk</Text>
      <Text style={styles.emptyText}>
        Dodaj swoje pierwsze łowisko, aby zacząć
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moje Łowiska</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Lista łowisk */}
      <FlatList
        data={lowiska}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}