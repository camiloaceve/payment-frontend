import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🛍️</Text>
        </View>
        
        <Text style={styles.title}>TIENDA TECH</Text>
        <Text style={styles.subtitle}>Prueba de Integración Wompi</Text>
        
        <View style={styles.loaderContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, { opacity: 0.6 }]} />
          <View style={[styles.dot, { opacity: 0.3 }]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark elegant background
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(56, 189, 248, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#38BDF8',
    marginTop: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  loaderContainer: {
    flexDirection: 'row',
    marginTop: 50,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
    marginHorizontal: 4,
  }
});
