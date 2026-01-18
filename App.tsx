import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import AuthProvider, { useAuth } from './src/types/AuthContext';
import LoginScreen from './src/views/Login';
import DashboardScreen from './src/views/Dashboard';
import HistoryScreen  from './src/views/History';
import FishingDetailScreen from './src/views/FishingDetail';
import SpotsScreen from './src/views/FishingSpots';
import ProfileScreen from './src/views/Profile';
import FishDetailScreen from './src/views/FishDetail';
import AddFishingScreen from './src/views/NewFishing'; 
import AddFishingSpot from './src/views/AddFishingSpot/AddFishingSpot';
import RegisterScreen from './src/views/Register';

import type {
  RootStackParamList,
  AuthStackParamList,
  MainTabsParamList,
  HistoryStackParamList,
  ProfileStackParamList,
} from './src/types/navigation';
import NewFishing from './src/views/NewFishing';
import { SpotsStackParamList } from './src/types/navigation'; // Upewnij się że importujesz ten typ
import EditProfileScreen from './src/views/EditProfile';
const SpotsStack = createNativeStackNavigator<SpotsStackParamList>();

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const Tab = createBottomTabNavigator<MainTabsParamList>();

function HistoryNavigator() {
  return (
    <HistoryStack.Navigator screenOptions={{ headerShown: false }}>
      <HistoryStack.Screen name="HistoryList" component={HistoryScreen} />
      <HistoryStack.Screen name="FishingDetail" component={FishingDetailScreen} />
      <HistoryStack.Screen name= "FishDetail" component={FishDetailScreen}/>
    </HistoryStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
}

function SpotsNavigator() {
  return (
    <SpotsStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Ekran listy łowisk (startowy) */}
      <SpotsStack.Screen name="SpotsList" component={SpotsScreen} />
      
      {/* Ekran dodawania nowego łowiska */}
      <SpotsStack.Screen name="AddFishingSpot" component={AddFishingSpot} />
    </SpotsStack.Navigator>
  );
}
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      
    </AuthStack.Navigator>
  );
}

//const EmptyComponent = () => null;

const CustomFAB = ({ onPress }: any) => (
  <View style={styles.fabContainer}>
    <TouchableOpacity
      style={styles.fabButton}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name="add" size={38} color="#fff" />
    </TouchableOpacity>
  </View>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';

          switch (route.name) {
            case 'DashboardTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'HistoryTab':
              iconName = focused ? 'fish' : 'fish-outline';
              break;
            case 'AddFishing':
              iconName = 'add-circle';
              break;
            case 'SpotsTab':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          if (route.name === 'AddFishing') {
            return <Ionicons name={iconName} size={size * 1.5} color="#2E7D32" />;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Główna' }}
        listeners={{
          tabPress: () => {
            console.log('Kliknięto: Dashboard');
          },
        }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={HistoryNavigator}
        options={{ tabBarLabel: 'Połowy' }}
        listeners={{
          tabPress: (e) => {
            console.log('Kliknięto: Połowy');
          },
        }}
      />

      <Tab.Screen
        name="AddFishing"
        component={NewFishing}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => <CustomFAB {...props} />,
        }}
        listeners={{
          tabPress: (e) => {
            console.log('Kliknięto Dodaj');
          },
        }}
      />

   <Tab.Screen
        name="SpotsTab"
        component={SpotsNavigator} 
        options={{ tabBarLabel: 'Łowiska' }}
        listeners={{
          tabPress: (e) => {
            console.log('🗺️ Kliknięto Łowiska');
          },
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Profil' }}
        listeners={{
          tabPress: (e) => {
           // e.preventDefault(); // blokuje nawigację
            console.log('Kliknięto Profil');
          },
        }}
      />
    </Tab.Navigator>
  );
}


function RootNavigator() {
  const { isLoggedIn } = useAuth();
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <RootStack.Screen name="Main" component={MainTabs} />
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 65,
    paddingBottom: 10,
    paddingTop: 5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  fabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -15,
  },
  fabButton: {
    width: 75,
    height: 55,
    borderRadius: 22,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
});


