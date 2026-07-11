import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import SelectProductScreen from '../screens/SelectProductScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import PaymentStatusScreen from '../screens/PaymentStatusScreen';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  SelectProduct: { product: any };
  Checkout: { product: any, quantity?: number };
  PaymentStatus: { success: boolean; transactionId?: string; error?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SelectProduct" component={SelectProductScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="PaymentStatus" component={PaymentStatusScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
