import * as React from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, FontFamily, FontSize, StyleVariable, Border } from "../../components/GlobalStyles";
import { useNavigation } from '@react-navigation/native';

const StudentDashboard = () => {

  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.navigate('StudentDashboard');
  };

  const handleRequestPress = () => {
    navigation.navigate('StudentClearanceRequest');
  };

  const handleStatusPress = () => {
    navigation.navigate('StudentClearanceStatus');
  };

  const handleAccountPress = () => {
    navigation.navigate('StudentProfile');
  };

  return (
    <LinearGradient
      style={styles.studentDashboardView}
      locations={[0, 1]}
      colors={["#266ca9", "#0042be"]}
    >

    <Image
      style={styles.avatarIcon}
      contentFit="cover"
      source={require("../../assets/images/avatar.png")}
    />

      <View style={styles.curvedHeader}></View>

        <Text style={styles.hello}>Hello</Text>
        <Text style={styles.username}>Aiah Nadine</Text>

      <View style={styles.date}>
        <View style={styles.dateBackground} />
        <Image
          style={styles.calendarIcon}
          source={require("../../assets/images/calendar.png")}
        />
        <Text style={styles.academicYear}>A.Y. 2024 - 2025 - First Semester</Text>
        <Text style={styles.currentDate}>Saturday, July 13, 2024 17:40:44</Text>
      </View>

      <Text style={styles.clearanceStatusLabel}>Clearance Status</Text>

      <View style={styles.clearanceStatus}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBox, styles.clearedBackground]}>
            <Text style={styles.statusLabel}>Cleared</Text>
            <Text style={styles.statusCount}>0</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBox, styles.pendingBackground]}>
            <Text style={styles.statusLabel}>Pending</Text>
            <Text style={styles.statusCount}>0</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBox, styles.remarksBackground]}>
            <Text style={styles.statusLabel}>Remarks</Text>
            <Text style={styles.statusCount}>0</Text>
          </View>
        </View>
      </View>


      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleMenuPress}>
          <Image
            style={styles.menuIcon}
            source={require("../../assets/images/home.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRequestPress}>
          <Image
            style={styles.request}
            source={require("../../assets/images/request.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleStatusPress}>
          <Image
            style={styles.status}
            source={require("../../assets/images/status.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAccountPress}>
          <Image
            style={styles.account}
            source={require("../../assets/images/user.png")}
          />
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  studentDashboardView: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  hello: {
    marginLeft: wp('12%'),
    marginTop: hp('7%'),
    fontSize: wp('5%'),
    color: '#fff',
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOpacity: 3,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  username: {
    marginLeft: wp('12%'),
    marginTop: hp('0%'),
    fontSize: wp('7%'),
    fontWeight: "900",
    color: '#fff',
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOpacity: 5,
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 3,
  },
  avatarIcon: {
    width: wp('13%'),
    height: hp('6%'),
    borderRadius: 50,
    position: 'absolute',
    marginLeft: wp('80%'),
    marginTop: hp('7%'),
  },
  dateBackground: {
    marginTop: hp('0%'),
    width: wp('85%'),
    height: hp('10%'),
    backgroundColor: '#fff',
    borderRadius: 1,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 3,
    shadowRadius: 4,
    elevation: 4,
    position: "absolute",
  },
  academicYear: {
    fontFamily: 'SF-Pro-Display-Medium',
    fontWeight: "600",
    fontStyle: "italic",
    color: '#000',
    fontSize: wp('5.5%'),
    textAlign: "center",
    marginTop: hp('1%'),
    marginLeft: wp('1%'),
    position: 'absolute',
  },
  currentDate: {
    fontFamily: 'SF-Pro-Display-Regular',
    fontWeight: "300",
    color: Color.colorGray_200,
    fontSize: wp('4.5%'),
    textAlign: "center",
    marginTop: hp('5%'), 
    marginLeft: wp('20%'),
    position: 'absolute',
  },
  date: {
    marginTop: hp('7%'),
    alignItems: "center",
  },
  calendarIcon: {
    width: wp('6%'),
    height: wp('6%'),
    marginTop: hp('5%'),
    marginRight: wp('65%'),
    position: 'relative',
  },
  clearanceStatusLabel: {
    marginTop: hp('5%'),
    marginRight: wp('40%'),
    fontSize: wp('6%'),
    color: '#fff',
    fontFamily: 'SF-Pro-Display-Bold',
    textAlign: "center",
  },
  clearanceStatus: {
    marginTop: hp('2%'),
    alignItems: 'center',
    width: wp('100%'),
    flexDirection: 'column',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: wp('100%'),
    marginBottom: hp('2%'),
  },
  statusContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp('1%'),
  },
  statusBox: {
    width: wp('40%'),
    height: hp('12%'),
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  clearedBackground: {
    marginRight: wp('45%'),
    marginTop: hp('15%'),
    backgroundColor: '#fff',
  },
  pendingBackground: {
    marginLeft: wp('45%'),
    marginTop: hp('15%'),
    backgroundColor: '#fff',
  },
  remarksBackground: {
    marginRight: wp('45%'),
    marginTop: hp('45%'),
    backgroundColor: '#fff',
  },
  statusLabel: {
    marginTop: hp('0%'),
    marginRight: wp('12%'),
    fontSize: wp('6%'),
    color: Color.colorGray_200,
    fontWeight: "900",
    textAlign: "center",
  },
  statusCount: {
    marginTop: hp('0.5%'),
    marginBottom: hp('1%'),
    marginRight: wp('25%'),
    fontSize: wp('10%'),
    color: '#757575',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('100%'),
    paddingHorizontal: wp('9%'),
    paddingVertical: hp('1%'),
    position: 'absolute',
    bottom: hp('1%'),
    zIndex: 3,
  },
  menuIcon: {
    marginTop: hp('1%'),
    width: wp('9%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  request: {
    marginTop: hp('1%'),
    width: wp('9%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  status: {
    marginTop: hp('1%'),
    width: wp('9%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  account: {
    marginTop: hp('1%'),
    width: wp('8%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  curvedHeader: {
    position: "absolute",
    bottom: hp('-2%'),
    marginLeft: 0,
    width: wp('100%'),
    height: hp('10%'),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
});

export default StudentDashboard;
