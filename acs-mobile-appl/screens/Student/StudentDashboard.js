import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, RefreshControl, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const StudentDashboard = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("Loading...");
  const [currentSemester, setCurrentSemester] = useState("Loading...");
  const [currentAcademicYear, setCurrentAcademicYear] = useState("Loading...");
  const [clearedCount, setClearedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [remarkCount, setRemarkCount] = useState(0);
  const [importantDates, setImportantDates] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(300)).current;

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
      fetchFirstName(userId, token);
      fetchSemesterData(token);
      fetchStatusCounts(userId, token);
      fetchImportantDates(token);
    }
  };

  const fetchFirstName = async (userId, token) => {
    try {
      const response = await axios.get(`https://amused-gnu-legally.ngrok-free.app/Student/students/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setFirstName(response.data.firstName);
    } catch (error) {
      console.error("Error fetching first name:", error);
      setError("Error fetching first name");
    }
  };

  const fetchSemesterData = async (token) => {
    try {
      const response = await axios.get('https://amused-gnu-legally.ngrok-free.app/Admin/semester/current', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const { currentSemester, academicYear } = response.data;
      setCurrentSemester(currentSemester);
      setCurrentAcademicYear(academicYear);
    } catch (error) {
      console.error("Error fetching semester data:", error);
      setError("Error fetching semester and academic year data");
    }
  };

  const fetchStatusCounts = async (userId, token) => {
    try {
      const response = await axios.get(`https://amused-gnu-legally.ngrok-free.app/Status/student/${userId}/status-counts`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const { cleared, pending, remarks } = response.data;
      setClearedCount(cleared);
      setPendingCount(pending);
      setRemarkCount(remarks);
    } catch (error) {
      console.error("Error fetching status counts:", error);
      setError("Error fetching clearance status counts");
    }
  };

  const fetchImportantDates = async (token) => {
    try {
      const response = await axios.get('https://amused-gnu-legally.ngrok-free.app/announcements/all', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        const dates = response.data.map(announcement => ({
          title: announcement.title,
          date: new Date(announcement.announcementDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          }),
          details: announcement.details
        }));
        setImportantDates(dates);
      } else {
        setError("Failed to fetch important dates.");
      }
    } catch (error) {
      console.error("Error fetching important dates:", error);
      setError("Error fetching important dates");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
    Animated.timing(sidebarAnimation, {
      toValue: isSidebarVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 20) toggleSidebar();
    },
  });

  return (
    <LinearGradient style={styles.container} colors={['#266ca9', '#0042be']}>
      <SafeAreaView style={styles.content}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello</Text>
              <Text style={styles.name}>{firstName}</Text>
            </View>
            <TouchableOpacity onPress={toggleSidebar}>
              <Image source={require('../../assets/images/wmenu.png')} style={styles.menuIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>A.Y. {currentAcademicYear} - {currentSemester}</Text>
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

          <View style={styles.importantDatesCard}>
            <Text style={styles.AnnouncementTitle}>Important Dates</Text>
            {importantDates.map((date, index) => (
              <View key={index} style={styles.dateItem}>
                <Image source={require('../../assets/images/calendar.png')} style={styles.dateIcon} />
                <View>
                  <Text style={styles.dateText}>{date.title} - {date.date}</Text>
                  <Text style={styles.detailsText}>{date.details}</Text>
                </View>
              </View>
            ))}
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>

        {/* Sidebar */}
        {isSidebarVisible && (
          <Animated.View
            style={[
              styles.sidebar,
              { transform: [{ translateX: sidebarAnimation }] }
            ]}
            {...panResponder.panHandlers}
          >
            <Text style={styles.sidebarTitle}>Menu</Text>

            <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('StudentDashboard'); }} style={styles.sidebarLinkContainer}>
              <Image source={require('../../assets/images/bhome.png')} style={styles.sidebarIcon} />
              <Text style={styles.sidebarLink}>Dashboard</Text>
              <Image source={require('../../assets/images/arrow.png')} style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('StudentClearanceStatus'); }} style={styles.sidebarLinkContainer}>
              <Image source={require('../../assets/images/bnotes.png')} style={styles.sidebarIcon} />
              <Text style={styles.sidebarLink}>Clearance Status</Text>
              <Image source={require('../../assets/images/arrow.png')} style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('StudentProfile'); }} style={styles.sidebarLinkContainer}>
              <Image source={require('../../assets/images/buser.png')} style={styles.sidebarIcon} />
              <Text style={styles.sidebarLink}>My Profile</Text>
              <Image source={require('../../assets/images/arrow.png')} style={styles.arrowIcon} />
            </TouchableOpacity>

            <View style={styles.logoutContainer}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Image source={require('../../assets/images/logout.png')} style={styles.logoutIcon} />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
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
  menuIcon: {
    width: 35,
    height: 35,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
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
  importantDatesCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  AnnouncementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dateIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '60%',
    backgroundColor: 'white',
    padding: 20,
  },
  sidebarTitle: {
    fontSize: 26,
    color: '#1457cc',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  sidebarLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sidebarIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  sidebarLink: {
    fontSize: 16,
    color: '#266ca9',
    paddingVertical: 10,
  },
  arrowIcon: {
    marginLeft: 'auto',
    width: 16,
    height: 16,
    tintColor: '#c0c0c0',
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#E53935',
  },
  logoutText: {
    fontSize: 18,
    color: '#E53935',
  },
  errorText: {
    color: '#266ca9',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default StudentDashboard;
