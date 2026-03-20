import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

export function NavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const visibleRoutes = state.routes.filter(
    (route) => (descriptors[route.key].options as any).href !== null
  );

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <View style={styles.menuWrapper}>
          {visibleRoutes.map((route) => {
            const { options } = descriptors[route.key];

            const originalIndex = state.routes.findIndex(
              (r) => r.key === route.key
            );

            const isFocused = state.index === originalIndex;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let iconName: string | null = null;

            if (
              options.title?.toLowerCase().includes('search') ||
              route.name.toLowerCase().includes('search') ||
              route.name === 'explore'
            ) {
              iconName = 'search';
            } else if (
              options.title?.toLowerCase().includes('hist') ||
              route.name.toLowerCase().includes('history')
            ) {
              iconName = 'chart-line';
            } else if (
              options.title?.toLowerCase().includes('fam') ||
              route.name.toLowerCase().includes('family')
            ) {
              iconName = 'users';
            } else if (route.name === 'index') {
              iconName = 'home';
            }

            if (!iconName) return null;

            return (
              <TabItem
                key={route.key}
                isFocused={isFocused}
                onPress={onPress}
                iconName={iconName}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const TabItem = ({
  isFocused,
  onPress,
  iconName,
}: {
  isFocused: boolean;
  onPress: () => void;
  iconName: string;
}) => {
  return (
    <Pressable style={styles.menuElement} onPress={onPress}>
      <View
        style={[
          styles.iconWrapper,
          isFocused && styles.iconWrapperActive,
        ]}
      >
        <FontAwesome5
          name={iconName}
          size={isFocused ? 26 : 22}
          color={isFocused ? '#000' : '#000'}
          style={{ opacity: isFocused ? 1 : 0.4 }}
        />
      </View>
    </Pressable>
  );
};

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
  menuWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
  },
  menuElement: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperActive: {
    transform: [{ scale: 1.2 }],
  },
});