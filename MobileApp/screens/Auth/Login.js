import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
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
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setErrorMessage('');
    const payload = { username, password };
  
    try {
      const response = await axios.post('http://192.168.1.19:8080/user/login', payload, {
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
        } else if (authorities.includes("ROLE_ROLE_ADVISER")) {
          await AsyncStorage.setItem('role', "ROLE_ROLE_ADVISER");
          navigation.replace('Main', { screen: 'AdviserDashboard' });
        } 
        else {
          setErrorMessage("Unauthorized role");
          Alert.alert('Error', 'Unauthorized role. Please try again.');
        }
      } else {
        setErrorMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || 'An error occurred during login.';
        setErrorMessage(message);
      } else if (error.request) {
        setErrorMessage('No response from server. Check your network connection.');
      } else {
        setErrorMessage('An error occurred while sending the request.');
      }
    }
  };

  return (
    <LinearGradient
      colors={['#266ca9', '#0042be']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
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

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterStudent')}>
            <Text style={styles.clickHereText}>Click here.</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default Login;
