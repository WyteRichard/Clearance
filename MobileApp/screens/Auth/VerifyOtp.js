import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';

const VerifyOtp = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      style={styles.container}
      colors={["#266ca9", "#0042be"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Text style={styles.headerText}>VERIFY OTP</Text>
        
        {/* Username Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        </View>

        {/* OTP Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            placeholderTextColor="rgba(255,255,255,0.7)"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('')} // Adjust the destination as needed
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>Verify</Text>
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
