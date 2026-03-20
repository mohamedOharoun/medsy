import React from 'react';
import { View, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MedicationListItem } from '../../components/medication/medication-list-item';
import { TreatmentModal } from '../../components/treatment/treatment-modal';

// Importaciones separadas
import { useTreatmentsScreenLogic } from '../../hooks/use-treatments-screen-logic';
import { styles } from '../../styles/tabs/treatments.styles';
import { TreatmentsHeader, LoadingTreatments, EmptyTreatmentsState, FAB } from '../../components/treatment/treatments-components';

export default function TreatmentsScreen() {
  const { state, actions } = useTreatmentsScreenLogic();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <View style={styles.container}>
        
        <TreatmentsHeader title="My treatments" />

        {state.loading ? (
          <LoadingTreatments />
        ) : (
          <FlatList
            data={state.treatments}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <MedicationListItem 
                treatment={item} 
                onEdit={actions.handleEditPress} 
                onDelete={actions.deleteTreatment} 
              />
            )}
            ListEmptyComponent={
              <EmptyTreatmentsState onAddPress={actions.handleAddPress} />
            }
          />
        )}

        <TreatmentModal 
          visible={state.modalVisible}
          treatment={state.editingTreatment}
          onClose={actions.closeModal}
          onSave={actions.handleSave}
        />
        
        <FAB onPress={actions.handleAddPress} />
      </View>
    </SafeAreaView>
  );
}
