import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation hook

const StudentClearanceRequest = () => {
  
  const [semester, setSemester] = React.useState('');
  const [schoolYear, setSchoolYear] = React.useState('');
  const [graduating, setGraduating] = React.useState('');
  
  const navigation = useNavigation();  // Initialize navigation

  // Navigation functions for the bottom navbar
  const handleMenuPress = () => {
    navigation.navigate('StudentDashboard');  // Navigate to Student Dashboard
  };

  const handleRequestPress = () => {
    navigation.navigate('StudentClearanceRequest');  // Navigate to Clearance Request
  };

  const handleStatusPress = () => {
    navigation.navigate('StudentClearanceStatus');  // Navigate to Clearance Status
  };

  const handleAccountPress = () => {
    navigation.navigate('StudentProfile');  // Navigate to Profile
  };

  return (
    <LinearGradient
      colors={['#266ca9', '#0042be']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello</Text>
          <Text style={styles.name}>Aiah Nadine</Text>
        </View>
        <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>CLEARANCE REQUEST</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={semester}
              onValueChange={(itemValue) => setSemester(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Semester" value="" />
              <Picker.Item label="First Semester" value="first" />
              <Picker.Item label="Second Semester" value="second" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={schoolYear}
              onValueChange={(itemValue) => setSchoolYear(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="School Year" value="" />
              <Picker.Item label="2023-2024" value="2023-2024" />
              <Picker.Item label="2024-2025" value="2024-2025" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={graduating}
              onValueChange={(itemValue) => setGraduating(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Graduating?" value="" />
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={handleMenuPress}>
          <Image source={require('../../assets/images/blhome.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleRequestPress}>
          <Image source={require('../../assets/images/blidcard.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleStatusPress}>
          <Image source={require('../../assets/images/blnotes.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleAccountPress}>
          <Image source={require('../../assets/images/bluser.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
    paddingBottom: 40,
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
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
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
});

export default StudentClearanceRequest;