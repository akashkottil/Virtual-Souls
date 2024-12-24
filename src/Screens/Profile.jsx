import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { windowWidth, windowHeight } from '../Constants/Dimensions';
import arrowIcon from '../../assets/SettingsIcons/arrow.png';
import privacyImg from "../../assets/SettingsIcons/privacy.png";
import subscriptionImg from "../../assets/SettingsIcons/subscribtion.png";
import termImg from "../../assets/SettingsIcons/terms.png";
import profileDp from '../../assets/ProfilePics/user.png';
import logout from "../../assets/SettingsIcons/logout.png";
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from "../Configuration/firebase";
import { getDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

// Import background image
import bgImg from '../../assets/bgImg.png';

const Profile = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState({
    username: 'Loading...',
    email: 'Loading...',
    photoURL: 'Loading...',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser; // Get the currently signed-in user
        if (currentUser) {

          // Fetch additional user details from Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid)); // Assuming 'users' collection exists in Firestore
          if (userDoc.exists()) {
            // console.log('exists value');

            const { username, email, photoURL } = userDoc.data(); // Destructure username and phoneNumber
            setUserData({
              username,
              email,
              photoURL,
            });
          } else {
            console.log('No user data found in Firestore');
          }
        } else {
          console.log('No user is signed in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Support data
  const support = [
    {
      id: 5,
      title: "Privacy",
      data: "Read our Privacy policies",
      icon: privacyImg,
      arrow: arrowIcon,
      screen: "privacy",
    },
    {
      id: 11,
      title: "My subscription",
      data: "current plan and details",
      icon: subscriptionImg,
      arrow: arrowIcon,
      screen: "plan",
    },
    {
      id: 31,
      title: "Terms and Policies",
      data: "community guidelines",
      icon: termImg,
      arrow: arrowIcon,
      screen: "terms",
    },
    {
      id: 12,
      title: "Logout",
      icon: logout,
      arrow: arrowIcon,
      screen: "Logout",
    },
  ];

  const handleNavigation = async (screen) => {
    if (screen === "Logout") {
      // Confirm logout
      Alert.alert(
        "Logout",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
              try {
                await signOut(auth); // Sign out from Firebase
              } catch (error) {
                console.error("Error logging out:", error);
                Alert.alert("Error", "Failed to log out. Please try again.");
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else if (screen) {
      navigation.navigate(screen); // Navigate to the target screen
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
    },
    profile: {
      gap: windowWidth * 0.03,
      marginTop: windowHeight * 0.09,
    },
    topSection: {
      justifyContent: "center",
      alignItems: "center",
      gap: windowWidth * 0.04,
    },
    proImgDiv: {
      borderRadius: windowWidth * 1,
      padding: 5,
    },
    profileImg: {
      height: windowWidth * 0.5,
      width: windowWidth * 0.5,
      borderRadius: windowWidth * 1,
    },
    name: {
      fontSize: windowWidth * 0.06,
      fontWeight: "400",
      fontFamily: 'PowerGrotesk-Regular',
      color: "white",
    },
    profilebtns: {
      display: "flex",
      flexDirection: "row",
      gap: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    profileText: {
      fontSize: windowWidth * 0.04,
      fontFamily: 'PowerGrotesk-Regular',
      color: "white",
    },
    line: {
      height: windowHeight * 0.02,
      width: 1.5,
    },
    mainWrapper: {
      paddingHorizontal: windowWidth * 0.04,
      flex: 1,
      borderRadius: windowWidth * 0.04,
      paddingTop: windowWidth * 0.04,
      paddingBottom: windowWidth * 0.04,
    },
    main: {
      alignSelf: "stretch",
      gap: windowHeight * 0.02,
    },
    mainCard: {
      borderRadius: 20,
      paddingVertical: 10,
      gap: 10,
    },
    icons: {
      height: windowWidth * 0.07,
      width: windowWidth * 0.07,
    },
    cardLeft: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: windowWidth * 0.04,
    },
    dataCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: windowWidth * 0.04,
      paddingVertical: windowHeight * 0.02,
      backgroundColor: "#27012D",
      borderRadius: windowWidth * 0.04,
    },
    arrowIcon: {
      height: windowWidth * 0.04,
      width: windowWidth * 0.04,
    },
    contentTitle: {
      fontSize: windowWidth * 0.04,
      fontWeight: "800",
      fontFamily: 'PowerGrotesk-Regular',
      color: "white",
    },
    contentPara: {
      width: windowWidth * 0.6,
      fontSize: windowWidth * 0.04,
      fontFamily: 'PowerGrotesk-Regular',
      color: "white",
    },
  });

  return (
    <ImageBackground
      source={bgImg} // Replace with your image URL or local image
      style={styles.container}
      resizeMode="cover"
      blurRadius={5}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile section */}
        <View style={styles.profile}>
          <View style={styles.topSection}>
            <LinearGradient
              style={styles.proImgDiv}
              colors={['#B21BF0', '#8001B3', "#C40B42"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image
                source={userData.photoURL ? { uri: userData.photoURL } : profileDp}
                style={styles.profileImg}
              />
            </LinearGradient>
            <Text style={styles.name}>{userData.username}</Text>
          </View>

          <View style={styles.profilebtns}>
            <Text style={styles.profileText}>{userData.email}</Text>
            <View style={styles.line}></View>
            <Text style={styles.profileText}>{userData.phoneNumber}</Text>
          </View>
        </View>

        {/* Main section */}
        <View style={styles.mainWrapper}>
          <ScrollView>
            <View style={styles.main}>
              {/* Support data */}
              <View style={styles.mainCard}>
                {support.map((data) => (
                  <TouchableOpacity
                    key={data.id}
                    style={styles.dataCard}
                    onPress={() => handleNavigation(data.screen)}
                  >
                    <View style={styles.cardLeft}>
                      <Image source={data.icon} style={styles.icons} />
                      <View style={styles.content}>
                        <Text style={styles.contentTitle}>{data.title}</Text>
                        {data.data ? (
                          <Text style={styles.contentPara}>{data.data}</Text>
                        ) : (
                          ""
                        )}
                      </View>
                    </View>
                    <Image source={data.arrow} style={styles.arrowIcon} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Profile;
