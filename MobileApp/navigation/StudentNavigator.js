import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StudentDashboard from '../screens/Student/StudentDashboard';
import StudentProfile from '../screens/Student/StudentProfile';
import StudentClearanceRequest from '../screens/Student/StudentClearanceRequest';
import StudentClearanceStatus from '../screens/Student/StudentClearanceStatus';

const StudentStack = createStackNavigator();

function StudentNavigator() {
  return (
    <StudentStack.Navigator screenOptions={{ headerShown: false }}>
      <StudentStack.Screen name="StudentDashboard" component={StudentDashboard} />
      <StudentStack.Screen name="StudentProfile" component={StudentProfile} />
      <StudentStack.Screen name="StudentClearanceRequest" component={StudentClearanceRequest} />
      <StudentStack.Screen name="StudentClearanceStatus" component={StudentClearanceStatus} />
    </StudentStack.Navigator>
  );
}

export default StudentNavigator;
