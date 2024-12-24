import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { windowWidth, windowHeight } from '../../Constants/Dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ScheduleSuccess from './ScheduleSuccess';

const ScheduleCall = () => {
  const dates = [
    { day: 'Mon', date: 19 },
    { day: 'Tue', date: 20 },
    { day: 'Wed', date: 21 },
    { day: 'Thu', date: 22 },
    { day: 'Fri', date: 23 },
  ];

  const durations = [
    { time: '10 Min', coins: 100 },
    { time: '20 Min', coins: 200 },
    { time: '30 Min', coins: 300 }
  ];
  
  const [selectedDate, setSelectedDate] = useState(dates[0].date);
  const [subject, setSubject] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(durations[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  const renderDatePicker = () => {
    return (
      <View style={styles.datePickerContainer}>
        <Text style={styles.dateLabel}>Pick a date</Text>
        <View style={styles.dateSelector}>
          {/* <TouchableOpacity style={styles.arrowButton}>
            <MaterialIcons name="chevron-left" size={24} color="white" />
          </TouchableOpacity> */}

          <View style={styles.datesContainer}>
            {dates.map(({ day, date }) => (
              <TouchableOpacity
                key={date}
                onPress={() => setSelectedDate(date)}
                style={styles.dateButton}
              >
                {selectedDate === date ? (
                  <LinearGradient
                    colors={['#9B3EC1', '#BF2754']}
                    style={styles.gradientDateButton}
                  >
                    <Text style={styles.dayText}>{day}</Text>
                    <Text style={styles.dateText}>{date}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.normalDateButton}>
                    <Text style={styles.dayText}>{day}</Text>
                    <Text style={styles.dateText}>{date}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* <TouchableOpacity style={styles.arrowButton}>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  const renderDurationButtons = () => {
    return (
      <View style={styles.durationSection}>
        <Text style={styles.label}>Call duration</Text>
        <View style={styles.durationContainer}>
          {durations.map((item) => (
            <TouchableOpacity
              key={item.time}
              onPress={() => setSelectedDuration(item)}
              style={styles.durationButton}
            >
              {selectedDuration.time === item.time ? (
                <LinearGradient
                  colors={['#9B3EC1', '#BF2754']}
                  style={styles.gradientDurationButton}
                >
                  <Text style={styles.durationText}>{item.time}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.normalDurationButton}>
                  <Text style={styles.durationText}>{item.time}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.coinsContainer}>
          <FontAwesome name="rupee" size={20} color="#FFB800" />
          <Text style={styles.coinsText}>{selectedDuration.coins}</Text>
        </View>
      </View>
    );
  };

  const handleSchedule = () => {
    setShowSuccess(true);
  };

  return (
    <View style={styles.container}>
      {renderDatePicker()}
      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a message"
        placeholderTextColor="#666"
        value={subject}
        onChangeText={setSubject}
      />
      {renderDurationButtons()}
      {/* Schedule button */}
      <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedule}>
        <LinearGradient
          colors={['#9B3EC1', '#BF2754']}
          style={styles.gradientButton}
        >
          <Text style={styles.scheduleButtonText}>Schedule</Text>
        </LinearGradient>
      </TouchableOpacity>
      <ScheduleSuccess 
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: windowHeight * 0.02,
  },
  label: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.01,
    textAlign:"center"
  },
  datePickerContainer: {
    marginBottom: windowHeight * 0.03,
    alignItems: 'center',
  },
  dateLabel: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.015,
    textAlign: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
//   arrowButton: {
//     padding: 8,
//   },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  dateButton: {
    width: windowWidth * 0.15,
    height: windowWidth * 0.15,
    marginHorizontal: windowWidth * 0.01,
  },
  gradientDateButton: {
    width: '100%',
    height: '100%',
    borderRadius: windowWidth * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalDateButton: {
    width: '100%',
    height: '100%',
    borderRadius: windowWidth * 0.02,
    borderWidth: 1,
    borderColor: '#9B3EC1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(155, 62, 193, 0.1)',
  },
  dayText: {
    color: '#fff',
    fontSize: windowWidth * 0.03,
    marginBottom: 2,
    opacity: 0.8,
  },
  dateText: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#27012D',
    borderRadius: windowWidth * 0.02,
    padding: windowWidth * 0.04,
    color: '#fff',
    marginBottom: windowHeight * 0.03,
    borderColor:"#CECECE",
    borderWidth:1,
    textAlign:"center",
    fontSize:windowWidth * 0.04
    },
  durationSection: {
    marginBottom: windowHeight * 0.03,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth * 0.02,
    marginBottom: windowHeight * 0.02,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight * 0.01,
  },
  coinsText: {
    color: '#fff',
    fontSize: windowWidth * 0.045,
    fontWeight: '600',
    marginLeft: windowWidth * 0.02,
  },
  durationButton: {
    width: windowWidth * 0.25,
    height: windowHeight * 0.05,
  },
  gradientDurationButton: {
    flex: 1,
    borderRadius: windowWidth * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalDurationButton: {
    flex: 1,
    borderRadius: windowWidth * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#9B3EC1',
    backgroundColor: 'rgba(155, 62, 193, 0.1)',
  },
  durationText: {
    color: '#fff',
    fontSize: windowWidth * 0.035,
    fontWeight: '500',
  },
  scheduleButton: {
    marginTop: 'auto',
  },
  gradientButton: {
    padding: windowWidth * 0.04,
    borderRadius: windowWidth * 0.02,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    fontWeight: '600',
  },
});

export default ScheduleCall; 