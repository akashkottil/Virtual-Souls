import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { windowWidth, windowHeight } from '../../Constants/Dimensions';

const ScheduleSuccess = ({ visible, onClose }) => {
  // Define the color filter to match your gradient colors
  const colorFilter = [
    {
      keypath: "Check Mark", // This should match the layer name in your Lottie file
      color: "#9B3EC1", // Your gradient start color
    },
    {
      keypath: "Check Mark Outlines",
      color: "#BF2754", // Your gradient end color
    }
  ];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <LottieView
            source={require('../../Assets/Animations/SuccessLottie.json')}
            autoPlay
            loop={false}
            style={styles.animation}
            onAnimationFinish={onClose}
            colorFilters={colorFilter}
            // You can also use a single color like this:
            // colorFilters={[{ keypath: "**", color: "#9B3EC1" }]}
          />
          <Text style={styles.title}>Call Scheduled!</Text>
          <Text style={styles.subtitle}>
            Aswathy Achu will update your request soon
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(23, 6, 23, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    padding: windowWidth * 0.05,
  },
  animation: {
    width: windowWidth * 0.3,
    height: windowWidth * 0.3,
  },
  title: {
    color: '#fff',
    fontSize: windowWidth * 0.06,
    fontWeight: '600',
    marginTop: windowHeight * 0.02,
    marginBottom: windowHeight * 0.01,
  },
  subtitle: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    opacity: 0.8,
    textAlign: 'center',
  },
});

export default ScheduleSuccess;
