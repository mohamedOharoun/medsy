import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar, Platform, ScrollView, LayoutAnimation, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { searchMedications, MedicationCatalogItem } from '../../services/api';
import { CustomDropdown } from '../../components/ui/custom-dropdown';
import { MedicationCatalogCard } from '../../components/medication/medication-catalog-card';

export default function SearchScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [substance, setSubstance] = useState('');
  const [administration, setAdministration] = useState('');

  const OPTIONS = [
    'Todas', 'Oral', 'Tópica', 'Intravenosa', 'Intramuscular', 'Subcutánea',
    'Inhalatoria', 'Oftálmica', 'Ótica', 'Nasal', 'Rectal', 'Vaginal', 'Transdérmica'
  ];

  const [results, setResults] = useState<MedicationCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    const data = await searchMedications(name, substance, administration);
    setResults(data);
    setLoading(false);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Catálogo de medicamentos</Text>
          <Text style={styles.subtitle}>Filtra por nombre o sustancia de la AEMPS</Text>
        </View>

        <View style={styles.filtersContainer}>
          {isExpanded ? (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="search" size={20} color="#8E8E93" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre comercial (ej. Aspirina)"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#A1A1AA"
                />
              </View>

              {showFilters ? (
                <>
                  <View style={styles.inputContainer}>
                    <Ionicons name="flask" size={20} color="#8E8E93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Sustancia activa (ej. Paracetamol)"
                      value={substance}
                      onChangeText={setSubstance}
                      placeholderTextColor="#A1A1AA"
                    />
                  </View>

                  <CustomDropdown
                    placeholder="Vía de administración (Todas)"
                    value={administration}
                    options={OPTIONS}
                    onSelect={(val: string) => setAdministration(val === 'Todas' ? '' : val)}
                    iconName="body"
                  />

                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4, alignSelf: 'flex-end' }}
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setShowFilters(false);
                      setSubstance('');
                      setAdministration('');
                    }}
                  >
                    <Text style={{ color: '#8E8E93', fontWeight: '500' }}>Ocultar filtros</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 }}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setShowFilters(true);
                  }}
                >
                  <Ionicons name="options" size={20} color="#2E7D5E" />
                  <Text style={{ color: '#2E7D5E', marginLeft: 8, fontWeight: '600' }}>Filtros avanzados</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Ionicons name="search" size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.searchBtnText}>Buscar medicamentos</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.collapsedBar}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setIsExpanded(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.collapsedIconBg}>
                <Ionicons name="search" size={20} color="#2E7D5E" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: '700', color: '#1C1C1E', fontSize: 16 }} numberOfLines={1}>
                  {name || substance || administration || 'Búsqueda de medicamentos'}
                </Text>
                <Text style={{ color: '#8E8E93', fontSize: 14 }}>Toca para modificar filtros...</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={results}
          keyExtractor={item => item.nregistro}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MedicationCatalogCard 
              item={item} 
              onPress={() => router.push({
                pathname: "/medication/[id]",
                params: { id: item.nregistro }
              })} 
            />
          )}
          ListEmptyComponent={
            searched && !loading ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="#C7C7CC" />
                <Text style={styles.emptyTitle}>Sin resultados</Text>
                <Text style={styles.emptyText}>No hemos encontrado medicamentos que coincidan con estos filtros.</Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    height: '100%',
  },
  searchBtn: {
    backgroundColor: '#2E7D5E',
    flexDirection: 'row',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  collapsedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collapsedIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 125, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A3A3C',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 30,
  },
});
