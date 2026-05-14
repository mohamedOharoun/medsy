import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useTreatments } from '../hooks/use-treatments';
import { Treatment } from '../services/api';

export function useTreatmentsScreenLogic() {
  const { treatments, loading, addTreatment, updateTreatment, deleteTreatment } = useTreatments();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState<Treatment | null>(null);

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Tratamiento creado con éxito');

  const { add } = useLocalSearchParams();

  const handleAddPress = () => {
    setEditingTreatment(null);
    setModalVisible(true);
  };

  useEffect(() => {
    if (add !== undefined) { // Check for presence of 'add' regardless of its value
      handleAddPress();
    }
  }, [add]);

  const handleEditPress = (t: Treatment) => {
    setEditingTreatment(t);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = async (name: string, dosage: string, frequency: string, times?: string[]) => {
    if (editingTreatment) {
      await updateTreatment(editingTreatment.id, name, dosage, frequency, times);
    } else {
      await addTreatment(name, dosage, frequency, times);
      setSuccessMessage('Tratamiento creado con éxito');
      setSuccessModalVisible(true);
    }
  };

  const handleDeletePress = (t: Treatment) => {
    setTreatmentToDelete(t);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (treatmentToDelete) {
      await deleteTreatment(treatmentToDelete.id);
      setDeleteModalVisible(false);

      setTimeout(() => {
        setSuccessMessage('Tratamiento eliminado con éxito');
        setSuccessModalVisible(true);
      }, 350);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  return {
    state: { treatments, loading, modalVisible, editingTreatment, deleteModalVisible, treatmentToDelete, successModalVisible, successMessage },
    actions: { handleAddPress, handleEditPress, closeModal, handleSave, handleDeletePress, confirmDelete, cancelDelete, closeSuccessModal }
  };
}
