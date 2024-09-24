import React, { useState } from "react";
import { TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, View, StyleSheet, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const RegisterStudent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        style={styles.studentCreateAccountView}
        locations={[0, 1]}
        colors={["#266ca9", "#0042be"]}
      >
        <Image
          style={styles.vectorIcon}
          source={require("../../assets/images/loginvector.png")}
        />
        <Text style={styles.createAnAccount}>REGISTER</Text>

      <View style={styles.fields}>
        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            placeholder="Student Number"
            placeholderTextColor="#888"
            value={studentNumber}
            onChangeText={setStudentNumber}
          />
        </View>

        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#888"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />
        </View>
      </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.alreadyHaveAn}>
            Already have an account?{' '}
            <Text style={styles.clickHere} onPress={() => navigation.navigate('Login')}>
              Click here.
            </Text>
          </Text>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fields: {
    width: wp('80%'),
    marginTop: hp('3%'),
  },
  studentCreateAccountView: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    overflow: "hidden",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContainer: {
    marginBottom: hp('1%'),
    width: '100%',
  },
  vectorIcon: {
    top: hp('35%'),
    width: wp('100%'),
    height: hp('70%'),
    position: "absolute",
  },
  createAnAccount: {
    fontSize: wp('9%'),
    lineHeight: hp('5%'),
    fontWeight: "600",
    color: "#000",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    textAlign: "center",
    marginTop: hp('35%'),
  },
  inputContainer: {
    marginVertical: hp('1%'),
    width: wp('80%'),
  },
  input: {
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.5%'),
    fontSize: wp('4%'),
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  dropdownContainer: {
    width: wp('80%'),
    marginVertical: hp('1%'),
  },
  dropdownIcon: {
    width: wp('4%'),
    height: hp('2%'),
  },
  value: {
    color: '#000',
    fontSize: wp('4%'),
  },
  button: {
    marginTop: hp('5%'),
    width: wp('60%'),
    backgroundColor: '#266ca9',
    paddingVertical: hp('1.5%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('5%'),
  },
  alreadyHaveAn: {
    marginTop: hp('2%'),
    fontSize: wp('4.3%'),
    color: "#0174be",
    textAlign: 'center',
  },
  clickHere: {
    color: '#0174be',
  },
});

export default RegisterStudent;
