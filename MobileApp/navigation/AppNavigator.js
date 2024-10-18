import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Screens
import Login from '../screens/Auth/Login';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import RegisterStudent from '../screens/Auth/RegisterStudent';
import VerifyOtp from '../screens/Auth/VerifyOtp';

// Stack Navigators
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const StudentStack = createStackNavigator();

// Auth Navigator
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

// Student Navigator
function StudentNavigator() {
    return (
      <StudentStack.Navigator screenOptions={{ headerShown: false }}>
        <StudentStack.Screen name="StudentClearanceRequest" component={StudentClearanceRequest} />
        <StudentStack.Screen name="StudentClearanceStatus" component={StudentClearanceStatus} />
        <StudentStack.Screen name="StudentProfile" component={StudentProfile} />
        <StudentStack.Screen name="StudentDashboard" component={StudentDashboard} />
      </StudentStack.Navigator>
    );
  }

// Main App Navigator
export default function AppNavigator() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }