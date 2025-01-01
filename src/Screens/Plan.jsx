import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { windowHeight, windowWidth } from '../Constants/Dimensions';
import { Colors } from '../Constants/Colors';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../Configuration/firebase';

const Plan = () => {
  const navigation = useNavigation();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [planDetails, setPlanDetails] = useState(null);
  const db = getFirestore();

  const planFeatures = [
    "Unlimited AI Chat Access",
    "Ad-free experience",
    "Exclusive Content Access"
  ];

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      
      if (userData?.subscription) {
        setHasSubscription(true);
        setPlanDetails(userData.subscription);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const renderSubscriptionContent = () => {
    if (hasSubscription) {
      return (
        <>
          <Text style={styles.headerText}>Current Plan</Text>
          <Text style={styles.subHeaderText}>Active Subscription</Text>

          <View style={styles.priceCardWrapper}>
            <LinearGradient
              colors={['#B21BF0', '#C40B42']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.priceCardBorder}
            >
              <LinearGradient
                colors={['#27012D', '#000000']}
                style={styles.priceCard}
              >
                <View style={styles.priceContainer}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <Text style={styles.price}>89</Text>
                  <Text style={styles.duration}>/week</Text>
                </View>
              </LinearGradient>
            </LinearGradient>
          </View>

          <View style={styles.featuresContainer}>
            {planFeatures.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.navigate('Home')}
          >
            <LinearGradient
              colors={['#9B3EC1', '#BF2754']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Return to Home</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.noticeContainer}>
            <Text style={styles.renewalNotice}>
              Next renewal: {planDetails?.nextRenewalDate || 'N/A'}
            </Text>
            <TouchableOpacity onPress={() => {/* Handle cancellation */}}>
              <Text style={[styles.renewalNotice, styles.cancelText]}>
                Cancel subscription
              </Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    return (
      <>
        <Text style={styles.headerText}>Subscription Plan</Text>
        <Text style={styles.subHeaderText}>Unlimited chat features!</Text>

        <View style={styles.priceCardWrapper}>
          <LinearGradient
            colors={['#B21BF0', '#C40B42']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.priceCardBorder}
          >
            <LinearGradient
              colors={['#27012D', '#000000']}
              style={styles.priceCard}
            >
              <View style={styles.priceContainer}>
                <Text style={styles.rupeeSymbol}>₹</Text>
                <Text style={styles.price}>89</Text>
                <Text style={styles.duration}>/week</Text>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        <View style={styles.featuresContainer}>
          {planFeatures.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('Payment')}
        >
          <LinearGradient
            colors={['#9B3EC1', '#BF2754']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Start Free Trial</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.noticeContainer}>
          <Text style={styles.renewalNotice}>
            Subscription auto-renews weekly
          </Text>
          <Text style={styles.renewalNotice}>
            Cancel anytime
          </Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../../assets/Influencers/Achu.png')}
        style={styles.backgroundImage}
      >
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.95)']}
          style={styles.imageGradient}
        />
      </ImageBackground>

      <View style={styles.content}>
        {renderSubscriptionContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: 'red',
  },
  backgroundImage: {
    height: windowHeight * 0.4, // Half of screen height
    width: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%', // Gradient takes bottom half of the image
  },
  content: {
    flex: 1,
    padding: windowWidth * 0.05,
    marginTop: -windowHeight * 0.05, // Pull content up to overlap with image
  },
  headerText: {
    fontSize: windowWidth * 0.09,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: windowHeight * 0.01,
  },
  subHeaderText: {
    fontSize: windowWidth * 0.045,
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: windowHeight * 0.04,
  },
  priceCardWrapper: {
    marginVertical: windowHeight * 0.03,
    width: windowWidth * 0.55,
    alignSelf: 'center',
  },
  priceCardBorder: {
    borderRadius: windowWidth * 0.06,
    padding: 1.5, // This creates the border effect
  },
  priceCard: {
    padding: windowHeight * 0.02,
    borderRadius: windowWidth * 0.06,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  rupeeSymbol: {
    fontSize: windowWidth * 0.08,
    color: Colors.white,
    fontWeight: '600',
  },
  price: {
    fontSize: windowWidth * 0.12,
    fontWeight: 'bold',
    color: Colors.white,
  },
  duration: {
    fontSize: windowWidth * 0.05,
    color: Colors.white,
    marginLeft: windowWidth * 0.02,
  },
  featuresContainer: {
    marginTop: windowHeight * 0.02,
    marginHorizontal: windowWidth * 0.08,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: windowHeight * 0.02,
  },
  bulletPoint: {
    fontSize: windowWidth * 0.05,
    color: Colors.white,
    marginRight: windowWidth * 0.02,
  },
  featureText: {
    fontSize: windowWidth * 0.045,
    color: Colors.white,
  },
  continueButton: {
    marginTop: 'auto',
    marginBottom: windowHeight * 0.02,
    width: windowWidth * 0.8,
    alignSelf: 'center',
  },
  gradientButton: {
    padding: windowHeight * 0.02,
    borderRadius: windowWidth * 0.03,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: windowWidth * 0.045,
    fontWeight: '600',
  },
  noticeContainer: {
    alignItems: 'center',
  },
  renewalNotice: {
    fontSize: windowWidth * 0.035,
    color: Colors.white,
    opacity: 0.7,
    textAlign: 'center',
  },
  cancelText: {
    color: '#FF4B4B',
    marginTop: windowHeight * 0.01,
    textDecorationLine: 'underline',
  },
});

export default Plan; 
