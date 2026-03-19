import React from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MedicationCatalogCard } from '../../components/medication/medication-catalog-card';

// Importaciones separadas
import { useSearchLogic } from '../../hooks/use-search-logic';
import { styles } from '../../styles/tabs/search.styles';
import { ExpandedFilters, CollapsedHeader, EmptyState } from '../../components/search/search-components';

export default function SearchScreen() {
  const { state, actions, constants } = useSearchLogic();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <View style={styles.container}>
        
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Catálogo de medicamentos</Text>
          <Text style={styles.subtitle}>Filtra por nombre o sustancia de la AEMPS</Text>
        </View>

        {/* Buscador y Filtros */}
        <View style={styles.filtersContainer}>
          {state.isExpanded ? (
            <ExpandedFilters 
              state={state} 
              actions={actions} 
              options={constants.OPTIONS} 
            />
          ) : (
            <CollapsedHeader 
              title={state.name || state.substance || state.administration || 'Búsqueda de medicamentos'} 
              onPress={actions.expandHeader} 
            />
          )}
        </View>

        {/* Lista de Resultados */}
        <FlatList
          data={state.results}
          keyExtractor={item => item.nregistro}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MedicationCatalogCard 
              item={item} 
              onPress={() => actions.router.push({
                pathname: "/medication/[id]",
                params: { id: item.nregistro }
              })} 
            />
          )}
          ListEmptyComponent={
            state.searched && !state.loading ? <EmptyState /> : null
          }
        />
      </View>
    </SafeAreaView>
  );
}
