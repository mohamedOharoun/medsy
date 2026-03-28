import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useTreatments } from '../hooks/use-treatments';
import { Treatment } from '../services/api';

export function useTreatmentsScreenLogic() {
  const { treatments, loading, addTreatment, updateTreatment, deleteTreatment } = useTreatments();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
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

  const handleSave = (name: string, dosage: string, frequency: string, times?: string[]) => {
    if (editingTreatment) {
      updateTreatment(editingTreatment.id, name, dosage, frequency, times);
    } else {
      addTreatment(name, dosage, frequency, times);
    }
  };

  return {
    state: { treatments, loading, modalVisible, editingTreatment },
    actions: { handleAddPress, handleEditPress, closeModal, handleSave, deleteTreatment }
  };
}
