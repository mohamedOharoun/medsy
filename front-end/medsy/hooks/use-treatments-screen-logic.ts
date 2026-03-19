import { useState } from 'react';
import { useTreatments } from '../hooks/use-treatments';
import { Treatment } from '../services/api';

export function useTreatmentsScreenLogic() {
  const { treatments, loading, addTreatment, updateTreatment, deleteTreatment } = useTreatments();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  const handleAddPress = () => {
    setEditingTreatment(null);
    setModalVisible(true);
  };

  const handleEditPress = (t: Treatment) => {
    setEditingTreatment(t);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = (name: string, dosage: string, frequency: string) => {
    if (editingTreatment) {
      updateTreatment(editingTreatment.id, name, dosage, frequency);
    } else {
      addTreatment(name, dosage, frequency);
    }
  };

  return {
    state: { treatments, loading, modalVisible, editingTreatment },
    actions: { handleAddPress, handleEditPress, closeModal, handleSave, deleteTreatment }
  };
}
