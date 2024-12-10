import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const VerifyOtp = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const handleVerifyOtp = async () => {
    setErrors({});
    let newErrors = {};

    if (!username) {
      newErrors.username = 'Please enter your username.';
    }
    if (!otp) {
      newErrors.otp = 'Please enter the OTP.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showCustomAlert(Object.values(newErrors)[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { username, otp };

      const response = await axios.post('https://amused-gnu-legally.ngrok-free.app/user/verify-otp', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        showCustomAlert('OTP Verified Successfully!');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        showCustomAlert('Failed to verify OTP. Please try again.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred while verifying OTP.';
      showCustomAlert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient style={styles.container} colors={["#266ca9", "#0042be"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.content}>
        <Text style={styles.headerText}>VERIFY OTP</Text>
        
        <View style={[styles.inputContainer, errors.username && styles.errorBorder]}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setErrors((prevErrors) => ({ ...prevErrors, username: null }));
            }}
            editable={!isSubmitting}
          />
        </View>

        <View style={[styles.inputContainer, errors.otp && styles.errorBorder]}>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              setErrors((prevErrors) => ({ ...prevErrors, otp: null }));
            }}
            editable={!isSubmitting}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          onPress={handleVerifyOtp}
          style={styles.submitButton}
          disabled={isSubmitting || !username || !otp}
        >
          <Text style={styles.submitButtonText}>{isSubmitting ? 'Verifying...' : 'Verify'}</Text>
        </TouchableOpacity>

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

      </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '90%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 15,
  },
  submitButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#0042be',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorBorder: {
    borderColor: 'red',
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

export default VerifyOtp;
