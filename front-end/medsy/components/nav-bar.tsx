import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

const ACTIVE_COLOR = '#f7f5f5ff';

export function NavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { width } = Dimensions.get('window');

  const visibleRoutes = state.routes.filter(
    (route) => (descriptors[route.key].options as any).href !== null
  );
  const tabWidth = width / visibleRoutes.length;

  const bgLeft = useSharedValue(0);
  const activeColor = useSharedValue(ACTIVE_COLOR);

  const bgBottom = useSharedValue(-50);

  useEffect(() => {
    const activeRouteKey = state.routes[state.index].key;
    const visibleIndex = visibleRoutes.findIndex(route => route.key === activeRouteKey);
    const safeIndex = visibleIndex >= 0 ? visibleIndex : 0;

    const nextLeft = tabWidth * safeIndex + tabWidth / 2 - 35;
    const nextColor = ACTIVE_COLOR;

    bgBottom.value = withSequence(
      withTiming(-30, { duration: 150, easing: Easing.out(Easing.ease) }),
      withDelay(
        100,
        withTiming(-50, { duration: 150, easing: Easing.out(Easing.ease) })
      )
    );

    bgLeft.value = withDelay(
      150,
      withTiming(nextLeft, { duration: 200, easing: Easing.inOut(Easing.ease) })
    );

    activeColor.value = withTiming(nextColor, { duration: 300 });
  }, [state.index, tabWidth, state.routes, descriptors]);

  const bgStyle = useAnimatedStyle(() => {
    return {
      left: bgLeft.value,
      bottom: bgBottom.value,
      backgroundColor: activeColor.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.bgContainer}>
        <Animated.View style={[styles.bgBubble, bgStyle]} />
      </View>

      <View style={styles.navbar}>
        <View style={styles.menuWrapper}>
          {visibleRoutes.map((route, visibleIndex) => {
            const { options } = descriptors[route.key];
            const originalIndex = state.routes.findIndex(r => r.key === route.key);
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

            let iconName;
            const title = options.title?.toLowerCase() || '';
            const name = route.name.toLowerCase();

            if (name === 'search' || title.includes('search')) {
              iconName = 'search';
            } else if (name === 'index' || title.includes('home')) {
              iconName = 'home';
            } else if (name === 'treatments' || title.includes('treatments')) {
              iconName = 'clipboard-list';
            } else if (name === 'history' || title.includes('history')) {
              iconName = 'history';
            } else {
              return null;
            }

            return (
              <TabItem
                key={route.key}
                isFocused={isFocused}
                onPress={onPress}
                iconName={iconName}
                activeColor={ACTIVE_COLOR}
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
  activeColor,
}: {
  isFocused: boolean;
  onPress: () => void;
  iconName: string;
  activeColor: string;
}) => {
  const translateY = useSharedValue(0);
  const iconOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (isFocused) {
      translateY.value = withTiming(-15, { duration: 250 });
      iconOpacity.value = withTiming(0, { duration: 250 });
    } else {
      translateY.value = withTiming(0.5, { duration: 250 });
      iconOpacity.value = withTiming(0.4, { duration: 250 });
    }
  }, [isFocused]);

  const floatBubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      backgroundColor: 'rgb(46, 125, 94)',
      opacity: isFocused ? 1 : 0,
      elevation: isFocused ? 3 : 0,
      shadowOpacity: isFocused ? 0.2 : 0,
    };
  });

  const staticIconStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
    };
  });

  return (
    <Pressable style={styles.menuElement} onPress={onPress}>
      <Animated.View style={staticIconStyle}>
        <FontAwesome5 name={iconName} size={22} color="#000" />
      </Animated.View>

      <Animated.View style={[styles.floatBubble, floatBubbleStyle]}>
        <FontAwesome5 name={iconName} size={28} color={activeColor} style={{ opacity: 0.7 }} />
      </Animated.View>
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
  bgContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  bgBubble: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    bottom: -50,
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
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
  floatBubble: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
});
