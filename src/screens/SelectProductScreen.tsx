import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SelectProduct'>;
};

// Same mock product for now
const product = {
  id: 'e2b6911c-772b-4171-8bc4-7eb38b971a81',
  name: 'Auriculares Inalámbricos Premium',
  price: 150000,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
  description: 'Experimenta el sonido de alta fidelidad con cancelación de ruido activa, 30 horas de batería y un diseño ergonómico que te hará olvidar que los llevas puestos.'
};

export default function SelectProductScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toLocaleString('es-CO')}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.buttonText}>Continuar al Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingBottom: 100 },
  image: { width: '100%', height: 350, resizeMode: 'cover' },
  content: { padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  price: { fontSize: 28, fontWeight: '800', color: '#0284C7', marginBottom: 20 },
  description: { fontSize: 16, color: '#64748B', lineHeight: 24 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  button: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});
