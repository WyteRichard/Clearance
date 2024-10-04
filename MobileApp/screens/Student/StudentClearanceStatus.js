import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const clearanceData = [
  { department: 'Supreme Student Council', status: 'Cleared', remarks: 'None' },
  { department: 'Student Affairs', status: 'Cleared', remarks: 'None' },
  { department: 'Spiritual Affairs', status: 'Cleared', remarks: 'None' },
  { department: 'Student Discipline', status: 'Pending', remarks: 'None' },
  { department: 'Guidance', status: 'Pending', remarks: 'None' },
  { department: 'Library', status: 'Cleared', remarks: 'None' },
  { department: 'Laboratory', status: 'Cleared', remarks: 'None' },
];

const ClearanceStatus = () => {

  const [selectedStatus, setSelectedStatus] = React.useState('Cleared');
  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.navigate('StudentDashboard');
  };

  const handleRequestPress = () => {
    navigation.navigate('StudentClearanceRequest');
  };

  const handleStatusPress = () => {
    navigation.navigate('StudentClearanceStatus');
  };

  const handleAccountPress = () => {
    navigation.navigate('StudentProfile');
  };

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
            <Text style={styles.name}>Aiah Nadine</Text>
          </View>
          <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
        </View>

        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>Clearance Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Cleared" value="cleared" />
              <Picker.Item label="Pending" value="pending" />
            </Picker>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.departmentCell]}>Department</Text>
            <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
            <Text style={[styles.headerCell, styles.remarksCell]}>Remarks</Text>
          </View>
          <ScrollView style={styles.tableContent}>
            {clearanceData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cell, styles.departmentCell]}>{item.department}</Text>
                <Text
                  style={[
                    styles.cell,
                    styles.statusCell,
                    item.status === 'Cleared' ? styles.cleared : styles.pending,
                  ]}
                >
                  {item.status}
                </Text>
                <Text style={[styles.cell, styles.remarksCell]}>{item.remarks}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Navbar fixed at the bottom with navigation */}
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
      </SafeAreaView>
    </LinearGradient>
  );
}

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
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 50,
  },
  statusLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    width: 150,
  },
  picker: {
    height: 40,
    width: 150,
  },
  pickerItem: {
    fontSize: 16,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 100,
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
    textAlign: 'left',
    paddingHorizontal: 8,
  },
  tableContent: {
    flexGrow: 1,
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
    paddingHorizontal: 8,
  },
  cleared: {
    color: 'green',
  },
  pending: {
    color: 'red',
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
    resizeMode: 'contain',
  },
});

export default ClearanceStatus;
