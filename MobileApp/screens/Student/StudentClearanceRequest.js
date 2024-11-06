import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const StudentClearanceRequest = () => {
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [graduating, setGraduating] = useState('');
  const [currentSemester, setCurrentSemester] = useState('Loading...');
  const [currentAcademicYear, setCurrentAcademicYear] = useState('Loading...');
  const [studentFirstName, setStudentFirstName] = useState('Loading...');
  const [studentInternalId, setStudentInternalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigation = useNavigation();

  const firstSemesterDepartments = [
    { id: '2', name: 'Cashier' },
    { id: '5', name: 'Dean' },
    { id: '6', name: 'Guidance' },
    { id: '8', name: 'Library' },
    { id: '9', name: 'Registrar' },
    { id: '11', name: 'Student Affairs' },
    { id: '12', name: 'Student Discipline' },
  ];

  const allDepartments = [
    { id: '1', name: 'Adviser' },
    { id: '2', name: 'Cashier' },
    { id: '3', name: 'Clinic' },
    { id: '4', name: 'Cluster Coordinator' },
    { id: '5', name: 'Dean' },
    { id: '6', name: 'Guidance' },
    { id: '7', name: 'Laboratory' },
    { id: '8', name: 'Library' },
    { id: '9', name: 'Registrar' },
    { id: '10', name: 'Spiritual Affairs' },
    { id: '11', name: 'Student Affairs' },
    { id: '12', name: 'Student Discipline' },
    { id: '13', name: 'Supreme Student Council' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    const userId = await AsyncStorage.getItem('userId');
    const role = await AsyncStorage.getItem('role');
    const exp = await AsyncStorage.getItem('exp');
    const token = await AsyncStorage.getItem('token');
    const currentTime = new Date().getTime();

    if (!role || !exp || exp * 1000 < currentTime) {
      handleLogout();
    } else if (role !== 'ROLE_ROLE_STUDENT') {
      showCustomAlert('Unauthorized access. You will be redirected to login.');
      handleLogout();
    } else {
      await fetchStudentData(userId, token);
    }
  };

  const fetchStudentData = async (userId, token) => {
    try {
      const [semesterResponse, studentResponse] = await Promise.all([
        axios.get('https://amused-gnu-legally.ngrok-free.app/Admin/semester/current', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`https://amused-gnu-legally.ngrok-free.app/Student/students/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCurrentSemester(semesterResponse.data.currentSemester || 'N/A');
      setCurrentAcademicYear(semesterResponse.data.academicYear || 'N/A');
      setStudentFirstName(studentResponse.data.firstName || 'N/A');
      setStudentInternalId(studentResponse.data.id);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSemesterChange = (selectedSemester) => {
    const normalizedSelectedSemester = selectedSemester === 'first' ? 'first_semester' : 'second_semester';
    const normalizedCurrentSemester = currentSemester.toLowerCase();

    if (normalizedSelectedSemester !== normalizedCurrentSemester) {
      showCustomAlert(`You are only allowed to choose ${currentSemester.replace('_', ' ')}.`);
    } else {
      setSemester(selectedSemester);
    }
  };

  const handleSchoolYearChange = (selectedYear) => {
    if (selectedYear !== currentAcademicYear) {
      showCustomAlert(`You are only allowed to choose the current academic year: ${currentAcademicYear}.`);
    } else {
      setSchoolYear(selectedYear);
    }
  };

  const handleGraduatingChange = (selectedGraduating) => {
    setGraduating(selectedGraduating);
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
  
    if (!studentInternalId || !department || !semester || !schoolYear) {
      showCustomAlert('Please fill in all fields.');
      return;
    }
  
    try {
      const existingRequestResponse = await axios.get(
        `https://amused-gnu-legally.ngrok-free.app/Requests/student/${studentInternalId}/department/${department}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (existingRequestResponse.data.length > 0) {
        showCustomAlert('You have already submitted a clearance request to this department.');
        return;
      }
    } catch (error) {
      console.error('Error checking existing requests:', error);
      showCustomAlert('Error checking existing requests. Please try again later.');
      return;
    }
  
    const clearanceRequest = {
      student: { id: studentInternalId },
      department: { id: parseInt(department, 10) },
      semester: semester === 'first' ? 'First Semester' : 'Second Semester',
      schoolYear,
      graduating: graduating === 'yes' ? 1 : 0,
    };
  
    try {
      const response = await fetch('https://amused-gnu-legally.ngrok-free.app/Requests/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clearanceRequest),
      });
  
      if (response.ok) {
        showCustomAlert('Clearance request successfully added.');
      } else {
        const errorMessage = await response.text();
        showCustomAlert(`Failed to add clearance request. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      showCustomAlert('Failed to submit clearance request. Please try again.');
    }
  };

  const availableDepartments = semester === 'first' ? firstSemesterDepartments : allDepartments;

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <LinearGradient
      colors={['#266ca9', '#0042be']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.content}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello</Text>
            <Text style={styles.name}>{studentFirstName}</Text>
          </View>
          <Image source={require('../../assets/images/avatar2.png')} style={styles.avatar} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>CLEARANCE REQUEST</Text>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={semester} onValueChange={handleSemesterChange} style={styles.picker}>
              <Picker.Item label="Semester" value="" />
              <Picker.Item label="First Semester" value="first" />
              <Picker.Item label="Second Semester" value="second" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={department} onValueChange={(itemValue) => setDepartment(itemValue)} style={styles.picker}>
              <Picker.Item label="Select Department" value="" />
              {availableDepartments.map(dept => (
                <Picker.Item key={dept.id} label={dept.name} value={dept.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={schoolYear} onValueChange={handleSchoolYearChange} style={styles.picker}>
              <Picker.Item label="School Year" value="" />
              <Picker.Item label="2023-2024" value="2023-2024" />
              <Picker.Item label="2024-2025" value="2024-2025" />
              <Picker.Item label="2025-2026" value="2025-2026" />
              <Picker.Item label="2026-2027" value="2026-2027" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={graduating} onValueChange={handleGraduatingChange} style={styles.picker}>
              <Picker.Item label="Graduating?" value="" />
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StudentDashboard')}>
          <Image source={require('../../assets/images/blhome.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StudentClearanceRequest')}>
          <Image source={require('../../assets/images/blidcard.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StudentClearanceStatus')}>
          <Image source={require('../../assets/images/blnotes.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StudentProfile')}>
          <Image source={require('../../assets/images/bluser.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>

      {/* Custom Alert Modal */}
      <Modal
        visible={showAlertModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAlertModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAlertModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    marginTop: 0,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    color: 'white',
    fontSize: 14,
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '60%',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#266ca9',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#1E88E5',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  navItem: {
    padding: 8,
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#0042be',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentClearanceRequest;
