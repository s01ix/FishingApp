import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 26,
    color: "#fff",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
  },
  typesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 8,
    marginBottom: 8,
  },
  typeChipActive: {
    backgroundColor: "#2c5f2d",
  },
  typeText: {
    color: "#555",
    fontSize: 14,
  },
  typeTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
  },
  halfInputContainer: {
    flex: 1,
  },
  hint: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#2c5f2d",
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9', 
    borderWidth: 1,
    borderColor: '#2c5f2d',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 12, 
  },
  gpsIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  gpsButtonText: {
    color: '#2c5f2d',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButtonDisabled: {
    backgroundColor: "#8caf8c",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});