import { useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import { searchMedications, MedicationCatalogItem } from '../services/api';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function useSearchLogic() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [substance, setSubstance] = useState('');
  const [administration, setAdministration] = useState('');
  const [results, setResults] = useState<MedicationCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const OPTIONS = [
    'Todas', 'Oral', 'Tópica', 'Intravenosa', 'Intramuscular', 'Subcutánea',
    'Inhalación', 'Oftálmica', 'Ótica', 'Nasal', 'Rectal', 'Vaginal', 'Transdérmica'
  ];

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    const data = await searchMedications(name, substance, administration);
    setResults(data);
    setLoading(false);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(false);
  };

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters(!showFilters);
    if (showFilters) {
      setSubstance('');
      setAdministration('');
    }
  };

  const expandHeader = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(true);
  };

  return {
    state: { name, substance, administration, results, loading, searched, isExpanded, showFilters },
    actions: { setName, setSubstance, setAdministration, handleSearch, toggleFilters, expandHeader, router },
    constants: { OPTIONS }
  };
}
