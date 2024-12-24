import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { windowWidth, windowHeight } from "../Constants/Dimensions";

import BackIcon from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialIcons";

import influencerImg from "../../assets/ProfilePics/trainDp.jpg";
import userImg from "../../assets/ProfilePics/user.png";
import { Colors } from "../Constants/Colors";

const ScheduleCallScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    setDate(currentTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.left}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <BackIcon name="arrow-back" style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.right}>
          <Text style={styles.title}>Schedule a Call</Text>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.imageContainers}>
          <Image source={influencerImg} style={styles.image} contentFit="cover" transition={1000} />
          <Image source={userImg} style={styles.image2} contentFit="cover" transition={1000} />
        </View>

        <Text style={styles.subtitle}>Choose a date and time for the call.</Text>

        <View style={styles.inputContainer}>
          {/* Date Picker Button with Gradient */}
          <LinearGradient
            colors={Colors.headerGradient}
            start={{ x: 0, y: 1 }}  // Start from bottom (y: 1)
            end={{ x: 0, y: 0 }}    // End at top (y: 0)
            style={styles.pickerButton}
          >
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.pickerButtonContent}>
              <View style={styles.pickerRow}>
                <Icon name="date-range" size={30} color="white" />
                <View>
                  <Text style={styles.pickerLabel}>Date</Text>
                  <Text style={styles.pickerValue}>
                    {date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
          )}

          {/* Time Picker Button with Gradient */}
          <LinearGradient
            colors={Colors.headerGradient}
            start={{ x: 0, y: 1 }}  // Start from bottom (y: 1)
            end={{ x: 0, y: 0 }}    // End at top (y: 0)
            style={styles.pickerButton}
          >
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.pickerButtonContent}>
              <View style={styles.pickerRow}>
                <Icon name="access-time" size={30} color="white" />
                <View>
                  <Text style={styles.pickerLabel}>Time</Text>
                  <Text style={styles.pickerValue}>
                    {date.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          {showTimePicker && (
            <DateTimePicker value={date} mode="time" display="default" onChange={handleTimeChange} />
          )}

          {/* Schedule Button with Border Gradient */}
          
          <LinearGradient
            colors={Colors.inputGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.outerGradient}
          >
            <LinearGradient
              colors={Colors.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.innerGradient}
            >
              <TouchableOpacity style={styles.scheduleButton}>
                <Text style={styles.scheduleButtonText}>Schedule</Text>
              </TouchableOpacity>
            </LinearGradient>
          </LinearGradient>

          {/* Schedule Button with Border Gradient */}

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0212",
    paddingHorizontal: 20,
    paddingTop: windowHeight * 0.02,
  },
  topBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: windowWidth * 0.16,
  },

  main: {
    marginTop: windowHeight * 0.05,
  },

  imageContainers: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: windowWidth * 0.2,
    gap: 10,
  },

  image: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.15,
    marginTop: 0,
    borderRadius: windowWidth * 1,
  },
  image2: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.15,
    marginTop: 0,
    borderRadius: windowWidth * 1,
    position: "absolute",
    left: windowWidth * 0.4,
  },

  backIcon: {
    fontSize: 30,
    color: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginVertical: windowHeight * 0.03,
  },
  inputContainer: {
    paddingHorizontal: windowWidth * 0.08,
  },
  pickerButton: {
    backgroundColor: "#170617",
    borderRadius: 8,
    paddingVertical: windowHeight * 0.0001,
    paddingHorizontal: windowWidth * 0.01,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#C1C1C1",
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  pickerButtonContent: {
    paddingVertical: windowHeight * 0.01,
    paddingHorizontal: windowWidth * 0.05,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  pickerValue: {
    fontSize: 16,
    color: "#fff",
  },
  outerGradient: {
    borderRadius: 30,
    marginTop: 40,
    paddingVertical: windowHeight * 0.003,
    paddingHorizontal: windowWidth * 0.005,  // Adjusted for the border effect
  },
  innerGradient: {
    borderRadius: 30,
    paddingVertical: 15,  // Inner gradient size smaller to look like a button
    paddingHorizontal: 20,
  },
  scheduleButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ScheduleCallScreen;