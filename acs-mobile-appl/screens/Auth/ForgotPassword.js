import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Image, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const handleUsernameSubmit = async () => {
    setErrors({});
    setIsButtonDisabled(true);
    setStatusMessage("Checking username...");

    if (!username.trim()) {
      setErrors({ username: 'Username is required.' });
      showCustomAlert('Please enter your username.');
      setIsButtonDisabled(false);
      setStatusMessage("");
      return;
    }

    try {
      const response = await axios.post('https://amused-gnu-legally.ngrok-free.app/user/forgot-password', { username });
      if (response.status === 200) {
        setShowSecondScreen(true);
        setStatusMessage("");
      } else {
        setErrors({ username: 'Failed to send OTP. Please try again.' });
        setStatusMessage("");
      }
    } catch (error) {
      setErrors({ username: error.response?.data?.message || 'An error occurred.' });
      setStatusMessage("");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleChangePassword = async () => {
    setErrors({});
    setIsButtonDisabled(true);
    setStatusMessage("");

    let passwordErrors = {};

    if (!otp || !password) {
      passwordErrors.otp = !otp ? 'OTP is required.' : '';
      passwordErrors.password = !password ? 'Password is required.' : '';

      if (!otp) {
        showCustomAlert('Please enter the OTP sent to your email.');
      } else if (!password) {
        showCustomAlert('Please enter your new password.');
      }

      setErrors(passwordErrors);
      setIsButtonDisabled(false);
      return;
    }

    if (password.length < 8) {
      passwordErrors.password = 'Password must be at least 8 characters.';
    }

    if (/^[a-z]+$/.test(password) || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
      passwordErrors.password = 'Your password is weak. Please include a mix of uppercase, lowercase, numbers, and special characters.';
    }

    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      showCustomAlert(Object.values(passwordErrors)[0]);
      setIsButtonDisabled(false);
      return;
    }

    try {
      const response = await axios.post('https://amused-gnu-legally.ngrok-free.app/user/verify-forgot-password', {
        username,
        otp,
        password,
      });

      if (response.status === 200) {
        setStatusMessage("Password has been changed successfully.");
        showCustomAlert('Password has been changed successfully.');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        setErrors({ otp: 'Failed to reset password. Please try again.' });
        setStatusMessage("");
      }
    } catch (error) {
      setErrors({ otp: error.response?.data?.message || 'An error occurred.' });
      setStatusMessage("");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <LinearGradient style={styles.container} colors={["#266ca9", "#0042be"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      {!showSecondScreen ? (
        <View style={styles.content}>
          <Text style={styles.headerText}>{`FORGOT\nPASSWORD`}</Text>

          <View style={[styles.inputContainer, errors.username && styles.errorBorder]}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          {statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}

          <TouchableOpacity onPress={handleUsernameSubmit} style={styles.submitButton} disabled={isButtonDisabled}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.headerText}>FORGOT{"\n"}PASSWORD</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={username}
              editable={false}
            />
          </View>

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

          <View style={[styles.passwordContainer, errors.password && styles.errorBorder]}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
              <Image
                source={isPasswordVisible ? require('../../assets/images/eye-on.png') : require('../../assets/images/eye-off.png')}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          {statusMessage && <Text style={styles.statuspasswordText}>{statusMessage}</Text>}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowSecondScreen(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword} disabled={isButtonDisabled}>
              <Text style={styles.changePasswordButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
    borderWidth: 1,
    borderColor: 'transparent',
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
  },
  statusText: {
    color: 'yellow',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  statuspasswordText: {
    color: 'lightgreen',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  eyeIconContainer: {
    paddingHorizontal: 10,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  submitButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
  },
  submitButtonText: {
    color: '#0042be',
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default ForgotPassword;
