import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SelectProduct'>;
  route: RouteProp<RootStackParamList, 'SelectProduct'>;
};

export default function SelectProductScreen({ navigation, route }: Props) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  
  let imageSource;
  if (product.image) {
    imageSource = { uri: product.image };
  } else if (product.name.toLowerCase().includes('teclado')) {
    imageSource = require('../../assets/mechanical_keyboard.jpg');
  } else {
    imageSource = { uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop' }; // Auriculares por defecto
  }

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>${(product.price * quantity).toLocaleString('es-CO')}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.stockText}>Disponibles: {product.stock}</Text>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Cantidad:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.qtyButton} onPress={handleDecrease}>
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyButton} onPress={handleIncrease}>
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Checkout', { product, quantity })}
        >
          <Text style={styles.buttonText}>Continuar al Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { paddingBottom: 120 },
  image: { width: '100%', height: 350, resizeMode: 'cover' },
  content: { padding: 24 },
  title: { fontSize: 26, fontWeight: '900', color: '#F8FAFC', marginBottom: 12, letterSpacing: 0.5 },
  price: { fontSize: 32, fontWeight: '900', color: '#38BDF8', marginBottom: 16 },
  description: { fontSize: 16, color: '#94A3B8', lineHeight: 24, marginBottom: 16 },
  stockText: { fontSize: 14, color: '#10B981', fontWeight: 'bold', marginBottom: 24 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  quantityLabel: { fontSize: 18, color: '#F8FAFC', fontWeight: '600' },
  quantityControls: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: {
    backgroundColor: '#334155',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: { fontSize: 24, color: '#F8FAFC', fontWeight: '600', lineHeight: 28 },
  qtyValue: { fontSize: 20, color: '#F8FAFC', fontWeight: 'bold', marginHorizontal: 20 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    backgroundColor: '#38BDF8',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: { color: '#0F172A', fontSize: 18, fontWeight: '900' }
});
