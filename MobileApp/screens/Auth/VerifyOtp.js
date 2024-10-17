import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const VerifyOtp = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const payload = {
        username,
        otp,
      };

      const response = await axios.post('http://192.168.1.6:8080/user/verify-otp', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        setMessage('OTP Verified Successfully!');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        setMessage('Failed to verify OTP. Please try again.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred while verifying OTP.';
      setMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient style={styles.container} colors={["#266ca9", "#0042be"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.content}>
        <Text style={styles.headerText}>VERIFY OTP</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={username}
            onChangeText={setUsername}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={otp}
            onChangeText={setOtp}
            editable={!isSubmitting}
            keyboardType="numeric"
          />
        </View>

        {message ? <Text style={styles.messageText}>{message}</Text> : null}

        <TouchableOpacity
          onPress={handleVerifyOtp}
          style={styles.submitButton}
          disabled={isSubmitting || !username || !otp}
        >
          <Text style={styles.submitButtonText}>{isSubmitting ? 'Verifying...' : 'Verify'}</Text>
        </TouchableOpacity>
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
});

export default VerifyOtp;
