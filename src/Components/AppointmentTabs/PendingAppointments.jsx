import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { windowWidth, windowHeight } from '../../Constants/Dimensions';

const PendingAppointments = ({ appointments, onAccept, onDecline }) => {
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
            <TouchableOpacity style={styles.moreButton}>
              <Icon name="more-vert" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.subject}>Subject: {appointment.subject}</Text>
            <View style={styles.dateContainer}>
              <Icon name="calendar-today" size={16} color="#fff" />
              <Text style={styles.date}>{appointment.date}</Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onDecline(appointment)}
            >
              <LinearGradient
                colors={['#B21BF0', '#C40B42']}
                style={styles.declineButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.declineButton}>
                  <Text style={styles.buttonText}>Decline</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onAccept(appointment)}
            >
              <LinearGradient
                colors={['#9B3EC1', '#BF2754']}
                style={[styles.acceptButton, StyleSheet.absoluteFill]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </LinearGradient>
            </TouchableOpacity>
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
  cardContent: {
    marginBottom: windowHeight * 0.015,
  },
  subject: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.01,
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
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: windowWidth * 0.03,
  },
  actionButton: {
    flex: 1,
    height: windowHeight * 0.05,
    borderRadius: 10,
    overflow: 'hidden',
  },
  declineButtonGradient: {
    flex: 1,
    padding: 1,
    borderRadius: 10,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#1B0927',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    fontWeight: '500',
  },
});

export default PendingAppointments; 