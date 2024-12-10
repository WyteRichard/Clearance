import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Auth/Login';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import RegisterStudent from '../screens/Auth/RegisterStudent';
import VerifyOtp from '../screens/Auth/VerifyOtp';

const AuthStack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="RegisterStudent" component={RegisterStudent} />
      <AuthStack.Screen name="VerifyOtp" component={VerifyOtp} />
    </AuthStack.Navigator>
  );
}

export default AuthNavigator;
