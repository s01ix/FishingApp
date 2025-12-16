import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 12, //
    paddingTop: 12, //
    backgroundColor: '#2c5f2d',
    elevation: 40,
    shadowColor: '#2c5f2d',
    shadowOpacity: 0.2,
    shadowRadius: 4,
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