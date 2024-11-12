import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, StyleSheet, RefreshControl, Animated, PanResponder, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Print from 'expo-print';

const StudentClearanceStatus = () => {
  const [clearanceStatuses, setClearanceStatuses] = useState([]);
  const [filteredStatuses, setFilteredStatuses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentSemester, setCurrentSemester] = useState('Loading...');
  const [currentAcademicYear, setCurrentAcademicYear] = useState('Loading...');
  const [studentFirstName, setStudentFirstName] = useState('Loading...');
  const [studentMiddleName, setStudentMiddleName] = useState('Loading...');
  const [studentLastName, setStudentLastName] = useState('Loading...');
  const [studentNumber, setStudentNumber] = useState('Loading...');
  const [sectionName, setSectionName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logs, setLogs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [error, setError] = useState(null);
  const navigation = useNavigation();
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
    } else if (role !== 'ROLE_ROLE_STUDENT') {
      Alert.alert('Unauthorized access', 'You will be redirected to login.');
      handleLogout();
    } else {
      await fetchStudentData(userId, token);
    }
  };

  const fetchStudentData = async (userId, token) => {
    setLoading(true);
    try {
      const semesterResponse = await axios.get('https://amused-gnu-legally.ngrok-free.app/Admin/semester/current', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentSemester(semesterResponse.data.currentSemester || 'N/A');
      setCurrentAcademicYear(semesterResponse.data.academicYear || 'N/A');

      const studentResponse = await axios.get(`https://amused-gnu-legally.ngrok-free.app/Student/students/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentData = studentResponse.data;
      setStudentFirstName(studentData.firstName || 'N/A');
      setStudentMiddleName(studentData.middleName || '');
      setStudentLastName(studentData.lastName || 'N/A');
      setStudentNumber(studentData.studentNumber || 'N/A');
      setSectionName(studentData.section?.sectionName || 'N/A');

      const statusResponse = await axios.get(`https://amused-gnu-legally.ngrok-free.app/Status/student/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const clearanceData = Array.isArray(statusResponse.data) ? statusResponse.data : Object.values(statusResponse.data);
      setClearanceStatuses(clearanceData);
      setFilteredStatuses(clearanceData);
    } catch (error) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    const filtered = statusFilter
      ? clearanceStatuses.filter((status) => status.status.toLowerCase() === statusFilter)
      : clearanceStatuses;
    setFilteredStatuses(filtered);
  }, [statusFilter, clearanceStatuses]);

  const handleStatusFilterChange = (selectedFilter) => {
    setStatusFilter(selectedFilter);
  };

  const fetchLogs = async (departmentName) => {
    setSelectedDepartment(departmentName);
    setLogs([]);  // Clear any previous logs
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
  
      if (!userId || !token) {
        console.log("User ID or token is missing.");
        Alert.alert("Error", "User ID or token not found.");
        return;
      }
  
      console.log(`Fetching logs for student ID: ${userId} in department: ${departmentName}`);
  
      const response = await axios.get(
        `https://amused-gnu-legally.ngrok-free.app/Status/logs/${userId}/departmentName/${departmentName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data) {
        console.log("Logs fetched successfully:", response.data);
        setLogs(response.data);
      } else {
        console.log("No logs found for this department.");
        Alert.alert("Info", "No transaction logs available for this department.");
      }
  
      setShowLogModal(true);
    } catch (error) {
      console.error("Error fetching logs:", error);
      Alert.alert("Error", "Unable to fetch logs. Please check your network connection or try again later.");
    }
  };
  

  const handleLogsPress = (departmentName) => {
    console.log("Logs button pressed for department:", departmentName);
    fetchLogs(departmentName);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
    Animated.timing(sidebarAnimation, {
      toValue: isSidebarVisible ? -300 : 0, // Animate to 0 to open, -300 to close
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 20) toggleSidebar(); // Close sidebar on swipe right
    },
  });

  const handlePrint = async () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    })}`;

    const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; position: relative; }
          .date { font-size: small; color: #555; position: absolute; top: 10px; left: 10px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="date">${formattedDate}</div> <!-- Date positioned top left -->
        <h1 style="margin: 3;">Rogationist College</h1>
        <p style="margin: 0;">Km. 53 Aguinaldo Highway, Lalaan II, Silang Cavite, 4118</p>
        <p style="margin: 0;">Tel. No.: (046) 423-8677 / 423 - 8470</p>
        <h1>STUDENT CLEARANCE</h1>
        <p>Academic Year: ${currentAcademicYear}</p>
        <p>Semester: ${currentSemester.replace('_', ' ')}</p>
        <h2>${studentFirstName} ${studentMiddleName} ${studentLastName}</h2>
        <p>Student No.: ${studentNumber}</p>
        <p>Section: ${sectionName}</p>
        
        <table class="table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStatuses.map(status => `
              <tr>
                <td>${status.department || 'N/A'}</td>
                <td>${status.status || 'N/A'}</td>
                <td>${status.remarks || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    try {
        await Print.printAsync({ html: htmlContent });
        console.log("Print modal should open");
    } catch (error) {
        console.error('Print Error:', error);
        Alert.alert('Error', 'Could not print the document');
    }
};

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Auth', { screen: 'Login' });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <LinearGradient style={styles.container} colors={['#266ca9', '#0042be']}>
      <SafeAreaView style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello</Text>
              <Text style={styles.name}>{studentFirstName}</Text>
            </View>
            <TouchableOpacity onPress={toggleSidebar}>
              <Image source={require('../../assets/images/wmenu.png')} style={styles.menuIcon} />
            </TouchableOpacity>
          </View>

        <View style={[styles.infoContainer, styles.invisible]}>
          <Text style={styles.infoText}>A.Y. {currentAcademicYear || 'N/A'}</Text>
          <Text style={styles.infoText}>Semester: {currentSemester.replace('_', ' ') || 'N/A'}</Text>
          <Text style={styles.infoText}>Name: {`${studentFirstName || 'N/A'} ${studentMiddleName || ''} ${studentLastName || 'N/A'}`}</Text>
          <Text style={styles.infoText}>Student No.: {studentNumber || 'N/A'}</Text>
          <Text style={styles.infoText}>Section: {sectionName || 'N/A'}</Text>
        </View>

        <View style={styles.filterContainer}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={handleStatusFilterChange}
            style={styles.filterButton}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="Cleared" value="cleared" />
            <Picker.Item label="Pending" value="pending" />
          </Picker>
          <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
            <Image source={require('../../assets/images/printIcon.png')} style={styles.printIcon} />
            <Text style={{ color: 'white' }}>Print</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.departmentCell]}>Department</Text>
              <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
              <Text style={[styles.headerCell, styles.remarksCell]}>Remarks</Text>
              <Text style={[styles.headerCell, styles.actionCell]}>Action</Text>
            </View>

            <ScrollView style={styles.tableContent} nestedScrollEnabled={true}>
              {filteredStatuses.length > 0 ? (
                filteredStatuses.map((item, index) => {
                  console.log("Department name in item:", item.department); // Debugging
                  return (
                    <View key={index} style={styles.tableRow}>
                      <Text style={[styles.cell, styles.departmentCell]}>{item.department || 'N/A'}</Text>
                      <Text style={[styles.cell, styles.statusCell, item.status === 'Cleared' ? styles.cleared : styles.pending]}>{item.status || 'N/A'}</Text>
                      <Text style={[styles.cell, styles.remarksCell]}>{item.remarks || 'N/A'}</Text>
                      <TouchableOpacity
                        style={styles.logsButton}
                        onPress={() => handleLogsPress(item.department)}
                      >
                        <Text style={styles.logsButtonText}>Logs</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No clearance data available.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>


        <Modal visible={showLogModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Transaction Logs - {selectedDepartment}</Text>
              <ScrollView style={styles.logsContainer}>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <View key={index} style={styles.logEntry}>
                      <Text style={styles.logText}>
                        <Text style={styles.logLabel}>Date:</Text> {new Date(log.timestamp).toLocaleString()}
                      </Text>
                      <Text style={styles.logText}>
                        <Text style={styles.logLabel}>Transaction Type:</Text> {log.transactionType}
                      </Text>
                      <Text style={styles.logText}>
                        <Text style={styles.logLabel}>Details:</Text> {log.details}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text>No transaction logs available.</Text>
                )}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowLogModal(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  invisible: {
    display: 'none',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
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
  menuIcon: {
    width: 35,
    height: 35,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    width: 150,
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 2,
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  printButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#266ca9',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
  printIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  tableContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
    flex: 1,
    maxHeight: '85%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 8,
  },
  actionCell: {
    flex: 1,
    textAlign: 'center',
  },
  tableContent: {
    flexGrow: 1,
    maxHeight: 400,
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 10,
  },
  departmentCell: {
    flex: 2.5,
  },
  statusCell: {
    flex: 1.5,
  },
  remarksCell: {
    flex: 1.2,
  },
  cell: {
    fontSize: 14,
    paddingVertical: 12,
  },
  logsButton: {
    marginTop: 5,
    backgroundColor: '#0042be',
    paddingVertical: 2,  // Adjust vertical padding
    paddingHorizontal: 2,  // Adjust horizontal padding
    borderRadius: 6,  // Adjust button corner radius
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,  // Set a fixed width if desired
    height: 30,
  },
  logsButtonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logsContainer: {
    maxHeight: 300,
    width: '100%',
  },
  logEntry: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#0042be',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#1E88E5',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  navItem: {
    padding: 8,
  },
  navIcon: {
    width: 24,
    height: 24,
  },
});

export default StudentClearanceStatus;
