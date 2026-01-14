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
import { styles } from './styles';

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
        <Text style={styles.headerTitle}>Profil użytkownika</Text>
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
        
        <TouchableOpacity style={styles.button} 
          onPress={() => (navigation as any).navigate('EditProfileScreen')}
          >
          <Text style={styles.buttonText}>Edytuj profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Wyloguj się</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

