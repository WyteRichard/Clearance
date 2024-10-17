import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StudentNavigator from './StudentNavigator';
import AuthNavigator from './AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function MainNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const getRole = async () => {
      try {
        const role = await AsyncStorage.getItem('role');
        if (role === 'ROLE_STUDENT') {
          setInitialRoute('Student');
        } else {
          setInitialRoute('Auth');
        }
      } catch (error) {
        console.error('Failed to get role from AsyncStorage:', error);
        setInitialRoute('Auth');
      }
    };

    getRole();
  }, []);

  if (!initialRoute) {
    return null; // or a loading spinner
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Student" component={StudentNavigator} />
    </Stack.Navigator>
  );
}
