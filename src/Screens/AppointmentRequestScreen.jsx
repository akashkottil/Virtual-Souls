import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Platform,
  Modal,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { TextInput } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AppointmentRequestScreen = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedHour, setSelectedHour] = useState('05');
  const [selectedMinute, setSelectedMinute] = useState('30');
  const [selectedPeriod, setSelectedPeriod] = useState('PM');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [rejectedAppointments, setRejectedAppointments] = useState([]);
  const [requestAppointments, setRequestAppointments] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      image: require("../../assets/ProfilePics/user.png"),
      location: "New York, USA",
      subject: "Project Discussion",
      date: "24 Dec, 2023",
      time: "2:30 PM",
    },
    {
      id: 2,
      name: "Kasinath MS",
      location: "Kochi, Kerala",
      subject: "Colab for my brand!",
      date: "20/12/2024",
      image: require('../../assets/ProfilePics/user.png'),
    },
    {
      id: 3,
      name: "Imad Ibrahim",
      location: "Kochi, Kerala",
      subject: "Colab for my brand!",
      date: "20/12/2024",
      image: require('../../assets/ProfilePics/user.png'),
    },
  ]);

  // Generate time options
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ['AM', 'PM'];

  const [declineReason, setDeclineReason] = useState('');

  const handleDecline = () => {
    if (selectedAppointment) {
      const declinedAppointment = {
        ...selectedAppointment,
        status: 'declined',
        reason: declineReason
      };
      setRejectedAppointments([...rejectedAppointments, declinedAppointment]);
      setRequestAppointments(requestAppointments.filter(app => app.id !== selectedAppointment.id));
      setShowDeclineModal(false);
      setDeclineReason('');
      setSelectedAppointment(null);
    }
  };

  const TimePickerColumn = ({ data, selected, onSelect, width }) => (
    <View style={[styles.timePickerColumn, { width }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.timeOption,
              item === selected && styles.selectedTimeOption,
            ]}
            onPress={() => onSelect(item)}
          >
            <Text style={[
              styles.timeOptionText,
              item === selected && styles.selectedTimeOptionText,
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const formatTime = () => {
    return `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
  };

  const handleSchedule = () => {
    if (selectedAppointment) {
      const approvedAppointment = {
        ...selectedAppointment,
        time: formatTime(),
        status: 'approved'
      };
      setApprovedAppointments([...approvedAppointments, approvedAppointment]);
      setRequestAppointments(requestAppointments.filter(app => app.id !== selectedAppointment.id));
      setShowAcceptModal(false);
      setSelectedAppointment(null);
    }
  };

  const handleReject = () => {
    if (selectedAppointment) {
      const rejectedAppointment = {
        ...selectedAppointment,
        status: 'rejected'
      };
      setRejectedAppointments([...rejectedAppointments, rejectedAppointment]);
      setRequestAppointments(requestAppointments.filter(app => app.id !== selectedAppointment.id));
      setShowDeclineModal(false);
      setSelectedAppointment(null);
    }
  };

  const PendingAppointmentCard = ({ appointment }) => (
    <LinearGradient
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
          style={[styles.actionButton]}
          onPress={() => {
            setSelectedAppointment(appointment);
            setShowDeclineModal(true);
          }}
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
          style={[styles.actionButton]}
          onPress={() => {
            setSelectedAppointment(appointment);
            setShowAcceptModal(true);
          }}
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
  );

  const ApprovedAppointmentCard = ({ appointment }) => (
    <LinearGradient
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
          <Text style={[styles.statusText, { color: '#4CAF50' }]}>{appointment.status}</Text>
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
  );

  const RejectedAppointmentCard = ({ appointment }) => (
    <LinearGradient
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
          <Icon name="cancel" size={16} color="#FF5252" />
          <Text style={[styles.statusText, { color: '#FF5252' }]}>{appointment.status}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.subject}>Subject: {appointment.subject}</Text>
        <View style={styles.dateContainer}>
          <Icon name="calendar-today" size={16} color="#fff" />
          <Text style={styles.date}>{appointment.date}</Text>
        </View>
        <View style={styles.reasonContainer}>
          <Text style={styles.reasonLabel}>Reason:</Text>
          <Text style={styles.reasonText}>{appointment.reason}</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderAppointments = () => {
    switch (activeTab) {
      case 'requests':
        return requestAppointments.map((appointment) => (
          <PendingAppointmentCard key={appointment.id} appointment={appointment} />
        ));
      case 'approved':
        return approvedAppointments.map((appointment) => (
          <ApprovedAppointmentCard key={appointment.id} appointment={appointment} />
        ));
      case 'rejected':
        return rejectedAppointments.map((appointment) => (
          <RejectedAppointmentCard key={appointment.id} appointment={appointment} />
        ));
      default:
        return null;
    }
  };

  const AcceptModal = ({ appointment }) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showAcceptModal}
      onRequestClose={() => setShowAcceptModal(false)}
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark">
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAcceptModal(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContentWrapper}
          >
            <LinearGradient
              colors={['#1B0927', '#27012D']}
              style={styles.modalContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.modalHeader}>
                <View style={styles.userInfo}>
                  <Image source={appointment?.image} style={styles.modalAvatar} />
                  <View>
                    <Text style={styles.modalName}>{appointment?.name}</Text>
                    <Text style={styles.modalLocation}>{appointment?.location}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => {
                  setShowAcceptModal(false);
                  setShowTimePicker(false);
                }}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubject}>Subject: {appointment?.subject}</Text>
              
              <View style={styles.dateTimeContainer}>
                <View style={styles.timeLabel}>
                  <Icon name="calendar-today" size={20} color="#fff" />
                  <Text style={styles.timeText}>Date</Text>
                  <Text style={styles.selectedTime}>{appointment?.date}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(!showTimePicker)}
              >
                <View style={styles.timeLabel}>
                  <Icon name="schedule" size={20} color="#fff" />
                  <Text style={styles.timeText}>Set Time</Text>
                  <Text style={styles.selectedTime}>{formatTime()}</Text>
                </View>
              </TouchableOpacity>

              {showTimePicker && (
                <View style={styles.customTimePickerContainer}>
                  <View style={styles.timePickerWrapper}>
                    <TimePickerColumn
                      data={hours}
                      selected={selectedHour}
                      onSelect={setSelectedHour}
                      width={'30%'}
                    />
                    <Text style={styles.timeSeparator}>:</Text>
                    <TimePickerColumn
                      data={minutes}
                      selected={selectedMinute}
                      onSelect={setSelectedMinute}
                      width={'30%'}
                    />
                    <TimePickerColumn
                      data={periods}
                      selected={selectedPeriod}
                      onSelect={setSelectedPeriod}
                      width={'25%'}
                    />
                  </View>
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton]}
                  onPress={() => {
                    setShowAcceptModal(false);
                    setShowTimePicker(false);
                  }}
                >
                  <LinearGradient
                    colors={['#9B3EC1', '#BF2754']}
                    style={[styles.gradientBorder, StyleSheet.absoluteFill]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  >
                    <View style={styles.innerDeclineButton}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton]}
                  onPress={handleSchedule}
                >
                  <LinearGradient
                    colors={['#9B3EC1', '#BF2754']}
                    style={[styles.scheduleButton, StyleSheet.absoluteFill]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.buttonText}>Schedule</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );

  const DeclineModal = ({ appointment }) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showDeclineModal}
      onRequestClose={() => setShowDeclineModal(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BlurView intensity={20} style={[StyleSheet.absoluteFill]} tint="dark">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentWrapper}>
              <LinearGradient
                colors={['#1B0927', '#27012D']}
                style={styles.modalContent}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.modalHeader}>
                  <View style={styles.userInfo}>
                    <Image source={appointment?.image} style={styles.modalAvatar} />
                    <View>
                      <Text style={styles.modalName}>{appointment?.name}</Text>
                      <Text style={styles.modalLocation}>{appointment?.location}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.modalSubject}>Subject: {appointment?.subject}</Text>
                
                <View style={styles.dateTimeContainer}>
                  <View style={styles.timeLabel}>
                    <Icon name="calendar-today" size={20} color="#fff" />
                    <Text style={styles.timeText}>Date</Text>
                    <Text style={styles.selectedTime}>{appointment?.date}</Text>
                  </View>
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

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalButton]}
                    onPress={() => {
                      setShowDeclineModal(false);
                      setDeclineReason('');
                    }}
                  >
                    <LinearGradient
                      colors={['#9B3EC1', '#BF2754']}
                      style={[styles.gradientBorder, StyleSheet.absoluteFill]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                    >
                      <View style={styles.innerDeclineButton}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton]}
                    onPress={handleDecline}
                  >
                    <LinearGradient
                      colors={['#9B3EC1', '#BF2754']}
                      style={[styles.scheduleButton, StyleSheet.absoluteFill]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.buttonText}>Decline</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointment Request</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="tune" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <LinearGradient
          colors={['#B21BF0', '#C40B42']}
          style={styles.tabGradientBorder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.tabInnerContainer}>
            <TouchableOpacity
              style={[styles.tab]}
              onPress={() => setActiveTab('requests')}
            >
              <LinearGradient
                colors={activeTab === 'requests' ? ['#9B3EC1', '#BF2754'] : ['transparent', 'transparent']}
                style={styles.tabContent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
                  Requests
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab]}
              onPress={() => setActiveTab('approved')}
            >
              <LinearGradient
                colors={activeTab === 'approved' ? ['#9B3EC1', '#BF2754'] : ['transparent', 'transparent']}
                style={styles.tabContent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>
                  Approved
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab]}
              onPress={() => setActiveTab('rejected')}
            >
              <LinearGradient
                colors={activeTab === 'rejected' ? ['#9B3EC1', '#BF2754'] : ['transparent', 'transparent']}
                style={styles.tabContent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.tabText, activeTab === 'rejected' && styles.activeTabText]}>
                  Rejected
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderAppointments()}
      </ScrollView>
      <AcceptModal appointment={selectedAppointment} />
      <DeclineModal appointment={selectedAppointment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#170617',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterButton: {
    padding: 8,
  },
  tabContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  tabGradientBorder: {
    padding: 1,
    borderRadius: 25,
  },
  tabInnerContainer: {
    flexDirection: 'row',
    backgroundColor: '#170617',
    borderRadius: 25,
  },
  tab: {
    flex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  location: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  moreButton: {
    padding: 4,
  },
  cardContent: {
    marginBottom: 16,
  },
  subject: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    height: 45,
  },
  declineButtonGradient: {
    flex: 1,
    padding: 1,
    borderRadius: 8,
  },
  declineButton: {
    flex: 1,
    borderRadius: 7,
    backgroundColor: '#27012D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reasonContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  reasonLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  reasonInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 20,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContentWrapper: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalLocation: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  modalSubject: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  dateTimeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  modalDate: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  modalButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scheduleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  declineModalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  declineModalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmDeclineButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  gradientBorder: {
    borderRadius: 8,
    padding: 1,
  },
  innerDeclineButton: {
    flex: 1,
    backgroundColor: '#1B0927',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  timeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  selectedTime: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  customTimePickerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  timePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 150,
  },
  timePickerColumn: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
  },
  timeOption: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  selectedTimeOption: {
    backgroundColor: 'rgba(43, 181, 152, 0.2)',
  },
  timeOptionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
  },
  selectedTimeOptionText: {
    color: '#2BB598',
    fontWeight: 'bold',
  },
  timeSeparator: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
});

export default AppointmentRequestScreen;
