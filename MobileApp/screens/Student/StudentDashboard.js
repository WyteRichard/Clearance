import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const StudentDashboard = () => {
  const navigation = useNavigation(); // Initialize navigation

  // Handlers for navigation
  const handleHomePress = () => {
    navigation.navigate('StudentDashboard'); // Replace with the actual route
  };

  const handleRequestPress = () => {
    navigation.navigate('StudentClearanceRequest'); // Replace with the actual route
  };

  const handleStatusPress = () => {
    navigation.navigate('StudentClearanceStatus'); // Replace with the actual route
  };

  const handleAccountPress = () => {
    navigation.navigate('StudentProfile'); // Replace with the actual route
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
          {/* Replace avatar with an image */}
          <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>A.Y. 2024 - 2025 - First Semester</Text>
          <Text style={styles.cardSubtitle}>Saturday, July 13, 2024 17:40:44</Text>
        </View>

        <Text style={styles.sectionTitle}>Clearance Status</Text>

        <View style={styles.statusContainer}>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Cleared</Text>
            <Text style={styles.statusValue}>0</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Pending</Text>
            <Text style={styles.statusValue}>0</Text>
          </View>
          <View style={[styles.statusCard, styles.fullWidth]}>
            <Text style={styles.statusLabel}>Remarks</Text>
            <Text style={styles.statusValue}>0</Text>
          </View>
        </View>

        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
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
