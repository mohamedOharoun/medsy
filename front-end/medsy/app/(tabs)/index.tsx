import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReminderCard } from '../../components/treatment/reminder-card';
import { SummaryCard } from '../../components/home/summary-card';

// Importaciones separadas
import { useHomeLogic, getGreeting } from '../../hooks/use-home-logic';
import { styles } from '../../styles/tabs/home.styles';
import { HomeHeader, FAB, LoadingHome, EmptyHomeState } from '../../components/home/home-components';

const USER_NAME = 'Usuario';

export default function HomeScreen() {
  const { state, actions } = useHomeLogic();

  if (state.loading && state.reminders.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingHome />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF7" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con Saludo */}
        <HomeHeader userName={USER_NAME} greeting={getGreeting()} />

        {/* Resumen de Progreso */}
        {state.total > 0 && (
          <SummaryCard
            allDone={state.allDone}
            total={state.total}
            doneCount={state.doneCount}
            reminders={state.reminders}
          />
        )}

        {/* Listado de Medicamentos */}
        {state.total > 0 && <Text style={styles.sectionLabel}>Mis medicamentos de hoy</Text>}

        {state.total > 0 ? (
          state.reminders.map((item) => (
            <ReminderCard key={item.id} item={item} onTake={actions.handleTake} />
          ))
        ) : (
          <EmptyHomeState />
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Botón Flotante */}
      <FAB onPress={() => actions.router.push('/treatments')} />

    </SafeAreaView>
  );
}