import React from 'react';
import { View, StyleSheet } from 'react-native';

export function NavBar() {
  return (
    <View style={styles.container}>
      <View style={styles.navbar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'transparent',
  },
  navbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#f1ebebff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
