import React, { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
  ActivityIndicator,
  Alert
} from 'react-native';
import { styles } from './styles';
import { useAuth } from '../../types/AuthContext';
import { API_URL } from '../../components/config'; 
import AddFishingSpot from '../AddFishingSpot/AddFishingSpot';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SpotsStackParamList } from '../../types/navigation';


export interface FishingSpot {
  id: string;
  nazwa: string;
  lokalizacja: string;
  opis: string;
  latitude: number;
  longitude: number;
  rodzaj?: string;
  liczbaPolowan?: number; 
}

export default function FishingSpots() {
  const { user } = useAuth();
const navigation = useNavigation<NativeStackNavigationProp<SpotsStackParamList>>();  
  const [spots, setSpots] = useState<FishingSpot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpots = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/fishingSpots`);
      if (!response.ok) throw new Error("Problem z pobraniem danych");
      
      const data: FishingSpot[] = await response.json();


      
      const userTrips = user?.trips || [];

      const spotsWithStats = data.map(spot => {
        const visitCount = userTrips.filter((trip: any) => trip.spotId === spot.id).length;
        
        return {
          ...spot,
          liczbaPolowan: visitCount
        };
      });

      spotsWithStats.sort((a, b) => (b.liczbaPolowan || 0) - (a.liczbaPolowan || 0));

      setSpots(spotsWithStats);
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się pobrać listy łowisk.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSpots();
    }, [user]) 
  );

  const handleGoBack = () => navigation.goBack();

  const handleAddNew = () => {
    console.log('Nawigacja do AddFishingSpot');
    navigation.navigate('AddFishingSpot'); 
  };

  const handleSpotPress = (spot: FishingSpot) => {
    console.log('Szczegóły łowiska:', spot.id);
  };

  const openMaps = (latitude: number, longitude: number, label: string): void => {
    const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
        Linking.openURL(url).catch(() => {
            const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            Linking.openURL(webUrl);
        });
    }
  };

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
        <Text style={styles.opis} numberOfLines={2}>{item.opis}</Text>
        
        {item.liczbaPolowan !== undefined && item.liczbaPolowan > 0 && (
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              🎣 Twoje wyprawy tutaj: {item.liczbaPolowan}
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
        <Text style={styles.pinIcon}>🗺️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎣</Text>
      <Text style={styles.emptyTitle}>Brak łowisk</Text>
      <Text style={styles.emptyText}>Sprawdź połączenie z internetem.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Baza Łowisk</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2c5f2d" />
        </View>
      ) : (
        <FlatList
            data={spots}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}