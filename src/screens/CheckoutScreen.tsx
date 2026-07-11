import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { saveTransactionSecurely } from '../store/slices/transactionSlice';
import axios from 'axios';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Checkout'>;
};

// WOMPI PUBLIC KEY FROM ENVIRONMENT OR HARDCODED FOR THIS TEST
const WOMPI_PUB_KEY = 'pub_test_Q5yDA9xoKdePzhSGeVe9HAez7HgGORGf';

export default function CheckoutScreen({ navigation }: Props) {
  const dispatch = useDispatch<any>();
  
  // Customer Data
  const [email, setEmail] = useState('lorenalopezganan@gmail.com');
  const [fullName, setFullName] = useState('Astrid Lorena Lopez');
  const [phone, setPhone] = useState('+573197226439');
  
  // Billing Data
  const [legalIdType, setLegalIdType] = useState('CC');
  const [legalId, setLegalId] = useState('1025520');

  // Credit Card Data (Modal)
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242424242424242');
  const [cvc, setCvc] = useState('123');
  const [expMonth, setExpMonth] = useState('12');
  const [expYear, setExpYear] = useState('30');
  
  const [loading, setLoading] = useState(false);

  // Simple card franchise detection
  const getCardType = (number: string) => {
    if (number.startsWith('4')) return 'VISA';
    if (number.startsWith('5')) return 'MASTERCARD';
    return 'UNKNOWN';
  };

  const handlePayment = async () => {
    if (!cardNumber || !cvc || !expMonth || !expYear) {
      Alert.alert('Error', 'Please fill all card details');
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

      // 2. Send to Backend
      const backendRes = await axios.post('http://localhost:3000/payments', {
        productId: 'e2b6911c-772b-4171-8bc4-7eb38b971a81',
        amount: 150000,
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
        throw new Error(result.error || 'Transaction Failed');
      }

    } catch (error: any) {
      console.log('Payment Error:', error.response?.data || error.message);
      Alert.alert('Payment Failed', error.response?.data?.message || 'Hubo un error procesando el pago. Intenta de nuevo.');
      setShowModal(false);
      navigation.navigate('PaymentStatus', { 
        success: false, 
        error: error.response?.data?.message || 'Transaction Declined'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Checkout</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Data</Text>
          <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing Data</Text>
          <TextInput style={styles.input} placeholder="ID Type (CC, CE, NIT)" value={legalIdType} onChangeText={setLegalIdType} />
          <TextInput style={styles.input} placeholder="ID Number" keyboardType="numeric" value={legalId} onChangeText={setLegalId} />
        </View>

        <TouchableOpacity style={styles.payButton} onPress={() => setShowModal(true)}>
          <Text style={styles.payButtonText}>Pay with credit card</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BACKDROP MODAL FOR CREDIT CARD */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Credit Card Info</Text>
            
            <View style={styles.cardTypeContainer}>
              <Text style={styles.cardTypeText}>
                {getCardType(cardNumber) !== 'UNKNOWN' ? getCardType(cardNumber) : '💳'}
              </Text>
            </View>

            <TextInput style={styles.input} placeholder="Card Number" keyboardType="numeric" maxLength={16} value={cardNumber} onChangeText={setCardNumber} />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.half]} placeholder="MM" keyboardType="numeric" maxLength={2} value={expMonth} onChangeText={setExpMonth} />
              <TextInput style={[styles.input, styles.half]} placeholder="YY" keyboardType="numeric" maxLength={2} value={expYear} onChangeText={setExpYear} />
              <TextInput style={[styles.input, styles.half]} placeholder="CVC" keyboardType="numeric" maxLength={4} secureTextEntry value={cvc} onChangeText={setCvc} />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0284C7" style={{ marginTop: 20 }} />
            ) : (
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={handlePayment}>
                  <Text style={styles.confirmButtonText}>Confirm Payment</Text>
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 24, paddingTop: 60 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#0F172A', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#334155', marginBottom: 12 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '30%' },
  payButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#0F172A' },
  cardTypeContainer: { alignItems: 'flex-end', marginBottom: 8 },
  cardTypeText: { fontSize: 20, fontWeight: 'bold', color: '#0284C7', fontStyle: 'italic' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  cancelButton: { padding: 16, width: '45%', alignItems: 'center' },
  cancelButtonText: { color: '#64748B', fontSize: 16, fontWeight: '600' },
  confirmButton: { backgroundColor: '#0284C7', padding: 16, borderRadius: 12, width: '50%', alignItems: 'center' },
  confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
