export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  NewFishing: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
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
};

export type SpotsStackParamList = {
  SpotsList: undefined;
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
};