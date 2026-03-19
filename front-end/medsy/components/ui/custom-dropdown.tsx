import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const CustomDropdown = ({ label, value, options, onSelect, placeholder = 'Elegir...', iconName = null }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.dropdownContainer}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <TouchableOpacity style={styles.input} onPress={() => setOpen(!open)}>
            {iconName && <Ionicons name={iconName} size={20} color="#8E8E93" style={styles.inputIcon} />}
            <Text style={{flex: 1, color: value ? '#1C1C1E' : '#A1A1AA', fontSize: 16}}>{value || placeholder}</Text>
            <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color="#8E8E93" />
        </TouchableOpacity>
        {open && (
           <View style={styles.dropdownList}>
             <ScrollView nestedScrollEnabled style={{maxHeight: 180}} keyboardShouldPersistTaps="handled">
                {options.map((opt: string) => (
                    <TouchableOpacity key={opt} style={styles.dropdownOption} onPress={() => { onSelect(opt); setOpen(false); }}>
                       <Text style={{color: '#1C1C1E', fontSize: 16, fontWeight: value === opt || (opt === 'Todas' && !value) ? 'bold' : 'normal'}}>{opt}</Text>
                    </TouchableOpacity>
                ))}
             </ScrollView>
           </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: { marginBottom: 12, position: 'relative', zIndex: 10 },
  label: { fontSize: 14, fontWeight: '600', color: '#3A3A3C', marginBottom: 8, marginLeft: 4 },
  input: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 14, paddingHorizontal: 16, height: 52 },
  inputIcon: { marginRight: 10 },
  dropdownList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#F2F2F7', borderRadius: 14, marginTop: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, overflow: 'hidden' },
  dropdownOption: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
});
