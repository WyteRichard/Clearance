import React, { useState, useRef, useEffect } from "react";
import { Animated, Image, TextInput, TouchableOpacity, StyleSheet, Text, View, Keyboard, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const vectorPosition = useRef(new Animated.Value(hp('45%'))).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const keyboardDidShow = () => {
    Animated.timing(vectorPosition, {
      toValue: hp('10%'),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const keyboardDidHide = () => {
    Animated.timing(vectorPosition, {
      toValue: hp('45%'),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <LinearGradient
      style={styles.studentLoginView}
      locations={[0, 1]}
      colors={["#266ca9", "#0042be"]}
    >
      <Animated.Image
        style={[styles.vectorIcon, { top: vectorPosition }]}
        source={require("../../assets/images/loginvector.png")}
        resizeMode="cover"
      />

      <Image
        style={styles.rcLogo1Icon}
        source={require("../../assets/images/rc-logo-1.png")}
        resizeMode="contain"
      />

      <Text style={styles.rccs}>ROGATIONIST COLLEGE{"\n"}CLEARANCE SYSTEM</Text>
      <Text style={styles.signIn}>SIGN IN</Text>

      <View style={styles.fields}>
        <View style={[styles.fieldContainer, styles.fieldShadow]}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={[styles.fieldContainer, styles.fieldShadow]}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
        <Text style={styles.forgotPassword}>Forgot Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => navigation.navigate('Main', {
          screen: 'Student',
          params: { screen: 'StudentDashboard' },
        })}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.dontHaveAn}>
        Don’t have an Account?{" "}
        <Text style={styles.clickHere} onPress={() => navigation.navigate('RegisterStudent')}>
          Click here.
        </Text>
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  studentLoginView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "transparent",
  },
  vectorIcon: {
    position: 'absolute',
    left: 0,
    width: wp('100%'),
    height: hp('100%'),
  },
  rcLogo1Icon: {
    position: 'absolute',
    top: hp('10%'),
    width: wp('45%'),
    height: wp('45%'),
    resizeMode: 'contain',
  },
  rccs: {
    fontSize: wp('6%'),
    color: "#e7e7e7",
    textAlign: 'center',
    lineHeight: wp('7%'),
    marginTop: hp('22%'),
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  signIn: {
    fontSize: wp('9%'),
    color: "#000",
    textAlign: "center",
    marginTop: hp('8%'),
    fontWeight: '600',
  },
  fields: {
    width: wp('80%'),
    marginTop: hp('3%'),
  },
  fieldContainer: {
    marginBottom: hp('2%'),
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: wp('3%'),
    fontSize: wp('4.5%'),
    color: "#000",
  },
  fieldShadow: {
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  signInButton: {
    marginTop: hp('3%'),
    backgroundColor: "#266ca9",
    paddingVertical: hp('2%'),
    borderRadius: 10,
    width: wp('50%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: wp('5%'),
  },
  forgotPassword: {
    color: "#0174be",
    fontSize: wp('4%'),
    marginTop: hp('-1%'),
    marginLeft: hp('24%'),
  },
  dontHaveAn: {
    color: "#0174be",
    fontSize: wp('4.3%'),
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  clickHere: {
  }
});

export default Login;
