import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StudentNavigator from './StudentNavigator';

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Student" component={StudentNavigator} />
    </Stack.Navigator>
  );
}
