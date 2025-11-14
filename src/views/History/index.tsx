import React from 'react';
import { useNavigation } from '@react-navigation/native';
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
} from 'react-native';
import { styles } from './styles';

interface Dane {
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

  const historiaPolowow: Dane[] = [
    {
      id: '1',
      data: '15.01.2024',
      miejsce: 'Jezioro Białe, Stanowisko 3',
      iloscRyb: 5,
      najwiekszaRyba: {
        gatunek: 'Karp',
        nazwa: 'Karpik',
        waga: 5.2,
        dlugosc: 65,
        zdjecie: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800',
      },
    },
    {
      id: '2',
      data: '28.02.2024',
      miejsce: 'Rzeka Bug, Zakole',
      iloscRyb: 3,
      najwiekszaRyba: {
        gatunek: 'Szczupak',
        nazwa: 'Zębaty',
        waga: 3.7,
        dlugosc: 72,
        zdjecie: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjangQ7SYnJ5xO0v0MsYwNjTUgg27wSGeSYg&s',
      },
    },
    {
      id: '3',
      data: '10.03.2024',
      miejsce: 'Staw Leśny',
      iloscRyb: 4,
      najwiekszaRyba: {
        gatunek: 'Leszcz',
        nazwa: 'Srebrny',
        waga: 1.8,
        dlugosc: 42,
        zdjecie: 'https://nurkomania.pl/images/atlas/leszcz_01.jpg',
      },
    },
  ];

  const handleSelectTrip = (id: string) => {
    console.log('Otwórz szczegóły wyprawy:', id);
    navigation.navigate('FishingDetail', { fishingID: id });
  };

  const renderItem = ({ item }: { item: Dane }) => (
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
        data={historiaPolowow}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
