import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const StudentAccount = () => {

    const navigation = useNavigation();

  return (
    <LinearGradient
      style={styles.accountView}
      locations={[0, 1]}
      colors={["#266ca9", "#0042be"]}
    >
      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.navigate('StudentDashboard')}
            
            style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <Image
          style={styles.avatarIcon1}
          source={require("../../assets/images/avatar.png")}
        />
      </View>

      <View style={styles.accountDetails}>
        <View style={styles.myInformationEdit}>
          <Text style={styles.myInfo}>My Information</Text>
        </View>

<View style={styles.infoTable}>
  <View style={styles.row}>
    <Image source={require("../../assets/images/user1.png")} style={styles.icon} />
    <Text style={styles.value}>Aiah Nadine Quñones Delos Reyes</Text>
  </View>
  <View style={styles.row}>
    <Image source={require("../../assets/images/phone.png")} style={styles.icon} />
    <Text style={styles.value}>09923692695</Text>
  </View>
  <View style={styles.row}>
    <Image source={require("../../assets/images/mail.png")} style={styles.icon} />
    <Text style={styles.value}>aiahnadinedelosreyes@gmail.com</Text>
  </View>
  <View style={styles.row}>
    <Image source={require("../../assets/images/idnum.png")} style={styles.icon} />
    <Text style={styles.value}>CT21-0099</Text>
  </View>
  <View style={styles.row}>
    <Image source={require("../../assets/images/course.png")} style={styles.icon} />
    <Text style={styles.value}>BS in Information Technology</Text>
  </View>
  <View style={styles.row}>
    <Image source={require("../../assets/images/year.png")} style={styles.icon} />
    <Text style={styles.value}>Fourth Year</Text>
  </View>
</View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const ProfileRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  accountView: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp('2%'),
  },
  backButton: {
    marginRight: wp('3%'),
    marginTop: hp('5%'),
  },
  title: {
    color: '#fff',
    marginTop: hp('5%'),
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: hp('0%'),
  },
  avatarIcon1: {
    width: wp('40%'),
    height: wp('40%'),
    borderRadius: wp('22%'),
    marginBottom: hp('1%'),
    overflow: 'hidden',
},
  infoTable: {
    marginTop: hp('2%'),
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  icon: {
    width: wp('6%'),
    height: hp('3%'),
    marginRight: wp('5%'),
  },
  accountDetails: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: wp('5%'),
    margin: wp('5%'),
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  myInformationEdit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp('2%'),
  },
  myInfo: {
    fontWeight: "900",
    color: "#266ca9",
    fontSize: wp('5%'),
  },
  editIcon: {
    width: wp('5%'),
    height: hp('3%'),
  },
  infoTable: {
    marginTop: hp('2%'),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: wp('4.5%'),
    color: "#000",
    fontWeight: "600",
  },
  value: {
    fontSize: wp('4.5%'),
    color: "#666",
    textAlign: 'left',
  },
  editButton: {
    backgroundColor: '#266ca9',
    padding: hp('2%'),
    marginTop: hp('2%'),
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
});

export default StudentAccount;
