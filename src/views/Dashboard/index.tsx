import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../types/AuthContext";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export default function DashboardScreen({ navigation }: any) {
  const { user, refreshUserData } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          await refreshUserData?.();
        } catch (error) {
          console.error('Błąd odświeżania danych:', error);
        }
      };
      loadData();
    }, [refreshUserData])
  );

  const stats = user?.stats || { trips: 0, fishCaught: 0, places: 0 };

  const displayName = user?.firstName || user?.username || "Wędkarzu";

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Witaj, {displayName}!</Text>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Twoje statystyki</Text>

        <Text style={styles.statsText}>🎣 Połowy: {stats.trips ?? 0}</Text>

        <Text style={styles.statsText}>🐟 Ryby: {stats.fishCaught ?? 0}</Text>

        <Text style={styles.statsText}>🗺️ Łowiska: {stats.places ?? 0}</Text>
      </View>
    </SafeAreaView>
  );
}
