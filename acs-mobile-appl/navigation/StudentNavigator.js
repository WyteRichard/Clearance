import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StudentDashboard from '../screens/Student/StudentDashboard';
import StudentProfile from '../screens/Student/StudentProfile';
import StudentClearanceStatus from '../screens/Student/StudentClearanceStatus';
import ChangePassword from '../screens/Student/ChangePassword';

const StudentStack = createStackNavigator();

function StudentNavigator() {
  return (
    <StudentStack.Navigator screenOptions={{ headerShown: false }}>
      <StudentStack.Screen name="StudentDashboard" component={StudentDashboard} />
      <StudentStack.Screen name="StudentProfile" component={StudentProfile} />
      <StudentStack.Screen name="StudentClearanceStatus" component={StudentClearanceStatus} />
      <StudentStack.Screen name="ChangePassword" component={ChangePassword} />
    </StudentStack.Navigator>
  );
}

export default StudentNavigator;
