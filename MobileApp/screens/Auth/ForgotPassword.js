import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, TextInput, Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleVariable, FontFamily, FontSize, Color } from "../../components/GlobalStyles";
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {

    const [username, setUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();   
    
  return (
    <LinearGradient
      style={styles.forgotPass2}
      locations={[0, 1]}
      colors={["#266ca9", "#0042be"]}
    >
      <Image
        style={styles.vectorIcon}
        contentFit="cover"
        source={require("../../assets/images/loginvector.png")}
      />
      <Text style={styles.createAnAccount}>{`FORGOT\nPASSWORD`}</Text>
      
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
            placeholder="OTP"
            placeholderTextColor="#888"
            value={otp}
            onChangeText={setOtp}
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
      </View>

    
    <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Forgot')}
            style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Forgot')}
            style={styles.button2}>
            <Text style={styles.buttonText2}>Change Password</Text>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
    fields: {
        width: wp('80%'),
        marginTop: hp('3%'),
    },
    fieldContainer: {
        marginBottom: hp('1%'),
        width: '100%',
      },
        firstShadowBox: {
        gap: StyleVariable.space200,
        height: hp('6%'),
        width: wp('80%'),
        shadowOpacity: 1,
        elevation: 5,
        shadowRadius: 5,
        shadowOffset: {
        width: 0,
        height: 5,
    },
        shadowColor: "rgba(0, 0, 0, 0.25)",
        alignSelf: "center",
        marginVertical: hp('2%'),
    },
        valueTypo: {
        lineHeight: 16,
        textAlign: "left",
        fontFamily: FontFamily.bodyBase,
        fontSize: FontSize.bodyBase_size,
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
        marginTop: hp('23%'),
        },
        value: {
        color: '#000',
        fontSize: wp('4%'),
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('3%'),
        width: wp('90%'),
        alignSelf: 'center',
      },
      button: {
        width: wp('30%'),
        marginLeft: hp('2.5%'),
        backgroundColor: '#fff',
        paddingVertical: hp('2%'),
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#266ca9',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
      button2: {
        width: wp('45%'),
        marginRight: hp('2.5%'),
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
        color: '#266ca9',
        fontSize: wp('4%'),
      },
      buttonText2: {
        color: '#fff',
        fontSize: wp('4%'),
      },
    forgotPass2: {
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        overflow: "hidden",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
  },
});

export default ForgotPassword;
