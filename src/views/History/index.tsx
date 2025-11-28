import React, {useCallback} from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HistoryStackParamList } from '../../types/navigation';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { styles } from './styles';
import { useAuth } from '../../types/AuthContext';

interface FishingTrip {
  id: string;
  data: string;
  miejsce: string;
  iloscRyb: number;
  najwiekszaRyba: {
    gatunek: string;
    nazwa: string;
    waga: number;
    dlugosc: number;
    zdjecie: string;
  };
}

export default function History() {
  
  type HistoryScreenNavigationProp = NativeStackNavigationProp<HistoryStackParamList, 'HistoryList'>;
  const navigation = useNavigation<HistoryScreenNavigationProp>();

  const {user} = useAuth();

  const [fishingHistory, setFishingHistory] = React.useState<FishingTrip[]>([]);

  const API_URL = Platform.select({
    android: 'http://10.161.77.16:3000',
    ios: 'http://localhost:3000',
    default: 'http://localhost:3000',
  });

  const fetchFishingHistory = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/trips?userId=${user.id}`);
      const rawData = await response.json();
      const reversedData = rawData.reverse();

     const processedData: FishingTrip[] = reversedData.map((trip: any) => {
      const catches = trip.catches || [];
      let biggestFish = null;

      if (catches.length > 0) {
          // Sortujemy od największej do najmniejszej ryby
          catches.sort((a: any, b: any) => b.waga - a.waga);
          // Największa ryba 
          const winner = catches[0];
          
          biggestFish = {
            gatunek: winner.gatunek,
            nazwa: winner.nazwa,
            waga: winner.waga,
            dlugosc: winner.dlugosc,
            zdjecie: winner.zdjecie ? winner.zdjecie : 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800'
          };
        }
        return {
          id: trip.id,
          data: trip.date,
          miejsce: trip.spotName,
          iloscRyb: catches.length,
          najwiekszaRyba: biggestFish 
        };
  }); 

      setFishingHistory(processedData);
    } catch (error) {
      console.error('Błąd podczas pobierania historii połowów:', error);
    }

  };
  // Odświeżenie danych przy każdym wejściu na ekran
  useFocusEffect(
    useCallback(() => {
      fetchFishingHistory();
    }, [user])
  );
  const handleSelectTrip = (id: string) => {
    console.log('Otwórz szczegóły wyprawy:', id);
    navigation.navigate('FishingDetail', { fishingID: id });
  };

  const renderItem = ({ item }: { item: FishingTrip }) => (
    <TouchableOpacity style={styles.tripCard} onPress={() => handleSelectTrip(item.id)}>
      <Image
        source={{ uri: item.najwiekszaRyba.zdjecie }}
        style={styles.tripImage}
        resizeMode="cover"
      />

      <View style={styles.tripInfo}>
        <Text style={styles.tripDate}>📅 {item.data}</Text>
        <Text style={styles.tripPlace}>📍 {item.miejsce}</Text>

        <View style={styles.tripStats}>
          <Text style={styles.tripStatText}>🎣 Łącznie ryb: {item.iloscRyb}</Text>
          <Text style={styles.tripStatText}>
            🏆 Największa: {item.najwiekszaRyba.gatunek} ({item.najwiekszaRyba.waga} kg)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 Historia połowów</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={fishingHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
