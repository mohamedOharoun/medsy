import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/components/success-modal.styles';

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
