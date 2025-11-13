import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../types/AuthContext';
import { styles } from './styles';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profil użytkownika</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nazwa:</Text>
          <Text style={styles.value}>{user?.name}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>🚪 Wyloguj się</Text>
      </TouchableOpacity>
    </View>
  );
}