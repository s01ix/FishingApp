  import { Platform } from "react-native";
  export const API_URL = Platform.select({
  android: 'http://10.161.77.16:3000', // emulator Android
  ios: 'http://192.168.0.245:3000',
  default: 'http://localhost:3000',
  });