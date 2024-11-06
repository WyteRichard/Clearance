import React, { useState } from "react";
import { TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, View, StyleSheet, Text, Image, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RegisterStudent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const handleRegister = async () => {
    setErrors({});
    let newErrors = {};
  
    if (!username || !/^[a-zA-Z0-9]+$/.test(username)) {
      newErrors.username = 'Please enter a valid username.';
    }

    if (!password) {
      newErrors.password = 'Please enter a password.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      newErrors.password = 'Your password is weak. Please include a mix of uppercase, lowercase, numbers, and special characters.';
    }
  
    if (!studentNumber) {
      newErrors.studentNumber = 'Please enter your Student Number.';
    }
  
    if (!validateEmail(emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showCustomAlert(Object.values(newErrors)[0]);
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
      const response = await axios.post('https://amused-gnu-legally.ngrok-free.app/user/register', payload);

      if (response.status === 200) {
        const { userId } = response.data;
        await AsyncStorage.setItem('userId', userId);
        navigation.navigate('VerifyOtp', { username });
      } else {
        showCustomAlert('Unexpected response received.');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An unexpected error occurred.';
      showCustomAlert(message);
    } finally {
      setIsSubmitting(false);
    }
};


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <LinearGradient style={styles.gradientBackground} locations={[0, 1]} colors={["#266ca9", "#0042be"]}>
        <Text style={styles.registerHeaderText}>REGISTER</Text>

        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, errors.username && styles.errorBorder]}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrors((prevErrors) => ({ ...prevErrors, username: null }));
              }}
            />
          </View>

          <View style={[styles.inputWrapper, errors.password && styles.errorBorder]}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prevErrors) => ({ ...prevErrors, password: null }));
                }}
              />
              <TouchableOpacity style={styles.eyeIconContainer} onPress={togglePasswordVisibility}>
                <Image
                  style={styles.eyeIcon}
                  source={isPasswordVisible ? require("../../assets/images/eye-on.png") : require("../../assets/images/eye-off.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.inputWrapper, errors.studentNumber && styles.errorBorder]}>
            <TextInput
              style={styles.input}
              placeholder="Student Number"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={studentNumber}
              onChangeText={(text) => {
                setStudentNumber(text);
                setErrors((prevErrors) => ({ ...prevErrors, studentNumber: null }));
              }}
            />
          </View>

          <View style={[styles.inputWrapper, errors.emailAddress && styles.errorBorder]}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={emailAddress}
              onChangeText={(text) => {
                setEmailAddress(text);
                setErrors((prevErrors) => ({ ...prevErrors, emailAddress: null }));
              }}
              keyboardType="email-address"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isSubmitting}>
          <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <View style={styles.registerLinkContainer}>
          <Text style={styles.registerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.clickHereText}>Click here.</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showAlertModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAlertModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.alertMessage}>{alertMessage}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAlertModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 15,
  },
  errorBorder: {
    borderColor: 'red',
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
  alertMessage: {
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

export default RegisterStudent;
