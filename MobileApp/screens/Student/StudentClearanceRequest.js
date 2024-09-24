import React, { useState } from "react";
import { Text, Image, StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, StyleVariable, FontFamily, FontSize } from "../../components/GlobalStyles";
import { useNavigation } from '@react-navigation/native';

const StudentClearanceRequest = () => {


  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const navigation = useNavigation();

  const handleDropdownToggle = (index) => {
    setIsDropdownOpen(isDropdownOpen === index ? null : index);
  };

  const handleOptionSelect = (label, option) => {
    setSelectedOption((prev) => ({ ...prev, [label]: option }));
    setIsDropdownOpen(null);
  };

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

  const renderDropdown = (label, options, index) => (
    <View style={styles.dropdownContainer} key={index}>
      <TouchableOpacity 
        style={styles.dropdown} 
        onPress={() => handleDropdownToggle(index)}
      >
        <Text style={styles.dropdownText}>{selectedOption[label] || label}</Text>
        <Image
          style={styles.chevronDownIcon}
          contentFit="cover"
          source={require("../../assets/images/chevron-down.png")}
        />
      </TouchableOpacity>
      {isDropdownOpen === index && (
        <View style={styles.optionsContainer}>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleOptionSelect(label, item)}>
                <Text style={styles.option}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient
      style={styles.container}
      locations={[0, 1]}
      colors={["#266ca9", "#0042be"]}
    >

    <Image
        style={styles.vectorIcon}
        contentFit="cover"
        source={require("../../assets/images/vector.png")}
    />

    <Image
      style={styles.avatarIcon}
      contentFit="cover"
      source={require("../../assets/images/avatar.png")}
    />

      <View style={styles.curvedHeader}></View>

      <Text style={styles.greeting}>Hello</Text>
      <Text style={styles.userName}>Aiah Nadine</Text>

      <Text style={styles.title}>{`CLEARANCE\nREQUEST`}</Text>

      <View style={styles.formContainer}>
        {[{ label: "Semester", options: ["1st Semester", "2nd Semester"] },
          { label: "School Year", options: ["2024 - 2025", "2025 - 2026", "2026 - 2027", "2027 - 2028"] },
          { label: "Graduating?", options: ["Yes", "No"] }
        ].map((field, index) => renderDropdown(field.label, field.options, index))}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

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
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  header: {
    padding: wp('4%'),
    alignItems: "center",
    position: "absolute",
    marginTop: hp('2%'),
    marginLeft: 0,
    width: "100%",
    zIndex: 10,
  },
  greeting: {
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
  title: {
    fontSize: wp('10%'),
    lineHeight: hp('5%'),
    fontWeight: "800",
    color: "#000",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    textAlign: "center",
    marginTop: hp('15%'),
    },
  button: {
    width: wp('45%'),
    marginLeft: wp('28%'),
    marginTop: hp('0%'),
    backgroundColor: '#266ca9',
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
  buttonText: {
    color: '#fff',
    fontSize: wp('4%'),
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
    zIndex: 1,
  },
  menuIcon: {
    width: wp('9%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  request: {
    width: wp('9%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  status: {
    width: wp('9%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  account: {
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
  vectorIcon: {
    position: "absolute",
    width: wp('100%'),
    height: hp('100%'),
    marginTop: hp('15%'),
  },
  formContainer: {
    marginTop: hp('1%'),
    padding: wp('6%'),
  },
  dropdownContainer: {
    marginBottom: hp('2%')
    
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp('2%'),
    borderColor: Color.borderDefaultTertiary,
    borderWidth: 1,
    borderRadius: StyleVariable.radius200,
    backgroundColor: Color.backgroundDefaultDefault,
  },
  dropdownText: {
    flex: 1,
    fontSize: wp('4.5%'),
    color: Color.textDefaultDefault,
  },
  chevronDownIcon: {
    width: wp('4%'),
    height: hp('2%'),
  },
  optionsContainer: {
    borderColor: Color.borderDefaultDefault,
    borderWidth: 1,
    borderRadius: StyleVariable.radius200,
    backgroundColor: Color.backgroundDefaultDefault,
    position: "absolute",
    width: wp('92%'),
    marginTop: hp('6%'),
    zIndex: 5,
  },
  option: {
    fontSize: wp('4%'),
    color: Color.textDefaultDefault,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
  avatarIcon: {
    width: wp('13%'),
    height: hp('6%'),
    borderRadius: 50,
    position: 'absolute',
    marginLeft: wp('80%'),
    marginTop: hp('7%'),
  },
});

export default StudentClearanceRequest;
