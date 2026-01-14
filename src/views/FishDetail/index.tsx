import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { styles } from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '../../components/config'; // ZMIANA: dodaj useRoute
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native'; // ZMIANA: dodaj import RouteProp
import type { HistoryStackParamList } from '../../types/navigation';

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

    type FishDetailNavigationProp = NativeStackNavigationProp<HistoryStackParamList, 'FishDetail'>;
    type FishDetailRouteProp = RouteProp<HistoryStackParamList, 'FishDetail'>;
    
    const navigation = useNavigation<FishDetailNavigationProp>(); 
    const route = useRoute<FishDetailRouteProp>();
    const { fishID } = route.params;

    const [ryba, setRyba] = useState<Fish | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' }
      });
      
      return () => {
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            height: 65,
            paddingBottom: 10,
            paddingTop: 5,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
          }
        });
      };
    }, [navigation]);

    useEffect(() => {
      const fetchFishData = async () => {
        try {
          setIsLoading(true);
          // Pobierz wszystkie trips
          const tripsResponse = await fetch(`${API_URL}/trips`);
          const trips = await tripsResponse.json();
          
          // Znajdź trip który zawiera tę rybę
          let foundFish: any = null;
          let foundTrip: any = null;
          
          for (const trip of trips) {
            if (trip.catches && trip.catches.length > 0) {
              const fish = trip.catches.find((c: any) => c.id === fishID);
              if (fish) {
                foundFish = fish;
                foundTrip = trip;
                break;
              }
            }
          }
          
          if (!foundFish) {
            throw new Error('Nie znaleziono ryby');
          }
          
          // Przekształć dane do formatu Fish
          const formattedFish: Fish = {
            id: foundFish.id,
            zdjecie: foundFish.zdjecie || 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800',
            gatunek: foundFish.gatunek,
            nazwa: foundFish.nazwa,
            waga: foundFish.waga,
            dlugosc: foundFish.dlugosc,
            godzina: foundFish.godzina,
            data: foundTrip.date,
            miejsce: foundTrip.spotName,
            przyneta: foundFish.przyneta,
            notatki: foundFish.notatki || '',
            connectionId: foundTrip.id,
          };
          
          setRyba(formattedFish);
        } catch (error) {
          console.error('Błąd podczas pobierania danych ryby:', error);
          Alert.alert('Błąd', 'Nie udało się pobrać danych ryby');
          navigation.goBack();
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchFishData();
    }, [fishID]);

  const handleGoBack = () => {
    console.log('Powrót do listy');
    navigation.goBack()
  };

  const handleEdit = () => {
    if (!ryba) return;
    console.log('Edycja ryby:', ryba.id);
    // Tutaj będzie navigation.navigate('EditFish', { fishId: ryba.id })
  };

  const handleDelete = () => {
    if (!ryba) return;
    console.log('Usuwanie ryby:', ryba.id);
    // Tutaj będzie logika usuwania
  };

  if (isLoading || !ryba) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={{ marginTop: 10, color: '#666' }}>Ładowanie danych ryby...</Text>
        </View>
      </SafeAreaView>
    );
  }

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