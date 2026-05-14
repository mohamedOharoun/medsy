import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessModalProps {
  visible: boolean;
  message?: string;
  onClose: () => void;
}

export function SuccessModal({ visible, message = 'Tratamiento creado con éxito', onClose }: SuccessModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={60} color="#34C759" />
              </View>
              <Text style={styles.title}>¡Éxito!</Text>
              <Text style={styles.message}>
                {message}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.okBtn} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.okBtnText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#3A3A3C',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
  },
  okBtn: {
    flex: 1,
    backgroundColor: '#2E7D5E',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  okBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
