import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Image } from "react-native";
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleUsernameSubmit = async () => {
    setErrors({});
    setIsButtonDisabled(true);

    if (!username || /[^a-zA-Z0-9]/.test(username)) {
      setErrors({ username: 'Please enter a valid alphanumeric username.' });
      setIsButtonDisabled(false);
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.19:8080/user/forgot-password', { username });
      if (response.status === 200) {
        setShowSecondScreen(true);
      } else {
        setErrors({ username: 'Failed to send OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({ username: error.response?.data?.message || 'An error occurred.' });
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleChangePassword = async () => {
    setErrors({});
    setIsButtonDisabled(true);

    if (!otp || !password) {
      setErrors({
        otp: !otp ? 'OTP is required.' : '',
        password: !password ? 'Password is required.' : '',
      });
      setIsButtonDisabled(false);
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.6:8080/user/verify-forgot-password', {
        username,
        otp,
        password,
      });
      if (response.status === 200) {
        navigation.navigate('Login');
      } else {
        setErrors({ otp: 'Failed to reset password. Please try again.' });
      }
    } catch (error) {
      setErrors({ otp: error.response?.data?.message || 'An error occurred.' });
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <LinearGradient style={styles.container} colors={["#266ca9", "#0042be"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      {!showSecondScreen ? (
        <View style={styles.content}>
          <Text style={styles.headerText}>{`FORGOT\nPASSWORD`}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

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

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="OTP"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={otp}
              onChangeText={setOtp}
            />
          </View>
          {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
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
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

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
});

export default ForgotPassword;
