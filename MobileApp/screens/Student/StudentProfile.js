import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const StudentAccount = () => {
  const navigation = useNavigation();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.1.6:8080/Student/students/1'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleLogout = () => {
    navigation.navigate('Login');
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Information</Text>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/buser.png')} style={styles.icon} />
            <Text style={styles.infoText}>{`${student.firstName} ${student.middleName} ${student.lastName}`}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bphone.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.contactNumber}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bmail.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.email}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bsid.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.studentNumber}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bcourse.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.course.courseName}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bghat.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.yearLevel.yearLevel}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/address.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.address}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/religion.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.religion}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bdate.png')} style={styles.icon} />
            <Text style={styles.infoText}>{formatDate(student.birthdate)}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bplace.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.birthplace}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/citizen.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.citizenship}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/cvstat.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.civilStatus}</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/sex.png')} style={styles.icon} />
            <Text style={styles.infoText}>{student.sex}</Text>
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
