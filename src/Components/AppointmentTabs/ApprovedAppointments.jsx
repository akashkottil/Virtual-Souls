import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { windowWidth, windowHeight } from '../../Constants/Dimensions';

const ApprovedAppointments = ({ appointments }) => {
  return (
    <>
      {appointments.map((appointment) => (
        <LinearGradient
          key={appointment.id}
          colors={['#1B0927', '#27012D']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.userInfo}>
              <Image source={appointment.image} style={styles.avatar} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{appointment.name}</Text>
                <Text style={styles.location}>{appointment.location}</Text>
              </View>
            </View>
            <View style={styles.statusContainer}>
              <Icon name="check-circle" size={16} color="#4CAF50" />
              <Text style={[styles.statusText, { color: '#4CAF50' }]}>
                {appointment.status}
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.subject}>Subject: {appointment.subject}</Text>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateContainer}>
                <Icon name="calendar-today" size={16} color="#fff" />
                <Text style={styles.date}>{appointment.date}</Text>
              </View>
              {appointment.time && (
                <View style={styles.dateContainer}>
                  <Icon name="schedule" size={16} color="#fff" />
                  <Text style={styles.date}>{appointment.time}</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    padding: windowWidth * 0.04,
    marginBottom: windowHeight * 0.02,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: windowHeight * 0.015,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: windowWidth * 0.12,
    height: windowWidth * 0.12,
    borderRadius: windowWidth * 0.06,
    marginRight: windowWidth * 0.03,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: windowWidth * 0.045,
    fontWeight: '600',
    marginBottom: 2,
  },
  location: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: windowWidth * 0.035,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: windowWidth * 0.035,
    fontWeight: '500',
  },
  cardContent: {
    marginBottom: windowHeight * 0.01,
  },
  subject: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.01,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: windowWidth * 0.04,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: '#fff',
    marginLeft: windowWidth * 0.02,
    fontSize: windowWidth * 0.035,
  },
});

export default ApprovedAppointments; 