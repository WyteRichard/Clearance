import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Image, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        if (userId && token) {
          const response = await axios.get(`https://amused-gnu-legally.ngrok-free.app/user/get-login/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLoggedInUsername(response.data.username);
        } else {
          showCustomAlert("User ID or token not found in storage.");
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        showCustomAlert("Failed to load user details. Please try again.");
      }
    };
    fetchLoggedInUser();
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const handleUsernameCheck = async () => {
    if (username !== loggedInUsername) {
      showCustomAlert('You can only change the password for your own account.');
      return;
    }

    try {
      setStatusMessage("Submitting...");
      setIsButtonDisabled(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('https://amused-gnu-legally.ngrok-free.app/user/forgot-password', { username }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setStep(2);
      } else {
        showCustomAlert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      showCustomAlert(error.response?.data?.message || 'An error occurred while sending OTP.');
    } finally {
      setStatusMessage("");
      setIsButtonDisabled(false);
    }
  };

  const handleChangePassword = async () => {
    setErrors({});
    setIsButtonDisabled(true);
  
    let passwordErrors = {};
    if (!otp) {
      passwordErrors.otp = 'OTP is required.';
      showCustomAlert('Please enter the OTP sent to your email.');
    }
    if (!newPassword) {
      passwordErrors.newPassword = 'New Password is required.';
      showCustomAlert('Please enter your new password.');
    } else if (newPassword.length < 8) {
      passwordErrors.newPassword = 'Password must be at least 8 characters.';
    } else if (/^[a-z]+$/.test(newPassword) || !/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
      passwordErrors.newPassword = 'Your password is weak. Please include a mix of uppercase, lowercase, numbers, and special characters.';
    }
    if (newPassword !== confirmNewPassword) {
      passwordErrors.confirmNewPassword = 'Passwords do not match.';
      showCustomAlert('Passwords do not match.');
    }
  
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      setIsButtonDisabled(false);
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('https://amused-gnu-legally.ngrok-free.app/user/forgot-password', {
        username,
        otp,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        showCustomAlert('Password has been changed successfully.');
        setTimeout(() => navigation.navigate('StudentProfile'), 2000);
      } else {
        setErrors({ otp: 'Failed to change password. Please try again.' });
      }
    } catch (error) {
      setErrors({ otp: error.response?.data?.message || 'An error occurred.' });
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <LinearGradient style={styles.container} colors={["#266ca9", "#0042be"]}>
      <View style={styles.content}>
        <Text style={styles.headerText}>CHANGE PASSWORD</Text>

        {step === 1 ? (
          // Step 1: Username Check and OTP Send
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
              />
            </View>
            {statusMessage ? <Text style={styles.statusText}>{statusMessage}</Text> : null}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.changePasswordButton} onPress={handleUsernameCheck} disabled={isButtonDisabled}>
                <Text style={styles.changePasswordButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Step 2: Change Password
          <>
            <View style={[styles.inputContainer, errors.otp && styles.errorBorder]}>
              <TextInput
                style={styles.input}
                placeholder="OTP"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.passwordContainer, errors.newPassword && styles.errorBorder]}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry={!isPasswordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                <Image
                  source={isPasswordVisible ? require('../../assets/images/eye-on.png') : require('../../assets/images/eye-off.png')}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.passwordContainer, errors.confirmNewPassword && styles.errorBorder]}>
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry={!isPasswordVisible}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setStep(1)}>
                <Text style={styles.cancelButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword} disabled={isButtonDisabled}>
                <Text style={styles.changePasswordButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Modal visible={showAlertModal} transparent={true} animationType="fade" onRequestClose={() => setShowAlertModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.alertMessage}>{alertMessage}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowAlertModal(false)}>
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
    marginBottom: 15,
    width: '90%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 30,
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
  eyeIconContainer: {
    paddingHorizontal: 10,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  cancelButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  cancelButtonText: {
    color: '#0042be',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changePasswordButton: {
    backgroundColor: '#266ca9',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  changePasswordButtonText: {
    color: 'white',
    fontSize: 16,
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
  statusText: {
    color: 'lightgrey',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ChangePassword;
