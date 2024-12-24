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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { windowWidth, windowHeight } from '../Constants/Dimensions';
import { Colors } from '../Constants/Colors';
import { useNavigation } from '@react-navigation/native';

// Import icons
import BackIcon from 'react-native-vector-icons/MaterialIcons';
import InstagramIcon from 'react-native-vector-icons/FontAwesome';

// Import components
import ScheduleInfo from '../Components/Schedule/ScheduleInfo.jsx';
import ScheduleCall from '../Components/Schedule/ScheduleCall.jsx';

const ScheduleScreen = ({ route }) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('schedule');
  
  // Get the bot details from route params
  const { botImage, botName } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Profile Image Section */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: botImage }}
            style={styles.profileImage}
          />
          
          {/* Top Bar with gradient background */}
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.8)', 'transparent']}
            style={styles.topBarGradient}
          >
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackIcon name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <InstagramIcon name="instagram" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['transparent', 'rgba(23, 6, 23, 0.8)', '#170617']}
            style={styles.profileOverlay}
          >
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{botName}</Text>
                <View style={styles.verifiedBadge}>
                  <BackIcon name="verified" size={16} color="white" />
                </View>
              </View>
              <View style={styles.locationContainer}>
                <Text style={styles.ratingText}>★ 4.2</Text>
                <Text style={styles.locationText}>Kochi</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Tabs with gradient border */}
        <View style={styles.tabOuterContainer}>
          <LinearGradient
            colors={['#B21BF0', '#C40B42']}
            style={styles.tabGradientBorder}
          >
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'schedule' && styles.activeTab]}
                onPress={() => setActiveTab('schedule')}
              >
                <LinearGradient
                  colors={activeTab === 'schedule' ? ['#9B3EC1', '#BF2754'] : ['transparent', 'transparent']}
                  style={styles.tabContent}
                >
                  <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>
                    Schedule
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.tab, activeTab === 'information' && styles.activeTab]}
                onPress={() => setActiveTab('information')}
              >
                <LinearGradient
                  colors={activeTab === 'information' ? ['#9B3EC1', '#BF2754'] : ['transparent', 'transparent']}
                  style={styles.tabContent}
                >
                  <Text style={[styles.tabText, activeTab === 'information' && styles.activeTabText]}>
                    Information
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'schedule' ? <ScheduleCall /> : <ScheduleInfo />}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#170617',
  },
  scrollView: {
    flex: 1,
  },
  topBarGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: windowHeight * 0.15,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.05,
    paddingTop: Platform.OS === 'ios' ? windowHeight * 0.06 : windowHeight * 0.04,
  },
  profileContainer: {
    height: windowHeight * 0.5,
    width: '100%',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  profileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: windowHeight * 0.15,
    justifyContent: 'flex-end',
    paddingHorizontal: windowWidth * 0.05,
    paddingBottom: windowHeight * 0.02,
  },
  profileInfo: {
    marginBottom: windowHeight * 0.01,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent:"center"
  },
  nameText: {
    color: 'white',
    fontSize: windowWidth * 0.06,
    fontWeight: '600',
    marginRight: 8,
    
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center"
  },
  ratingText: {
    color: 'white',
    fontSize: windowWidth * 0.035,
    marginRight: 8,
  },
  locationText: {
    color: 'white',
    fontSize: windowWidth * 0.035,
  },
  tabOuterContainer: {
    marginHorizontal: windowWidth * 0.05,
    marginTop: windowHeight * 0.02,
    borderRadius: windowWidth * 0.02,
    padding: 1, // This creates space for the gradient border
  },
  tabGradientBorder: {
    borderRadius: windowWidth * 0.02,
    padding: 1, // Thickness of the gradient border
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#170617', // Background color matching the screen
    borderRadius: windowWidth * 0.02,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
  },
  tabContent: {
    paddingVertical: windowHeight * 0.015,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: windowWidth * 0.05,
    paddingTop: windowHeight * 0.02,
    paddingBottom: windowHeight * 0.05,
  },
});

export default ScheduleScreen; 