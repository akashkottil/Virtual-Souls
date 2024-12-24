import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { windowWidth, windowHeight } from '../../Constants/Dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ScheduleInfo = () => {
  const stats = [
    { number: '76', label: 'Happy Calls' },
    { number: '4K', label: 'Reviews' },
  ];

  return (
    <View style={styles.container}>
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <React.Fragment key={stat.label}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
            {index < stats.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>

      {/* Bio Section */}
      <View style={styles.bioSection}>
        <Text style={styles.bioTitle}>Personal Bio</Text>
        <Text style={styles.bioText}>
          Aswathy Achu AI is Kerala's first realistic virtual influencer created by Alforia AI, 
          a firm specializing in AI technologies. She is a highly advanced digital persona 
          designed to collaborate with brands on Instagram. Her activities include posting 
          AI-generated photos, reels, and content created using AI scripts and voice technology.
        </Text>
      </View>

      {/* Starting Price */}
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Starting from</Text>
        <View style={styles.priceValue}>
          <FontAwesome name="circle" size={16} color="#FFB800" />
          <Text style={styles.priceNumber}>100</Text>
        </View>
      </View>

      {/* Instagram Button */}
      <View style={styles.instagramButtonWrapper}>
        <LinearGradient
          colors={['#9B3EC1', '#BF2754']}
          style={styles.gradientBorder}
        >
          <TouchableOpacity style={styles.instagramButton}>
            <Text style={styles.buttonText}>Show Instagram Profile</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: windowWidth * 0.05,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: windowHeight * 0.04,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.08,
  },
  statNumber: {
    color: '#fff',
    fontSize: windowWidth * 0.08,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    color: '#fff',
    fontSize: windowWidth * 0.035,
    opacity: 0.8,
  },
  divider: {
    width: 1,
    height: windowHeight * 0.04,
    backgroundColor: '#ffffff30',
  },
  bioSection: {
    marginBottom: windowHeight * 0.03,
  },
  bioTitle: {
    color: '#fff',
    fontSize: windowWidth * 0.045,
    fontWeight: '600',
    marginBottom: windowHeight * 0.015,
  },
  bioText: {
    color: '#fff',
    fontSize: windowWidth * 0.035,
    lineHeight: windowWidth * 0.05,
    opacity: 0.8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: windowHeight * 0.03,
  },
  priceLabel: {
    color: '#fff',
    fontSize: windowWidth * 0.035,
    marginRight: windowWidth * 0.02,
  },
  priceValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceNumber: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    fontWeight: '600',
    marginLeft: windowWidth * 0.01,
  },
  instagramButtonWrapper: {
    width: '100%',
    height: windowHeight * 0.06,
    borderRadius: windowWidth * 0.02,
    padding: 1,
  },
  gradientBorder: {
    flex: 1,
    borderRadius: windowWidth * 0.02,
    padding: 1,
  },
  instagramButton: {
    flex: 1,
    backgroundColor: '#170617',
    borderRadius: windowWidth * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: windowWidth * 0.04,
    fontWeight: '500',
  },
});

export default ScheduleInfo; 