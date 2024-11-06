import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Modal, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Username is required.');
      setShowErrorModal(true);
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Password is required.');
      setShowErrorModal(true);
      return;
    }

    const payload = { username, password };

    try {
      const response = await axios.post('https://amused-gnu-legally.ngrok-free.app/user/login', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        const token = response.headers['jwt-token'];
        if (!token) {
          setErrorMessage('Token not received from server.');
          return;
        }

        const decodedToken = jwtDecode(token);
        const authorities = decodedToken.authorities || [];

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('exp', decodedToken.exp.toString());
        await AsyncStorage.setItem('userId', response.data.userId.toString());

        if (authorities.includes("ROLE_ROLE_STUDENT")) {
          await AsyncStorage.setItem('role', "ROLE_ROLE_STUDENT");
          navigation.replace('Main', { screen: 'StudentDashboard' });
        } else {
          setErrorMessage("Unauthorized role");
          setShowErrorModal(true);
        }
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 404) {
          setErrorMessage('The username is not existing.');
        } else if (status === 401) {
          setErrorMessage('Your account has been locked, contact the administrator.');
        } else {
          setErrorMessage('The username / password is incorrect.');
        }
        setShowErrorModal(true);
      } else if (error.request) {
        setErrorMessage('No response from server. Check your network connection.');
        setShowErrorModal(true);
      } else {
        setErrorMessage('An error occurred while sending the request.');
        setShowErrorModal(true);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setUsername('');
    setPassword('');
    setErrorMessage('');
    setShowErrorModal(false);
    setRefreshing(false);
  };

  return (
    <LinearGradient
      colors={['#266ca9', '#0042be']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/images/rc-logo-1.png')} style={styles.logoImage} />
            <Text style={styles.logoText}>ROGATIONIST COLLEGE{"\n"}CLEARANCE SYSTEM</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Image source={require('../../assets/images/email.png')} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Image source={require('../../assets/images/lock.png')} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Image
                  source={showPassword ? require('../../assets/images/eye-on.png') : require('../../assets/images/eye-off.png')}
                  style={styles.eyeIconImage}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterStudent')}>
              <Text style={styles.clickHereText}>Click here.</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={showErrorModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowErrorModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.errorTitle}>Login Error</Text>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowErrorModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginBottom: 15,
  },
  inputIcon: {
    width: 24,
    height: 24,
    margin: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  eyeIconImage: {
    width: 24,
    height: 24,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPassword: {
    color: 'white',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#0042be',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: 'white',
    fontSize: 16,
  },
  clickHereText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d32f2f',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#0042be',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
