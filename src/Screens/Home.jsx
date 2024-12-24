import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator, TouchableOpacity, ImageBackground, } from 'react-native';
import { Image } from 'expo-image';
import { auth } from '../Configuration/firebase';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { windowHeight, windowWidth } from '../Constants/Dimensions';
import { LinearGradient } from 'expo-linear-gradient';

// import icons
import Icon from 'react-native-vector-icons/Foundation';

// import bg Image
import bgImg from '../../assets/bgImg.png'


const Home = ({ navigation }) => {
  const [botData, setBotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const storage = getStorage();
  const db = getFirestore();

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


  useEffect(() => {

    const fetchBots = async () => {
      try {
        // Fetch bot data from Firestore
        const usersSnapshot = await getDocs(collection(db, 'aiInfluencer'));
        const bots = usersSnapshot.docs.map(doc => {
          const { name, img } = doc.data();
          return { id: doc.id, name, img };
        });
        // console.log('Fetched bots:', bots);

        // Fetch image URLs from Firebase Storage
        const botsWithImages = await Promise.all(
          bots.map(async (bot) => {
            try {
              const imageRef = ref(storage, bot.img); // Get the image reference
              const imageUrl = await getDownloadURL(imageRef); // Get the URL
              return { ...bot, imageUrl };
            } catch (error) {
              console.error(`Error fetching image for bot ${bot.name}:`, error);
              return { ...bot, imageUrl: null }; // Handle missing images gracefully
            }
          })
        );

        setBotData(botsWithImages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bots data:', error);
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleProfileClick = (bot) => {
    navigation.navigate('Chat', { botName: bot.name, botImage: bot.imageUrl })
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading bots...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={bgImg} // Replace with your image URL or local image
      style={[styles.container, { backgroundColor: "#010101" }]}
      resizeMode="cover"
      blurRadius={5}

    >

      <SafeAreaView>

        <View style={[styles.topbar]}>
          <Text style={[styles.topbarText]}>Discover</Text>
          <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('plan') }}>
            <LinearGradient style={styles.searchView} colors={['#B21BF0', '#8001B3', "#C40B42"]}>
              <Icon name='crown' size={25} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.botContainer}>
            {botData && botData.length > 0 ? (
              botData.map((bot, index) => (
                <TouchableOpacity activeOpacity={1} onPress={() => handleProfileClick(bot)} key={bot.id} style={styles.botCard}>
                  <LinearGradient
                    style={styles.botCard}  // This already applies the styles
                    colors={['#B21BF0', '#8001B3', "#C40B42"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Image
                      style={styles.botImage}
                      source={{ uri: bot.imageUrl }}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                      transition={1000}
                    />
                    <View style={styles.botDetails}>
                      <Text style={styles.botName}>{bot.name}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No bots available</Text>
            )}
          </View>


          {/* <Button title="Influencer Add" onPress={() => navigation.navigate('Influencer')} />
        <Button title="Logout" color="red" onPress={handleLogout} /> */}
        </ScrollView>

      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: windowWidth * 0.1,
    paddingVertical: 15,

  },

  topbarText: {
    fontSize: windowWidth * 0.07,
    fontFamily: 'PowerGrotesk-Regular',
    color: "white"
  },
  searchView: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.1,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  botContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 10,  // Instead of setting height
    gap: 10
  },
  botCard: {
    width: windowWidth * 0.38,
    height: windowHeight * 0.25,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'transparent',
    borderRadius: windowWidth * 0.07,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignSelf: "center"
  },

  botImage: {
    width: "98%",
    height: "98%",
    borderRadius: windowWidth * 0.07,
  },
  botDetails: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
    bottom: windowHeight * 0.02,
  },
  botName: {
    fontSize: windowWidth * 0.06,
    fontWeight: 'bold',
    color: "white",
    textAlign: "center"
  },


});

export default Home;
