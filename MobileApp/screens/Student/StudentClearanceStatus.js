import * as React from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontFamily, Color } from "../../components/GlobalStyles";
import { useNavigation } from '@react-navigation/native';

const ClearanceStatus = () => {

  const [selectedStatus, setSelectedStatus] = React.useState('Cleared');
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
      style={styles.clearanceStatus}
      locations={[0, 1]}
      colors={["#266ca9", "#0042be"]}
    >

        <Image
          style={styles.avatarIcon}
          source={require("../../assets/images/avatar.png")}
        />

        <View style={styles.curvedHeader}></View>

        <Text style={styles.greet}>Hello</Text>
        <Text style={styles.userName}>Aiah Nadine</Text>

      <View style={styles.clearanceStatus1}>
        <Text style={[styles.clearanceStatus2, styles.helloTypo]}>
          Clearance Status
        </Text>
      </View>

      <View style={styles.selectField}>
        <View style={styles.select}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Cleared" value="Cleared" />
            <Picker.Item label="Pending" value="Pending" />
          </Picker>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.table}>
            <View style={styles.rowHeader}>
              {["Department", "Status", "Remarks"].map((title) => (
                <View style={styles.cell} key={title}>
                  <Text style={styles.headerText}>{title}</Text>
                </View>
              ))}
            </View>

            {[
              { department: "Supreme Student Council", status: "Cleared", remarks: "None" },
              { department: "Student Affairs", status: "Cleared", remarks: "None" },
              { department: "Spiritual Affairs", status: "Cleared", remarks: "None" },
              { department: "Student Discipline", status: "Pending", remarks: "None" },
              { department: "Guidance", status: "Pending", remarks: "None" },
              { department: "Library", status: "Cleared", remarks: "None" },
              { department: "Laboratory", status: "Cleared", remarks: "None" },
              { department: "Clinic", status: "Pending", remarks: "None" },
              { department: "Cashier", status: "Pending", remarks: "None" },
              { department: "Adviser", status: "Pending", remarks: "None" },
              { department: "Cluster Coordinator", status: "Pending", remarks: "None" },
              { department: "Registrar’s Office", status: "Pending", remarks: "None" },
              { department: "Dean/TED - Director", status: "Pending", remarks: "None" },
            ].map(({ department, status, remarks }, index) => (
              <View style={[styles.row, styles.grayRow]} key={index}>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{department}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={status === "Cleared" ? styles.cleared : styles.pending}>{status}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{remarks}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
  clearanceStatus: {
    flex: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp('7%'),
    paddingHorizontal: wp('5%'),
  },
  greet: {
    marginLeft: wp('12%'),
    marginTop: hp('7%'),
    fontSize: wp('5%'),
    color: '#fff',
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOpacity: 3,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  userName: {
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
  clearanceStatusText: {
    fontSize: wp('5%'),
    color: "#fff",
    textAlign: "left",
    marginLeft: wp('5%'),
    marginTop: hp('5%'),
  },
  clearanceStatus1: {
    marginTop: hp('5%'),
    left: wp('5%'),
  },
  clearanceStatus2: {
    marginTop: hp('5.5%'),
    fontSize: wp('5.5%'),
    color: "#fff3f3",
  },
  helloTypo: {
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 4 },
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textAlign: "center",
    fontFamily: 'SF-Pro-Display-Regular',
    position: "absolute",
  },
  selectField: {
    marginTop: hp('5%'),
    width: wp('40%'),
    height: hp('5%'),
    marginLeft: wp('55%'),
  },
  select: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp('2%'),
    backgroundColor: Color.backgroundDefaultDefault,
    borderRadius: 5,
    height: '100%',
  },
  picker: {
    flex: 1,
    height: hp('5%'),
    color: "#333",
  },
  tableContainer: {
    height: hp('60%'),
    marginTop: hp('2%'),
    marginHorizontal: wp('5%'),
  },
  scrollContainer: {
    paddingBottom: hp('2%'),
  },
  table: {
    flexDirection: 'column',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: '#fff',
  },
  rowHeader: {
    flexDirection: "row",
    height: hp('6%'),
    backgroundColor: '#D7D6D6',
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    height: hp('8%'),
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  grayRow: {
    backgroundColor: "#f0f0f0",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp('2%'),
  },
  headerText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  cellText: {
    fontSize: wp('4%'),
    color: "#333",
  },
  cleared: {
    fontSize: wp('4%'),
    color: "#4caf50",
  },
  pending: {
    fontSize: wp('4%'),
    color: "#ff6f61",
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

export default ClearanceStatus;
