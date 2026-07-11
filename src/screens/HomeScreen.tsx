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
        const response = await axios.get('https://3dx9wnxkyc.execute-api.us-east-2.amazonaws.com/dev/products');
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
    
    let imageSource;
    if (item.image) {
      imageSource = { uri: item.image };
    } else if (item.name.toLowerCase().includes('teclado')) {
      imageSource = require('../../assets/mechanical_keyboard.jpg');
    } else {
      imageSource = { uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop' }; // Auriculares por defecto
    }
    
    return (
      <TouchableOpacity 
        style={[styles.card, outOfStock && styles.cardDisabled]} 
        activeOpacity={0.9}
        disabled={outOfStock}
        onPress={() => navigation.navigate('SelectProduct', { product: item })}
      >
        <Image source={imageSource} style={[styles.image, outOfStock && styles.imageDisabled]} />
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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Nuestros Productos</Text>
        <Text style={styles.headerSub}>Descubre tecnología de élite</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', paddingTop: 60 },
  headerContainer: { marginBottom: 24, paddingHorizontal: 20 },
  header: { fontSize: 34, fontWeight: '900', color: '#F8FAFC', letterSpacing: 1 },
  headerSub: { fontSize: 16, color: '#94A3B8', marginTop: 6, fontWeight: '500' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardDisabled: { opacity: 0.5 },
  image: { width: '100%', height: 260, resizeMode: 'cover' },
  imageDisabled: { tintColor: 'gray' },
  cardInfo: { padding: 24 },
  productName: { fontSize: 20, fontWeight: '800', color: '#F8FAFC', marginBottom: 8, letterSpacing: 0.5 },
  productPrice: { fontSize: 24, fontWeight: '900', color: '#38BDF8', marginBottom: 8 },
  stockText: { fontSize: 13, color: '#10B981', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  outOfStockText: { color: '#EF4444' }
});
