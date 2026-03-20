import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/tabs/home.styles';

export const HomeHeader = ({ userName, greeting }: any) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.greeting}>{greeting},</Text>
      <Text style={styles.userName}>{userName} 👋</Text>
    </View>
    <View style={styles.avatar}>
      <Text style={styles.avatarInitial}>{userName[0]}</Text>
    </View>
  </View>
);

export const FAB = ({ onPress }: any) => (
  <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
    <Ionicons name="add" size={32} color="#fff" />
  </TouchableOpacity>
);

export const LoadingHome = () => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color="#2E7D5E" />
    <Text style={styles.loadingText}>Loading your medications...</Text>
  </View>
);

export const EmptyHomeState = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateEmoji}>🌿</Text>
    <Text style={styles.emptyStateText}>No medications scheduled for today.</Text>
    <Text style={styles.emptyStateSubtext}>You can add new treatments by searching the catalog or using the "+" button on the Treatments tab.</Text>
  </View>
);
