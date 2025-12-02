import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../types/AuthContext';
import { styles } from './styles';

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();

  const stats = user?.stats || { trips: 0, fishCaught: 0, places: 0 };

  const displayName = user?.firstName || user?.username || 'Wędkarzu';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Witaj, {displayName}!</Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Twoje statystyki</Text>
        
        <Text style={styles.statsText}>
            🎣 Połowy: {stats.trips ?? 0}
        </Text>
        
        <Text style={styles.statsText}>
            🐟 Ryby: {stats.fishCaught ?? 0}
        </Text>
        
       <Text style={styles.statsText}>
    🗺️ Łowiska: {stats.places ?? 0}
</Text>
      </View>
    </View>
  );
}