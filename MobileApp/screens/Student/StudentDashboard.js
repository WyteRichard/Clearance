import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const StudentDashboard = () => {
  const navigation = useNavigation();
  const [currentSemester, setCurrentSemester] = useState("Loading...");
  const [currentAcademicYear, setCurrentAcademicYear] = useState("Loading...");
  const [clearedCount, setClearedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [remarkCount, setRemarkCount] = useState(0);
  const [firstName, setFirstName] = useState("Loading...");
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = 1; // Replace with actual student ID

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [semesterResponse, statusResponse, studentResponse] = await Promise.all([
          fetch('http://192.168.1.6:8080/Admin/semester/current').then(res => res.ok ? res.json() : Promise.reject('Semester data failed')),
          fetch(`http://192.168.1.6:8080/Status/student/${studentId}/status-counts`).then(res => res.ok ? res.json() : Promise.reject('Status counts failed')),
          fetch(`http://192.168.1.6:8080/Student/students/${studentId}`).then(res => res.ok ? res.json() : Promise.reject('Student data failed'))
        ]);

        setCurrentSemester(semesterResponse.currentSemester);
        setCurrentAcademicYear(semesterResponse.academicYear);
        setClearedCount(statusResponse.cleared);
        setPendingCount(statusResponse.pending);
        setRemarkCount(statusResponse.remarks);
        setFirstName(studentResponse.firstName);
      } catch (error) {
        setError("Failed to load data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(intervalId); 
  }, [studentId]);

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={['#266ca9', '#0042be']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>A.Y. {currentAcademicYear} - {currentSemester}</Text>
          <Text style={styles.cardSubtitle}>{currentDateTime}</Text>
        </View>

        <Text style={styles.sectionTitle}>Clearance Status</Text>

        <View style={styles.statusContainer}>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Cleared</Text>
            <Text style={styles.statusValue}>{clearedCount}</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Pending</Text>
            <Text style={styles.statusValue}>{pendingCount}</Text>
          </View>
          <View style={[styles.statusCard, styles.fullWidth]}>
            <Text style={styles.statusLabel}>Remarks</Text>
            <Text style={styles.statusValue}>{remarkCount}</Text>
          </View>
        </View>

        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('StudentDashboard')}>
            <Image source={require('../../assets/images/blhome.png')} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('StudentClearanceRequest')}>
            <Image source={require('../../assets/images/blidcard.png')} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('StudentClearanceStatus')}>
            <Image source={require('../../assets/images/blnotes.png')} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('StudentProfile')}>
            <Image source={require('../../assets/images/bluser.png')} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
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
    marginTop: 20,
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
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statusCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    width: '45%',
    alignItems: 'center',
  },
  fullWidth: {
    width: '94%',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
    marginTop: 8,
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

export default StudentDashboard;
