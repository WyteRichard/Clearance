import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const StudentAccount = () => {
  const navigation = useNavigation();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

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
      const response = await axios.get(`http://192.168.1.19:8080/Student/students/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStudent(response.data);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Auth', { screen: 'Login' });
  };

  return (
    <LinearGradient
      colors={['#266ca9', '#0042be']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Information</Text>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/buser.png')} style={styles.icon} />
            <Text style={styles.infoText}>
              {student ? `${student.firstName} ${student.middleName} ${student.lastName}` : "Loading..."}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bphone.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.contactNumber : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bmail.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.email : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bsid.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.studentNumber : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bcourse.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.course?.courseName : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bghat.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.yearLevel?.yearLevel : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/address.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.address : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/religion.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.religion : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bdate.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? formatDate(student.birthdate) : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bplace.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.birthplace : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/citizen.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.citizenship : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/cvstat.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.civilStatus : "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/sex.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student ? student.sex : "N/A"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: { marginRight: 16 },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  contentContainer: { flex: 1 },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#266ca9',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  infoText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#D4D4D4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 90,
    marginHorizontal: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudentAccount;
