import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { styles } from '../../styles/components/delete-modal.styles';

interface DeleteModalProps {
  visible: boolean;
  treatmentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ visible, treatmentName, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Eliminar tratamiento</Text>
              <Text style={styles.message}>
                Vas a eliminar <Text style={styles.treatmentName}>{treatmentName}</Text>, ¿estás seguro?
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm} activeOpacity={0.8}>
                  <Text style={styles.deleteBtnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
