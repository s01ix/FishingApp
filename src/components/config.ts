  import { Platform } from "react-native";
  export const API_URL = Platform.select({
  android: 'http://192.168.0.245:3000',
  ios: 'http://192.168.0.245:3000',
  default: 'http://localhost:3000',
  });