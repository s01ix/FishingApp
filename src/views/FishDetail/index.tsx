import React from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { styles } from './styles';

// Typ dla danych ryby
export interface Fish {
  id: string;
  zdjecie: string;
  gatunek: string;
  nazwa: string;
  waga: number; // w kg
  dlugosc: number; // w cm
  godzina: string;
  data: string;
  miejsce: string;
  przyneta: string; // na co została złapana (np. kukurydza, robak, itp.)
  notatki: string | null; // opcjonalne notatki użytkownika
  connectionId?: string; // ID połowu
}

export default function FishDetail() {
  // Przykładowe dane ryby
  const ryba: Fish = {
    id: '1',
    zdjecie: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800',
    gatunek: 'Karp',
    nazwa: 'Karpik',
    waga: 5.2,
    dlugosc: 65,
    godzina: '14:35',
    data: '15.01.2024',
    miejsce: 'Jezioro Białe, Stanowisko 3',
    przyneta: 'Kukurydza',
    notatki: 'Ciężko było złapać, walczył przez 15 minut! Świetne wspomnienie.',
    connectionId: '#12345',
  };

  const handleGoBack = () => {
    console.log('Powrót do listy');
    // Tutaj będzie navigation.goBack()
  };

  const handleEdit = () => {
    console.log('Edycja ryby:', ryba.id);
    // Tutaj będzie navigation.navigate('EditFish', { fishId: ryba.id })
  };

  const handleDelete = () => {
    console.log('Usuwanie ryby:', ryba.id);
    // Tutaj będzie logika usuwania
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header z guzikiem powrotu */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Szczegóły Ryby</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Zdjęcie ryby */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: ryba.zdjecie }}
            style={styles.fishImage}
            resizeMode="cover"
          />
          {ryba.connectionId && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Połów {ryba.connectionId}</Text>
            </View>
          )}
        </View>

        {/* Główne informacje */}
        <View style={styles.mainInfo}>
          <Text style={styles.fishName}>{ryba.nazwa}</Text>
          <Text style={styles.fishSpecies}>{ryba.gatunek}</Text>
        </View>

        {/* Karty z parametrami */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚖️</Text>
            <Text style={styles.statValue}>{ryba.waga} kg</Text>
            <Text style={styles.statLabel}>Waga</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📏</Text>
            <Text style={styles.statValue}>{ryba.dlugosc} cm</Text>
            <Text style={styles.statLabel}>Długość</Text>
          </View>
        </View>

        {/* Szczegóły czasowe i lokalizacyjne */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Informacje o złowieniu</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.iconText}>📅</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Data złowienia</Text>
              <Text style={styles.detailValue}>{ryba.data}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.iconText}>🕐</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Godzina złowienia</Text>
              <Text style={styles.detailValue}>{ryba.godzina}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.iconText}>📍</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Miejsce</Text>
              <Text style={styles.detailValue}>{ryba.miejsce}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.iconText}>🎣</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Przynęta</Text>
              <Text style={styles.detailValue}>{ryba.przyneta}</Text>
            </View>
          </View>
        </View>

        {/* Notatki użytkownika */}
        {ryba.notatki && (
          <View style={styles.notesContainer}>
            <Text style={styles.sectionTitle}>Notatki</Text>
            <View style={styles.notesContent}>
              <Text style={styles.notesIcon}>📝</Text>
              <Text style={styles.notesText}>{ryba.notatki}</Text>
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