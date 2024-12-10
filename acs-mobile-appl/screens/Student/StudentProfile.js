import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, RefreshControl, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const StudentProfile = () => {
  const navigation = useNavigation();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [contactNumberError, setContactNumberError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [birthdateError, setBirthdateError] = useState(null);
  const [activeTab, setActiveTab] = useState('Student');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const role = await AsyncStorage.getItem('role');
    const exp = await AsyncStorage.getItem('exp');
    const token = await AsyncStorage.getItem('token');
    const currentTime = new Date().getTime();

    if (!role || !exp || exp * 1000 < currentTime) {
      handleLogout();
    } else if (role !== "ROLE_ROLE_STUDENT") {
      Alert.alert("Unauthorized access", "You will be redirected to login.");
      handleLogout();
    } else {
      fetchStudentData(userId, token);
    }
  };

  const fetchStudentData = async (userId, token) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://amused-gnu-legally.ngrok-free.app/Student/students/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStudent(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (activeTab === 'Contact' || activeTab === 'Personal') {
      setIsEditing(true);
      setContactNumberError(null);
      setEmailError(null);
      setBirthdateError(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(student);
    setContactNumberError(null);
    setEmailError(null);
    setBirthdateError(null);
  };

  const handleSave = async () => {
    if (formData.contactNumber && formData.contactNumber.length !== 11) {
      setContactNumberError('Contact number must be exactly 11 digits.');
      return;
    } else {
      setContactNumberError(null);
    }
  
    if (formData.email && !formData.email.includes('@')) {
      setEmailError('Please enter a valid email address with an "@" symbol.');
      return;
    } else {
      setEmailError(null);
    }

    if (!formData.birthdate) {
      setBirthdateError("Birthdate is required.");
      return;
    } else {
      setBirthdateError(null);
    }

    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
  
    const formDataToSend = new FormData();
    if (formData.contactNumber) formDataToSend.append("contactNumber", formData.contactNumber);
    if (formData.email) formDataToSend.append("email", formData.email);
    if (formData.address) formDataToSend.append("address", formData.address);
    if (formData.religion) formDataToSend.append("religion", formData.religion);
    if (formData.birthdate) {
      const simplifiedDate = formData.birthdate.split('T')[0];
      formDataToSend.append("birthdate", simplifiedDate);
    }
    if (formData.birthplace) formDataToSend.append("birthplace", formData.birthplace);
    if (formData.citizenship) formDataToSend.append("citizenship", formData.citizenship);
    if (formData.civilStatus) formDataToSend.append("civilStatus", formData.civilStatus);
    if (formData.sex) formDataToSend.append("sex", formData.sex);
  
    try {
      const response = await axios.put(
        `https://amused-gnu-legally.ngrok-free.app/Student/student/${userId}`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setStudent(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating student data:', error);
      const errorMessage = error.response?.data?.message || 'An unknown error occurred while processing the request';
      alert(`Update failed: ${errorMessage}`);
    }
  };
  
  const handleChange = (name, value) => {
    if (name === 'contactNumber') {
      if (/[^0-9]/.test(value)) {
        setContactNumberError('Contact number can only contain numbers.');
        return;
      } else if (value.length > 11) {
        setContactNumberError('Contact number cannot exceed 11 digits.');
        value = value.slice(0, 11);
      } else if (value.length === 11) {
        setContactNumberError('');
      } else {
        setContactNumberError('');
      }
    }

    if (name === 'email' && value && !value.includes('@')) {
      setEmailError('Please enter a valid email address with an "@" symbol.');
    } else {
      setEmailError(null);
    }

    if (name === 'birthdate' && value) {
      setBirthdateError(null);
    }

    setFormData({ ...formData, [name]: value });
  };
  
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleDateChange = (event, selectedDate) => {
  setShowDatePicker(false);

  if (event.type === 'dismissed') {
    setBirthdateError(null);
    return;
  }

  if (selectedDate) {
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);

    if (selectedDateObj > currentDate) {
      setBirthdateError("Birthdate cannot be in the future.");
      setFormData({ ...formData, birthdate: '' });
      return;
    }

    const ageDiff = currentDate.getFullYear() - selectedDateObj.getFullYear();
    const isUnder15 = ageDiff < 15 || 
                      (ageDiff === 15 && currentDate.getMonth() < selectedDateObj.getMonth()) ||
                      (ageDiff === 15 && currentDate.getMonth() === selectedDateObj.getMonth() && currentDate.getDate() < selectedDateObj.getDate());

    if (isUnder15) {
      setBirthdateError("You must be at least 15 years old.");
      setFormData({ ...formData, birthdate: '' });
      return;
    }

    setBirthdateError(null);
    setFormData({ ...formData, birthdate: selectedDateObj.toISOString().split('T')[0] });
  }
};
  
  

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const renderContent = () => {
    if (activeTab === 'Student') {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Student Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.infoText}>{student ? `${student.firstName} ${student.middleName} ${student.lastName}` : "Loading..."}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Text style={styles.label}>Student ID</Text>
            <Text style={styles.infoText}>{student ? student.studentNumber : "N/A"}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Text style={styles.label}>Year Level</Text>
            <Text style={styles.infoText}>{student ? student.yearLevel?.yearLevel : "N/A"}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Text style={styles.label}>Course</Text>
            <Text style={styles.infoText}>{student ? student.course?.courseName : "N/A"}</Text>
          </View>
        </View>
      );
    } else if (activeTab === 'Contact') {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Contact Number</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.contactNumber || ''}
                onChangeText={(value) => handleChange('contactNumber', value)}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoText}>{student ? student.contactNumber : 'N/A'}</Text>
            )}
            {contactNumberError && <Text style={styles.errorMessage}>{contactNumberError}</Text>}
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Text style={styles.label}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.email || ''}
                onChangeText={(value) => handleChange('email', value)}
              />
            ) : (
              <Text style={styles.infoText}>{student ? student.email : 'N/A'}</Text>
            )}
            {emailError && <Text style={styles.errorMessage}>{emailError}</Text>}
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Text style={styles.label}>Address</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.address || ''}
                onChangeText={(value) => handleChange('address', value)}
              />
            ) : (
              <Text style={styles.infoText}>{student ? student.address : 'N/A'}</Text>
            )}
          </View>
        </View>
      );
    } else if (activeTab === 'Personal') {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Religion</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.religion || ''}
                onChangeText={(value) => handleChange('religion', value)}
              />
            ) : (
              <Text style={styles.infoText}>{student ? student.religion : 'N/A'}</Text>
            )}
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Text style={styles.label}>Birthdate</Text>
            {isEditing ? (
              <View style={styles.datePickerContainer}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={formData.birthdate ? formatDate(formData.birthdate) : ''}
                  placeholder="Select Date"
                  editable={false}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.iconContainer}>
                  <Image source={require('../../assets/images/bcalendar.png')} style={styles.calendarIcon} />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.infoText}>{student ? formatDate(student.birthdate) : 'N/A'}</Text>
            )}
            {birthdateError && <Text style={styles.errorMessage}>{birthdateError}</Text>}
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={formData.birthdate ? new Date(formData.birthdate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Text style={styles.label}>Birthplace</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.birthplace || ''}
                onChangeText={(value) => handleChange('birthplace', value)}
              />
            ) : (
              <Text style={styles.infoText}>{student ? student.birthplace : 'N/A'}</Text>
            )}
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Text style={styles.label}>Citizenship</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.citizenship || ''}
                onChangeText={(value) => handleChange('citizenship', value)}
              />
            ) : (
              <Text style={styles.infoText}>{student ? student.citizenship : 'N/A'}</Text>
            )}
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Text style={styles.label}>Civil Status</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.civilStatus || ''}
                onChangeText={(value) => handleChange('civilStatus', value)}
              />
            ) : (
              <Text style={styles.infoText}>{student ? student.civilStatus : 'N/A'}</Text>
            )}
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Text style={styles.label}>Sex</Text>
            {isEditing ? (
              <Picker
                selectedValue={formData.sex}
                onValueChange={(value) => handleChange('sex', value)}
                style={styles.input}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            ) : (
              <Text style={styles.infoText}>{student ? student.sex : 'N/A'}</Text>
            )}
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Account</Text>
        <View style={styles.headerIcons}>
          {!isEditing && (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
                <Image source={require('../../assets/images/wkey.png')} style={styles.headerIcon} />
              </TouchableOpacity>
              {(activeTab === 'Contact' || activeTab === 'Personal') && (
                <TouchableOpacity onPress={handleEdit}>
                  <Image source={require('../../assets/images/weditp.png')} style={styles.headerIcon} />
                </TouchableOpacity>
              )}
            </>
          )}

          {isEditing && (
            <>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Student')} style={[styles.tab, activeTab === 'Student' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'Student' && styles.activeTabText]}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Contact')} style={[styles.tab, activeTab === 'Contact' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'Contact' && styles.activeTabText]}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Personal')} style={[styles.tab, activeTab === 'Personal' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'Personal' && styles.activeTabText]}>Personal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {renderContent()}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Image source={require('../../assets/images/logout.png')} style={styles.logoutIcon} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#266ca9',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#266ca9',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
  },
  activeTabText: {
    color: '#266ca9',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#266ca9',
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#266ca9',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    color: '#266ca9',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
  },
  iconContainer: {
    marginLeft: 10,
  },
  calendarIcon: {
    width: 24,
    height: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: 'red',
    marginRight: 8,
  },
  logoutButtonText: {
    color: 'red',
    fontSize: 18,
  },
  input: { 
    borderBottomWidth: 1 
  },
  editActions: { 
    flexDirection: 'row', 
    justifyContent: 'center',
    marginVertical: 20,
  },
  saveButton: { 
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#42c3ff',
    borderWidth: 1,
    borderColor: '#42c3ff',
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: { 
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
  },
  cancelButtonText: {
    color: 'black',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default StudentProfile;
