import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { saveTransactionSecurely } from '../store/slices/transactionSlice';
import axios from 'axios';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Checkout'>;
  route: RouteProp<RootStackParamList, 'Checkout'>;
};

// WOMPI PUBLIC KEY FROM ENVIRONMENT OR HARDCODED FOR THIS TEST
const WOMPI_PUB_KEY = 'pub_test_Q5yDA9xoKdePzhSGeVe9HAez7HgGORGf';

export default function CheckoutScreen({ navigation, route }: Props) {
  const { product, quantity = 1 } = route.params;
  const dispatch = useDispatch<any>();
  
  const totalAmount = Number(product.price) * quantity;

  // Customer Data
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Billing Data
  const [legalIdType, setLegalIdType] = useState('');
  const [legalId, setLegalId] = useState('');

  // Credit Card Data (Modal)
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  
  const [loading, setLoading] = useState(false);

  // Simple card franchise detection
  const getCardType = (number: string) => {
    if (number.startsWith('4')) return 'VISA';
    if (number.startsWith('5')) return 'MASTERCARD';
    return '💳';
  };

  const handlePayment = async () => {
    if (!cardNumber || !cvc || !expMonth || !expYear || !fullName || !email) {
      Alert.alert('Incompleto', 'Por favor completa todos los datos para continuar');
      return;
    }

    setLoading(true);

    try {
      // 1. Tokenize Card with Wompi
      const wompiRes = await axios.post('https://sandbox.wompi.co/v1/tokens/cards', {
        number: cardNumber.replace(/\s/g, ''),
        cvc,
        exp_month: expMonth,
        exp_year: expYear,
        card_holder: fullName
      }, {
        headers: {
          Authorization: `Bearer ${WOMPI_PUB_KEY}`
        }
      });

      const cardToken = wompiRes.data.data.id;

      // 2. Send to Backend using dynamic product ID, quantity and total amount
      const backendRes = await axios.post('https://3dx9wnxkyc.execute-api.us-east-2.amazonaws.com/dev/payments', {
        productId: product.id,
        quantity: quantity,
        amount: totalAmount,
        customerEmail: email,
        installments: 1,
        creditCardToken: cardToken,
        customerData: {
          phoneNumber: phone,
          fullName: fullName
        },
        billingData: {
          legalIdType: legalIdType,
          legalId: legalId
        }
      });

      const result = backendRes.data;

      // 3. Save to Redux and Navigate
      if (result.success) {
        dispatch(saveTransactionSecurely(result.transaction));
        setShowModal(false);
        navigation.navigate('PaymentStatus', { 
          success: true, 
          transactionId: result.transaction.id 
        });
      } else {
        throw new Error(result.error || 'Transacción Fallida');
      }

    } catch (error: any) {
      console.log('Payment Error:', error.response?.data || error.message);
      Alert.alert('Pago Fallido', error.response?.data?.message || 'Hubo un error procesando el pago. Intenta de nuevo.');
      setShowModal(false);
      navigation.navigate('PaymentStatus', { 
        success: false, 
        error: error.response?.data?.message || 'Transacción Rechazada'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Caja / Pago</Text>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de la Orden</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>{product.name} (x{quantity})</Text>
            <Text style={styles.summaryPrice}>${totalAmount.toLocaleString('es-CO')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos Personales</Text>
          <TextInput style={styles.input} placeholder="Nombre Completo" placeholderTextColor="#64748B" value={fullName} onChangeText={setFullName} />
          <TextInput style={styles.input} placeholder="Correo Electrónico" placeholderTextColor="#64748B" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#64748B" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de Facturación</Text>
          <TextInput style={styles.input} placeholder="Tipo (CC, CE, NIT)" placeholderTextColor="#64748B" autoCapitalize="characters" value={legalIdType} onChangeText={setLegalIdType} />
          <TextInput style={styles.input} placeholder="Número de Documento" placeholderTextColor="#64748B" keyboardType="numeric" value={legalId} onChangeText={setLegalId} />
        </View>

        <TouchableOpacity style={styles.payButton} onPress={() => setShowModal(true)}>
          <Text style={styles.payButtonText}>Pagar con tarjeta de crédito</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BACKDROP MODAL FOR CREDIT CARD */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Información de la Tarjeta</Text>
            
            <View style={styles.cardTypeContainer}>
              <Text style={styles.cardTypeText}>{getCardType(cardNumber)}</Text>
            </View>

            <TextInput style={styles.modalInput} placeholder="Número de Tarjeta" placeholderTextColor="#64748B" keyboardType="numeric" maxLength={16} value={cardNumber} onChangeText={setCardNumber} />
            <View style={styles.row}>
              <TextInput style={[styles.modalInput, styles.half]} placeholder="MM" placeholderTextColor="#64748B" keyboardType="numeric" maxLength={2} value={expMonth} onChangeText={setExpMonth} />
              <TextInput style={[styles.modalInput, styles.half]} placeholder="YY" placeholderTextColor="#64748B" keyboardType="numeric" maxLength={2} value={expYear} onChangeText={setExpYear} />
              <TextInput style={[styles.modalInput, styles.half]} placeholder="CVC" placeholderTextColor="#64748B" keyboardType="numeric" maxLength={4} secureTextEntry value={cvc} onChangeText={setCvc} />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 20 }} />
            ) : (
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={handlePayment}>
                  <Text style={styles.confirmButtonText}>Confirmar Pago</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { padding: 24, paddingTop: 60, paddingBottom: 60 },
  header: { fontSize: 32, fontWeight: '900', color: '#F8FAFC', marginBottom: 24, letterSpacing: 1 },
  
  summaryCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryTitle: { fontSize: 16, color: '#94A3B8', marginBottom: 12, fontWeight: '600', textTransform: 'uppercase' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryText: { fontSize: 18, color: '#F8FAFC', fontWeight: '500' },
  summaryPrice: { fontSize: 24, color: '#38BDF8', fontWeight: '900' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#94A3B8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    color: '#F8FAFC',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '31%' },
  
  payButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  payButtonText: { color: '#0F172A', fontSize: 18, fontWeight: '900' },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: 50,
  },
  modalTitle: { fontSize: 24, fontWeight: '900', marginBottom: 16, color: '#F8FAFC' },
  cardTypeContainer: { alignItems: 'flex-end', marginBottom: 12 },
  cardTypeText: { fontSize: 20, fontWeight: '900', color: '#38BDF8', fontStyle: 'italic' },
  modalInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    color: '#F8FAFC',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  cancelButton: { padding: 16, width: '45%', alignItems: 'center' },
  cancelButtonText: { color: '#94A3B8', fontSize: 16, fontWeight: '700' },
  confirmButton: { backgroundColor: '#38BDF8', padding: 16, borderRadius: 12, width: '50%', alignItems: 'center' },
  confirmButtonText: { color: '#0F172A', fontSize: 16, fontWeight: '900' }
});
