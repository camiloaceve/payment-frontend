import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image?: string;
}

export default function HomeScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        const data = response.data.data || response.data;
        setProducts(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Refresh products every time we enter the screen
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });

    fetchProducts();
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Product }) => {
    const outOfStock = item.stock <= 0;
    const imageUrl = item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop';
    
    return (
      <TouchableOpacity 
        style={[styles.card, outOfStock && styles.cardDisabled]} 
        activeOpacity={0.9}
        disabled={outOfStock}
        onPress={() => navigation.navigate('SelectProduct', { product: item })}
      >
        <Image source={{ uri: imageUrl }} style={[styles.image, outOfStock && styles.imageDisabled]} />
        <View style={styles.cardInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price.toLocaleString('es-CO')}</Text>
          <Text style={[styles.stockText, outOfStock && styles.outOfStockText]}>
            {outOfStock ? 'No disponible' : `Disponibles: ${item.stock}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Products</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0284C7" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 60 },
  header: { fontSize: 28, fontWeight: '800', color: '#0F172A', paddingHorizontal: 20, marginBottom: 20 },
  list: { paddingHorizontal: 20 },
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
  cardDisabled: { opacity: 0.6 },
  image: { width: '100%', height: 250, resizeMode: 'cover' },
  imageDisabled: { tintColor: 'gray' },
  cardInfo: { padding: 20 },
  productName: { fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  productPrice: { fontSize: 22, fontWeight: 'bold', color: '#0284C7', marginBottom: 4 },
  stockText: { fontSize: 14, color: '#10B981', fontWeight: '600' },
  outOfStockText: { color: '#EF4444' }
});
