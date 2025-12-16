import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#2c5f2d',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#3d7a3e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(61, 122, 62, 0.3)',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  spotSelector: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedSpot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedSpotName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  selectedSpotLocation: {
    fontSize: 14,
    color: '#666',
  },
  placeholderSpot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
  chevron: {
    fontSize: 24,
    color: '#ccc',
  },
  fishList: {
    gap: 10,
  },
  fishCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 10,
  },
  fishInfo: {
    flex: 1,
  },
  fishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  fishSpecies: {
    fontSize: 14,
    color: '#2c5f2d',
    marginBottom: 8,
  },
  fishStats: {
    flexDirection: 'row',
    gap: 12,
  },
  fishStat: {
    fontSize: 12,
    color: '#666',
  },
  removeFishButton: {
    width: 36,
    height: 36,
    backgroundColor: '#fee',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeFishIcon: {
    fontSize: 28,
    color: '#dc3545',
    fontWeight: '300',
  },
  emptyFishList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  addFishButton: {
    backgroundColor: '#2c5f2d',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addFishIcon: {
    fontSize: 24,
    color: '#fff',
    marginRight: 8,
    fontWeight: '300',
  },
  addFishText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#2c5f2d',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d0e8d1',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c5f2d',
  },
  //style dla modali
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalClose: {
    fontSize: 36,
    color: '#666',
    fontWeight: '300',
  },
  centeredModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  spotOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  spotOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  spotOptionLocation: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    fontSize: 24,
    color: '#2c5f2d',
    fontWeight: 'bold',
  },
  addNewSpotButton: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addNewSpotText: {
    fontSize: 16,
    color: '#2c5f2d',
    fontWeight: 'bold',
  },
  modalContainer: { 
    width: '85%', 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 20, 
    maxHeight: '60%' 
  },
  fishModalContainer: { 
    width: '90%', 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 20 
  },  
  fishModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c5f2d',
  },
  modalItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  modalItemTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  modalItemSub: { 
    fontSize: 14, 
    color: '#666' 
  },
  modalCancelBtn: { 
    marginTop: 15, 
    padding: 10, 
    alignItems: 'center' 
  },
  modalCancelText: { 
    color: '#666', 
    fontSize: 16 
  },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 5, 
    marginTop: 10 
  },
  input: { 
    backgroundColor: '#f9f9f9', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16 
  },
  inputRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  modalBtnRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 25 
  },
  modalBtnCancel: { 
    flex: 1, 
    padding: 15, 
    marginRight: 10, 
    backgroundColor: '#eee', 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  modalBtnAdd: { 
    flex: 1, 
    padding: 15, 
    marginLeft: 10, 
    backgroundColor: '#2E7D32', 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  btnTextWhite: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  btnTextBlack: { 
    color: '#333', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  photoSection: {
    marginVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  removePhotoText: {
    color: '#dc3545', 
    fontSize: 14,
    fontWeight: '600',
  },
  photoOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10, 
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#f0f0f0', 
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  photoButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});