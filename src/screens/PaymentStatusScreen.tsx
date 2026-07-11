import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PaymentStatus'>;
  route: RouteProp<RootStackParamList, 'PaymentStatus'>;
};

export default function PaymentStatusScreen({ navigation, route }: Props) {
  const { success, transactionId, error } = route.params;
  
  // Requirement: Show we stored it in Redux securely
  const transactionData = useSelector((state: RootState) => state.transaction.transactionData);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{success ? '✅' : '❌'}</Text>
      </View>
      
      <Text style={styles.title}>{success ? 'Payment Successful!' : 'Payment Failed'}</Text>
      
      {success && transactionId ? (
        <Text style={styles.message}>
          Your order has been processed. Transaction ID: {transactionId}
        </Text>
      ) : (
        <Text style={styles.message}>
          {error || 'We could not process your payment at this time.'}
        </Text>
      )}

      {success && transactionData && (
        <View style={styles.secureBox}>
          <Text style={styles.secureTitle}>🔒 Securely Stored (Redux)</Text>
          <Text style={styles.secureText}>Reference: {transactionData.reference}</Text>
          <Text style={styles.secureText}>Status: {transactionData.status}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.popToTop()} // Go back to Home
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  secureBox: {
    backgroundColor: '#E0F2FE',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 32,
  },
  secureTitle: {
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 8,
  },
  secureText: {
    color: '#0284C7',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
