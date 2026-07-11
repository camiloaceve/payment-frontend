import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

// Mock product based on the backend init.sql
const products = [
  {
    id: 'e2b6911c-772b-4171-8bc4-7eb38b971a81',
    name: 'Auriculares Inalámbricos Premium',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    description: 'Sonido de alta fidelidad con cancelación de ruido activa.'
  }
];

export default function HomeScreen({ navigation }: Props) {
  const renderItem = ({ item }: { item: typeof products[0] }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9}
      onPress={() => navigation.navigate('SelectProduct')}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toLocaleString('es-CO')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  cardInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0284C7',
  }
});
