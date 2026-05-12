import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomDropdown } from '../../components/ui/custom-dropdown';
import { styles } from '../../styles/tabs/search.styles';

export const ExpandedFilters = ({ state, actions, options }: any) => (
  <>
    <View style={styles.inputContainer}>
      <Ionicons name="search" size={20} color="#8E8E93" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder="Nombre comercial (ej. Aspirina)"
        value={state.name}
        onChangeText={actions.setName}
        placeholderTextColor="#A1A1AA"
      />
    </View>

    {state.showFilters ? (
      <>
        <View style={styles.inputContainer}>
          <Ionicons name="flask" size={20} color="#8E8E93" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Sustancia activa (ej. Paracetamol)"
            value={state.substance}
            onChangeText={actions.setSubstance}
            placeholderTextColor="#A1A1AA"
          />
        </View>

        <CustomDropdown
          placeholder="Vía de administración (Todas)"
          value={state.administration}
          options={options}
          onSelect={(val: string) => actions.setAdministration(val === 'Todas' ? '' : val)}
          iconName="body"
        />

        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4, alignSelf: 'flex-end' }}
          onPress={actions.toggleFilters}
        >
          <Text style={{ color: '#8E8E93', fontWeight: '500' }}>Ocultar filtros</Text>
        </TouchableOpacity>
      </>
    ) : (
      <TouchableOpacity 
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 }}
        onPress={actions.toggleFilters}
      >
        <Ionicons name="options" size={20} color="#2E7D5E" />
        <Text style={{ color: '#2E7D5E', marginLeft: 8, fontWeight: '600' }}>Filtros avanzados</Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity style={styles.searchBtn} onPress={actions.handleSearch} disabled={state.loading}>
      {state.loading ? <ActivityIndicator color="#fff" /> : (
        <>
          <Ionicons name="search" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.searchBtnText}>Buscar medicamentos</Text>
        </>
      )}
    </TouchableOpacity>
  </>
);

export const CollapsedHeader = ({ title, onPress }: any) => (
  <TouchableOpacity style={styles.collapsedBar} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.collapsedIconBg}>
      <Ionicons name="search" size={20} color="#2E7D5E" />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={{ fontWeight: '700', color: '#1C1C1E', fontSize: 16 }} numberOfLines={1}>
        {title}
      </Text>
      <Text style={{ color: '#8E8E93', fontSize: 14 }}>Toca para modificar filtros...</Text>
    </View>
    <Ionicons name="chevron-down" size={20} color="#8E8E93" />
  </TouchableOpacity>
);

export const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="search-outline" size={64} color="#C7C7CC" />
    <Text style={styles.emptyTitle}>Sin resultados</Text>
    <Text style={styles.emptyText}>No se encontraron medicamentos que coincidan con estos filtros.</Text>
  </View>
);
