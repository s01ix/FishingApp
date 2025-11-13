import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../types/AuthContext';
import { styles } from './styles';

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Witaj!</Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Twoje statystyki</Text>
        <Text style={styles.statsText}>🎣 Połowy: 0</Text>
        <Text style={styles.statsText}>🐟 Ryby: 0</Text>
        <Text style={styles.statsText}>🗺️ Łowiska: 0</Text>
      </View>
    </View>
  );
}