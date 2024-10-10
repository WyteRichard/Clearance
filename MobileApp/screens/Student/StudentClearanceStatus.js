import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { Asset } from 'expo-asset';

const ClearanceStatus = () => {
  const [clearanceStatuses, setClearanceStatuses] = useState([]);
  const [filteredStatuses, setFilteredStatuses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentSemester, setCurrentSemester] = useState('Loading...');
  const [currentAcademicYear, setCurrentAcademicYear] = useState('Loading...');
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentMiddleName, setStudentMiddleName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const studentId = 1; // Replace with the actual student ID

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [semesterResponse, statusResponse, studentResponse] = await Promise.all([
          fetch('http://192.168.1.6:8080/Admin/semester/current'),
          fetch(`http://192.168.1.6:8080/Status/student/${studentId}`),
          fetch(`http://192.168.1.6:8080/Student/students/${studentId}`)
        ]);

        if (!semesterResponse.ok) throw new Error('Failed to fetch semester data');
        if (!statusResponse.ok) throw new Error('Failed to fetch status data');
        if (!studentResponse.ok) throw new Error('Failed to fetch student data');

        const semesterData = await semesterResponse.json();
        const statusData = await statusResponse.json();
        const studentData = await studentResponse.json();

        setCurrentSemester(semesterData.currentSemester);
        setCurrentAcademicYear(semesterData.academicYear);
        setClearanceStatuses(Array.isArray(statusData) ? statusData : Object.values(statusData));
        setStudentFirstName(studentData.firstName);
        setStudentMiddleName(studentData.middleName);
        setStudentLastName(studentData.lastName);
        setStudentNumber(studentData.studentNumber);
        setSectionName(studentData.section.sectionName);
      } catch (error) {
        setError('Failed to fetch data. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  useEffect(() => {
    const filtered = statusFilter
      ? clearanceStatuses.filter((status) => status.status.toLowerCase() === statusFilter)
      : clearanceStatuses;
    setFilteredStatuses(filtered);
  }, [statusFilter, clearanceStatuses]);

  const handleStatusFilterChange = (selectedFilter) => {
    setStatusFilter(selectedFilter);
  };

  const handlePrint = async () => {
    const logoAsset = Asset.fromModule(require('../../assets/images/logo.png'));
    await logoAsset.downloadAsync();
    const logoUri = logoAsset.localUri || logoAsset.uri;
    const logoBase64 = await FileSystem.readAsStringAsync(logoUri, { encoding: FileSystem.EncodingType.Base64 });

    const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .logo { width: 250px; margin-bottom: 10px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <img src="data:image/png;base64,${logoBase64}" class="logo" alt="Logo" />
        <h1>Student Clearance</h1>
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
                <td>${status.department}</td>
                <td>${status.status}</td>
                <td>${status.remarks}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    try {
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      Alert.alert('Error', 'Could not print the document');
    }
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
            <Text style={styles.name}>{studentFirstName}</Text>
          </View>
          <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
        </View>

        <View style={[styles.infoContainer, styles.invisible]}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.infoText}>A.Y. {currentAcademicYear}</Text>
          <Text style={styles.infoText}>Semester: {currentSemester.replace('_', ' ')}</Text>
          <Text style={styles.infoText}>Name: {`${studentFirstName} ${studentMiddleName} ${studentLastName}`}</Text>
          <Text style={styles.infoText}>Student No.: {studentNumber}</Text>
          <Text style={styles.infoText}>Section: {sectionName}</Text>
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

        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.departmentCell]}>Department</Text>
              <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
              <Text style={[styles.headerCell, styles.remarksCell]}>Remarks</Text>
            </View>
            
            <ScrollView style={styles.tableContent} nestedScrollEnabled={true}>
              {filteredStatuses.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.cell, styles.departmentCell]}>{item.department}</Text>
                  <Text style={[styles.cell, styles.statusCell, item.status === 'Cleared' ? styles.cleared : styles.pending]}>{item.status}</Text>
                  <Text style={[styles.cell, styles.remarksCell]}>{item.remarks}</Text>
                </View>
              ))}
            </ScrollView>
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
    display: 'none', // Hides the component completely
  },
  logo: {
    width: 100,  // Adjust as needed
    height: 100, // Adjust as needed
    marginBottom: 10, // Add spacing between the logo and the text below
  },
  header: {
    marginTop: 20,
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
  },
  tableContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
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
  tableContent: {
    flexGrow: 1,
    maxHeight: 500,
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

export default ClearanceStatus;
