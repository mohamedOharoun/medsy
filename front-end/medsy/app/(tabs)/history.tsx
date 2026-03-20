import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importaciones separadas
import { useHistoryLogic } from '../../hooks/use-history-logic';
import { styles } from '../../styles/tabs/history.styles';
import { HistoryHeader, EmptyHistoryState } from '../../components/history/history-components';

export default function HistoryScreen() {
  const { } = useHistoryLogic();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <View style={styles.container}>

        <HistoryHeader title="Historial" subtitle="Tus registros de consumo pasados" />

        <ScrollView contentContainerStyle={styles.listContent}>
          <EmptyHistoryState />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
