import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert, 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../types/AuthContext';

type UserProfile = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  favoriteFish?: string;
  bio?: string;
  stats?: {
    trips?: number;
    fishCaught?: number;
    biggestCatchKg?: number;
  };
};

const localAvatar = require("../../../assets/avatar.png");

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const s = (user && (user.stats as any)) ?? { trips: 0, fishCaught: 0 };

  const handleGoBack = () => navigation.goBack();

  const handleLogout = () => {
    Alert.alert(
      "Wylogowanie",
      "Czy na pewno chcesz się wylogować?",
      [
        { text: "Anuluj", style: "cancel" },
        { 
          text: "Wyloguj", 
          style: "destructive", 
          onPress: () => logout() 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profil użytkownika</Text>

        <View style={{ width: 44 }} /> 
      </View>

      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          <Image source={localAvatar} style={styles.avatar} />

          <View style={styles.nameBlock}>
            <Text style={styles.fullName}>{user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Gość'}</Text>
            <Text style={styles.login}>{user ? (user.username ?? user.email ?? '') : ''}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <Text style={styles.stat}>Email: {user?.email ?? '—'}</Text>
          <Text style={styles.stat}>Ulubiona ryba: {user?.favoriteFish ?? '—'}</Text>
          <Text style={styles.stat}>Bio: {user?.bio ?? '—'}</Text>
          <Text style={styles.stat}>Liczba wypraw: {s.trips ?? 0}</Text>
          <Text style={styles.stat}>Złowione ryby: {s.fishCaught ?? 0}</Text>
          <Text style={styles.stat}>Największa ryba (kg): {s.biggestCatchKg ?? '—'}</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edytuj profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Wyloguj się</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  header: {
    height: 60,
    backgroundColor: "#2c5f2d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  backButton: {
    width: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  backIcon: {
    fontSize: 26,
    color: "#fff",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  wrapper: {
    padding: 20,
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#2c5f2d", 
    marginRight: 15,
  },

  nameBlock: {
    flex: 1,
  },

  fullName: {
    fontSize: 22,
    fontWeight: "bold",
  },

  login: {
    color: "gray",
    marginTop: 2,
  },

  statsGrid: {
    marginTop: 15,
  },

  stat: {
    fontSize: 16,
    marginVertical: 3,
  },

  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#2c5f2d",
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  logoutButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d32f2f", 
    borderRadius: 20,
    alignItems: "center",
  },

  logoutButtonText: {
    color: "#d32f2f",
    fontWeight: "600",
    fontSize: 16,
  },
});