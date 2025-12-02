export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  NewFishing: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabsParamList = {
  DashboardTab: undefined;
  HistoryTab: undefined;
  AddFishing: undefined;
  SpotsTab: undefined;
  ProfileTab: undefined;
};

export type DashboardStackParamList = {
  DashboardScreen: undefined;
};

export type HistoryStackParamList = {
  HistoryList: undefined;
  FishingDetail: { fishingID: string };
  FishDetail: { fishID : string};
};

export type SpotsStackParamList = {
 SpotsList: undefined;      
  AddFishingSpot: undefined; 
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
};