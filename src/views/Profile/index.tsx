import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Typ użytkownika
type UserProfile = {
  firstName: string;
  lastName: string;
  login: string;
  stats?: {
    trips: number;
    fishCaught: number;
    biggestCatchKg?: number;
  };
};

// 🔹 Avatarka lokalna
const localAvatar = require("../../../assets/avatar.png");

const defaultUser: UserProfile = {
  firstName: "Jan",
  lastName: "Kowalski",
  login: "@janek",
  stats: { trips: 27, fishCaught: 134, biggestCatchKg: 4.2 },
};

export default function ProfileScreen({ user = defaultUser }: { user?: UserProfile }) {
  const navigation = useNavigation();

  const s = user.stats ?? { trips: 0, fishCaught: 0 };

  const handleGoBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

     <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profil użytkownika</Text>

        <View style={{ width: 44 }} /> 
        {/* placeholder żeby tytuł był na środku */}
      </View>

      {/* GŁÓWNA ZAWARTOŚĆ */}
      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          <Image source={localAvatar} style={styles.avatar} />

          <View style={styles.nameBlock}>
            <Text style={styles.fullName}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.login}>{user.login}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <Text style={styles.stat}>Wypady 🎣: {s.trips}</Text>
          <Text style={styles.stat}>Ryby 🐟: {s.fishCaught}</Text>
          <Text style={styles.stat}>Największy połów 🏆: {s.biggestCatchKg ?? "—"} kg</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edytuj profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// STYLE
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
});
