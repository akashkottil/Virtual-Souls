import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { windowWidth, windowHeight } from '../../Constants/Dimensions';

const DeclineModal = ({ 
  visible, 
  appointment, 
  onClose, 
  onDecline,
  declineReason,
  setDeclineReason 
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <BlurView 
          intensity={80}
          tint="dark"
          style={StyleSheet.absoluteFill}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={onClose}
          >
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={(e) => e.stopPropagation()}
              style={styles.modalContentWrapper}
            >
              <LinearGradient
                colors={['rgba(27, 9, 39, 0.95)', 'rgba(39, 1, 45, 0.95)']}
                style={styles.modalContent}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.modalHeader}>
                  <View style={styles.userInfo}>
                    <Image 
                      source={appointment?.image} 
                      style={styles.modalAvatar}
                      defaultSource={require('../../../assets/ProfilePics/user.png')}
                    />
                    <View style={styles.userTextInfo}>
                      <Text style={styles.modalName}>{appointment?.name}</Text>
                      <Text style={styles.modalLocation}>{appointment?.location}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.subjectContainer}>
                  <Text style={styles.subjectLabel}>Subject:</Text>
                  <Text style={styles.subjectText}>{appointment?.subject}</Text>
                </View>

                <View style={styles.dateContainer}>
                  <Icon name="calendar-today" size={20} color="#fff" />
                  <Text style={styles.dateText}>{appointment?.date}</Text>
                </View>

                <View style={styles.reasonContainer}>
                  <Text style={styles.reasonLabel}>Reason for declining:</Text>
                  <TextInput
                    style={styles.reasonInput}
                    placeholder="Type your reason here..."
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    multiline={true}
                    numberOfLines={4}
                    value={declineReason}
                    onChangeText={setDeclineReason}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.button}
                    onPress={onClose}
                  >
                    <LinearGradient
                      colors={['#B21BF0', '#C40B42']}
                      style={styles.gradientBorder}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                    >
                      <View style={styles.innerButton}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.button}
                    onPress={onDecline}
                  >
                    <LinearGradient
                      colors={['#B21BF0', '#C40B42']}
                      style={styles.gradientButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                    >
                      <Text style={styles.buttonText}>Decline</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(27, 9, 39, 0.6)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentWrapper: {
    width: windowWidth * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#B21BF0',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  modalContent: {
    padding: windowWidth * 0.05,
  },
  modalHeader: {
    marginBottom: windowHeight * 0.02,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAvatar: {
    width: windowWidth * 0.12,
    height: windowWidth * 0.12,
    borderRadius: windowWidth * 0.06,
    marginRight: windowWidth * 0.03,
  },
  userTextInfo: {
    flex: 1,
  },
  modalName: {
    color: '#fff',
    fontSize: windowWidth * 0.045,
    fontWeight: '600',
    marginBottom: 2,
  },
  modalLocation: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: windowWidth * 0.035,
  },
  subjectContainer: {
    marginBottom: windowHeight * 0.02,
  },
  subjectLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: windowWidth * 0.035,
    marginBottom: 4,
  },
  subjectText: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: windowWidth * 0.04,
    borderRadius: 12,
    marginBottom: windowHeight * 0.015,
  },
  dateText: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    marginLeft: windowWidth * 0.03,
  },
  reasonContainer: {
    marginBottom: windowHeight * 0.03,
  },
  reasonLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: windowWidth * 0.035,
    marginBottom: windowHeight * 0.01,
  },
  reasonInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: windowWidth * 0.04,
    color: '#fff',
    fontSize: windowWidth * 0.04,
    minHeight: windowHeight * 0.12,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: windowWidth * 0.03,
  },
  button: {
    flex: 1,
    height: windowHeight * 0.055,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientBorder: {
    flex: 1,
    padding: 1,
    borderRadius: 10,
  },
  innerButton: {
    flex: 1,
    backgroundColor: '#1B0927',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    fontWeight: '600',
  },
});

export default DeclineModal; 