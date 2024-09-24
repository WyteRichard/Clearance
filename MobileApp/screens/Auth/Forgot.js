import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const Forgot = () => {

    const navigation = useNavigation();
    
  return (
    <LinearGradient
      style={styles.forgotPass1}
      locations={[0, 1]}
      colors={["#266ca9", "#0042be"]}
    >
      <Image
        style={styles.vectorIcon}
        source={require("../../assets/images/loginvector.png")}
      />
      <Text style={styles.createAnAccount}>{`FORGOT\nPASSWORD`}</Text>
      <View style={[styles.firstName, styles.buttonShadowBox]}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
        </View>
      </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  buttonShadowBox: {
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: hp('1%'),
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    elevation: 5,
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
    marginTop: hp('5%'),
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.5%'),
    width: wp('80%'),
    marginTop: hp('3%'),
  },
  inputLabel: {
    fontSize: wp('4%'),
    color: '#000',
  },
  button: {
    marginTop: hp('3%'),
    width: wp('60%'),
    backgroundColor: "#266ca9",
    paddingVertical: hp('1.8%'),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: wp('5%'),
  },
  forgotPass1: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    overflow: "hidden",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Forgot;
