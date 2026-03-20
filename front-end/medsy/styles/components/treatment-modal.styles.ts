import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  keyboardView: { 
    width: '100%' 
  },
  modalContainer: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28, 
    padding: 24, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24, 
    maxHeight: '90%' 
  },
  dragHandle: { 
    width: 40, 
    height: 5, 
    backgroundColor: '#E5E5EA', 
    borderRadius: 3, 
    alignSelf: 'center', 
    marginBottom: 20 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    color: '#1C1C1E' 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#3A3A3C', 
    marginBottom: 8, 
    marginLeft: 4 
  },

  dropdownContainer: { 
    marginBottom: 20 
  },
  input: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#F2F2F7', 
    borderRadius: 14, 
    padding: 16, 
    height: 52 
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F2F2F7', 
    borderRadius: 14, 
    paddingHorizontal: 16, 
    height: 52 
  },
  inputText: { 
    flex: 1, 
    fontSize: 16, 
    color: '#1C1C1E', 
    height: '100%' 
  },

  dropdownList: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#F2F2F7', 
    borderRadius: 14, 
    marginTop: 4, 
    overflow: 'hidden' 
  },
  dropdownOption: { 
    padding: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F2F2F7' 
  },

  timesText: {
    fontSize: 12,
    color: '#2E7D5E',
    marginTop: 2,
    fontWeight: '500',
  },

  // Estilos mejorados para el horario
  timeSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFEFF4',
  },
  timePickerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginTop: 4,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D5E',
  },
  timeScheduleContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFF4',
  },
  scheduleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeTag: {
    backgroundColor: '#EBF5F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4E9E1',
  },
  timeTagText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D5E',
  },
  doneBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    marginTop: -8,
    marginBottom: 8,
  },
  doneBtnText: {
    color: '#2E7D5E',
    fontWeight: '700',
    fontSize: 14,
  },

  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 16
  },
  button: { 
    flex: 1, 
    padding: 16, 
    borderRadius: 14, 
    alignItems: 'center' 
  },
  cancelBtn: { 
    backgroundColor: '#F2F2F7' 
  },
  saveBtn: { 
    backgroundColor: '#2E7D5E', 
    shadowColor: '#2E7D5E', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 4 
  },
  disabledBtn: { 
    opacity: 0.5, 
    shadowOpacity: 0 
  },
  cancelText: { 
    color: '#2E7D5E', 
    fontWeight: '600', 
    fontSize: 16 
  },
  saveText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16 
  }
});
