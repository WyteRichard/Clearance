import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const StudentAccount = () => {

  const navigation = useNavigation();  // Initialize navigation

  // Handle logout functionality
  const handleLogout = () => {
    // Add your logout logic here
    // For example, clear any stored tokens or user data, then navigate to the login screen
    navigation.navigate('Login');  // Assuming there's a 'Login' screen to navigate to
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
          {/* Go back when the button is pressed */}
          <Image source={require('../../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Information</Text>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/buser.png')} style={styles.icon} />
            <Text style={styles.infoText}>Aiah Nadine Quñones Delos Reyes</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bphone.png')} style={styles.icon} />
            <Text style={styles.infoText}>09923692695</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bmail.png')} style={styles.icon} />
            <Text style={styles.infoText}>aiahnadinedelosreyes@gmail.com</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bsid.png')} style={styles.icon} />
            <Text style={styles.infoText}>CT21-0099</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bcourse.png')} style={styles.icon} />
            <Text style={styles.infoText}>BS in Information Technology</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../assets/images/bghat.png')} style={styles.icon} />
            <Text style={styles.infoText}>Fourth Year</Text>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
  },
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
  editButton: {
    backgroundColor: '#266ca9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Logout Button Styles
  logoutButton: {
    backgroundColor: '#D4D4D4',  // You can adjust the color
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
