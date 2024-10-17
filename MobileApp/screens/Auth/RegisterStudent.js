import React, { useState } from "react";
import { TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, View, StyleSheet, Text, Image, Alert, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RegisterStudent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setErrorMessage('');

    if (!username || !/^[a-zA-Z0-9]+$/.test(username)) {
      setErrorMessage('Please enter a valid username (alphanumeric characters only).');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }
    if (!studentNumber) {
      setErrorMessage('Please enter your Student Number.');
      return;
    }
    if (!validateEmail(emailAddress)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      username,
      password,
      student: {
        studentNumber,
        email: emailAddress,
      },
    };

    try {
      const response = await axios.post('http://192.168.1.6:8080/user/register', payload);
      if (response.status === 200) {
        navigation.navigate('VerifyOtp', { username });
      } else {
        Alert.alert('Error', 'Unexpected response received.');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An unexpected error occurred.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <LinearGradient style={styles.gradientBackground} locations={[0, 1]} colors={["#266ca9", "#0042be"]}>
        <Text style={styles.registerHeaderText}>REGISTER</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.eyeIconContainer} onPress={togglePasswordVisibility}>
                <Image
                  style={styles.eyeIcon}
                  source={isPasswordVisible ? require("../../assets/images/eye-on.png") : require("../../assets/images/eye-off.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Student Number"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={studentNumber}
              onChangeText={setStudentNumber}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={emailAddress}
              onChangeText={setEmailAddress}
              keyboardType="email-address"
            />
          </View>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isSubmitting}>
          <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <View style={styles.registerLinkContainer}>
          <Text style={styles.registerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.clickHereText}>Click here.</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerHeaderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eyeIconContainer: {
    padding: 10,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  registerButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  buttonText: {
    color: '#0042be',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLinkContainer: {
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

export default RegisterStudent;
