import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../Configuration/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  limit,
  onSnapshot,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import BackIcon from "react-native-vector-icons/MaterialIcons";
import { windowWidth, windowHeight } from "../Constants/Dimensions";
import { Image } from 'expo-image';
import Icon from "react-native-vector-icons/Ionicons";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import * as Animatable from 'react-native-animatable';

const Chat = ({ route, navigation }) => {
  const { botName, botImage } = route.params;
  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState();
  const [text, setText] = useState("");
  const storage = getStorage();
  const [botNameChecker, setBotNameChecker] = useState();
  const [imageUrls, setImageUrls] = useState({});
  const [imagesDocs, setImagesDoc] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const flatListRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


  const fetchGPTResponse = async (userMessage, actAs) => {
    try {
      const requestBody = { message: userMessage, actAs };
      const response = await fetch(
        "https://imadibrahim-denogpt3o5-74-ss8wqw4cs1fx.deno.dev/alforia/chat/response",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
      const data = await response.json();
      return data.response || "Error: Could not fetch response.";
    } catch (error) {
      console.error("Error fetching GPT response:", error);
      return "Error: Unable to process your request.";
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: botName });

    flatListRef.current?.scrollToEnd({ animated: true });

    const fetchUserName = async () => {
      try {
        // Get user document from 'users' collection using current user's UID
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        console.log('userDoc :', currentUser.uid);
        if (userDoc.exists()) {
          setUserName(userDoc.data().username);
          // console.log('Username:', userName);
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUserName();

    if (currentUser) {
      const messagesRef = collection(db, "messages", currentUser.uid, botName);
      const messagesQuery = query(
        messagesRef,
        orderBy("userTimestamp", "desc"),
        limit(20)
      );

      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const fetchedMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Reverse to display messages in ascending order
          setMessages(fetchedMessages.reverse());
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [botName, currentUser, navigation]);

  // Function to fetch the image URL
  const fetchImageUrl = async (path) => {
    try {
      // const storage = getStorage();
      const imageRef = ref(storage, path); // Reference to the file in Firebase Storage
      const url = await getDownloadURL(imageRef); // Get the download URL
      return url;
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imagePromises = messages.map(async (message) => {
          if (message.bot && /\.(jpg|jpeg|png|gif|webp)$/i.test(message.bot)) {
            const path = message.bot; // Use the bot's message as the image path
            const url = await fetchImageUrl(path); // Fetch the image URL
            // console.log('bot image path :', path);



            return { id: message.id, url }; // Return message id and its image URL
          }
          return null; // Skip messages without valid image paths
        });

        // Resolve all image URL promises
        const resolvedImages = await Promise.all(imagePromises);

        // Update state with new image URLs
        const imageUrlMap = resolvedImages.reduce((acc, item) => {
          if (item) {
            acc[item.id] = item.url; // Map message id to its image URL
          }
          return acc;
        }, {});
        setImageUrls((prev) => ({ ...prev, ...imageUrlMap })); // Merge with previous state
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, [messages]); // Re-run whenever messages change

  const handleSend = async () => {
    const userMessage = text.trim();
    if (!userMessage || !currentUser) return;

    setText("");
    const messagesRef = collection(db, "messages", currentUser.uid, botName);

    try {
      // Fetch bot data from Firestore
      const usersSnapshot = await getDocs(collection(db, "aiInfluencer"));

      // Filter and extract the persona for a specific bot by name
      const botPersona = usersSnapshot.docs
        .filter((doc) => doc.data().name === botName) // Filter by bot name
        .map((doc) => doc.data().persona); // Extract only the persona

      if (!botPersona[0]) {
        console.error("Bot persona not found!");
        return;
      }

      const memoryBot = `
        ${botPersona[0] || "Persona not available."},
        This is the persona name who is chatting with you: ${userName || "a valued user"
        }.
        This is the previous chat text. Reply based on this as well:
        ${messages
          .map((message) => {
            // Skip bot messages with image extensions
            if (
              message.bot &&
              /\.(jpg|jpeg|png|gif|webp)$/i.test(message.bot)
            ) {
              return ""; // Skip this message
            }
            if (message.user) return `User: ${message.user}`;
            if (message.bot) return `Bot: ${message.bot}`;
            return ""; // Fallback in case of unexpected structure
          })
          .filter((line) => line !== "") // Remove empty lines
          .join("\n")}
        `;

      // console.log('memoryBot :', memoryBot);

      const userMessageData = {
        user: userMessage,
        userTimestamp: serverTimestamp(),
      };
      await addDoc(messagesRef, userMessageData);

      const userWantsImage =
        /(?:send|show|give|provide|need|want|share)\s+(?:an|a|your|ur)?\s*(?:image|pic|photo|picture|visual)/i.test(
          userMessage
        );

      if (userWantsImage) {
        try {
          let images = [];

          // Check if imagesDocs is already loaded
          if (imagesDocs && imagesDocs.exists() && botNameChecker == botName) {
            images = Object.values(imagesDocs.data()); // Extract image paths as an array
            // console.log('Existing Image Paths (From State):', images);
          } else {
            setBotNameChecker(botName);
            // Fetch the document from Firestore
            const imagesDoc = await getDoc(doc(db, "aiImages", botName));
            if (imagesDoc.exists()) {
              setImagesDoc(imagesDoc); // Update state with the document snapshot
              images = Object.values(imagesDoc.data()); // Extract image paths as an array
              // console.log('New Image Paths (From Firestore):', images);
            } else {
              console.error("No images found in Firestore document.");
            }
          }

          // Select a single random image path
          if (images.length > 0) {
            const randomImagePath =
              images[Math.floor(Math.random() * images.length)];
            // console.log('Random Image Path:', randomImagePath);

            // Add the bot response to Firestore
            const botResponse = randomImagePath;
            const botMessageData = {
              bot: botResponse,
              userTimestamp: serverTimestamp(),
            };
            await addDoc(messagesRef, botMessageData);
          } else {
            console.error("No image paths available to select a random image.");
          }
        } catch (error) {
          console.error("Error handling user image request:", error);
        }
      } else {
        try {
          // GPT response
          const botResponse = await fetchGPTResponse(userMessage, memoryBot);
          const botMessageData = {
            bot: botResponse,
            userTimestamp: serverTimestamp(),
          };
          await addDoc(messagesRef, botMessageData);
        } catch (error) {
          console.error("Error fetching GPT response:", error);
        }
      }

      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error handling messages:", error);
    }
  };

  const handleScroll = () => {
    setIsAutoScrolling(false); // Disable auto-scrolling when the user interacts with the list
  };

  const handleScrollEndDrag = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isAtBottom) {
      setIsAutoScrolling(true); // Re-enable auto-scrolling when the user scrolls to the bottom
    }
  };

  const LoadingDots = () => {
    const dots = [0, 1, 2];
    return (
      <View style={styles.botMessage}>
        <View style={styles.botBubble}>
          <View style={styles.loadingDotsContainer}>
            {dots.map((dot, index) => (
              <Animatable.View
                key={index}
                animation={{
                  0: { translateY: 0 },
                  0.5: { translateY: -5 },
                  1: { translateY: 0 }
                }}
                duration={1000}
                delay={index * 200}
                easing="ease-in-out"
                iterationCount="infinite"
                style={styles.loadingDot}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#1A0B1F', '#000000']}
      style={styles.container}
    >
      {/* Header */}
      <LinearGradient
        colors={['#0E000C', '#27012D']}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <BackIcon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: botImage }}
              style={styles.profileImage}
              contentFit="cover"
              placeholder={blurhash}
            />
            <View>
              <Text style={styles.headerTitle}>{botName}</Text>
              {/* <Text style={styles.activeStatus}>Active now</Text> */}
            </View>
          </View>
        </View>
        {/* <TouchableOpacity style={styles.callButton}>
          <LinearGradient
            colors={['#B21BF0', '#C40B42']}
            style={styles.callButtonGradient}
          >
            <Icon name="call" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity> */}
      </LinearGradient>

      {/* Chat Messages and Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 25}
      >
        <LinearGradient
          colors={['#27012D', '#0E000C']}
          style={styles.messagesContainer}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEndDrag}
            renderItem={({ item }) => (
              <View style={[
                styles.messageContainer,
                item.user ? styles.userMessage : styles.botMessage
              ]}>
                {item.user ? (
                  <Animatable.View 
                    animation="fadeInRight" 
                    duration={500}
                  >
                    <View style={styles.userBubble}>
                      <Text style={styles.messageText}>{item.user}</Text>
                    </View>
                    <View style={styles.userBubbleTail} />
                  </Animatable.View>
                ) : (
                  <Animatable.View 
                    animation="fadeInLeft" 
                    duration={500}
                  >
                    <View style={styles.botBubble}>
                      {item.bot && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.bot) ? (
                        imageUrls[item.id] ? (
                          <Animatable.View animation="zoomIn" duration={500}>
                            <Image
                              source={{ uri: imageUrls[item.id] }}
                              style={styles.messageImage}
                              contentFit="cover"
                            />
                            <LinearGradient
                              colors={['transparent', 'rgba(0,0,0,0.3)']}
                              style={styles.imageOverlay}
                            />
                          </Animatable.View>
                        ) : (
                          <ActivityIndicator color="#fff" size="large" />
                        )
                      ) : (
                        <Text style={styles.botmessageText}>{item.bot}</Text>
                      )}
                    </View>
                    <View style={styles.botBubbleTail} />
                  </Animatable.View>
                )}
              </View>
            )}
            ListFooterComponent={() => isLoading && <LoadingDots />}
          />
        </LinearGradient>

        {/* Input Area */}
        <View style={styles.inputWrapper}>
          <LinearGradient
            colors={['#B21BF0', '#C40B42']}
            style={styles.inputBorder}
          >
            <LinearGradient
              colors={['#27012D', '#0E000C']}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Message..."
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <LinearGradient
                  colors={['#B21BF0', '#C40B42']}
                  style={styles.sendButtonGradient}
                >
                  <Icon name="send" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth * 0.04,
    paddingVertical: windowHeight * 0.02,
    paddingTop: Platform.OS === 'ios' ? windowHeight * 0.06 : windowHeight * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: windowWidth * 0.02,
    marginRight: windowWidth * 0.02,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: windowWidth * 0.1,
    height: windowWidth * 0.1,
    borderRadius: windowWidth * 0.05,
    marginRight: windowWidth * 0.03,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: windowWidth * 0.045,
    fontWeight: '600',
  },
  activeStatus: {
    color: '#4CAF50',
    fontSize: windowWidth * 0.035,
  },
  callButton: {
    width: windowWidth * 0.12,
    height: windowWidth * 0.12,
  },
  callButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: windowWidth * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingVertical: windowHeight * 0.01,
  },
  messageContainer: {
    marginVertical: windowHeight * 0.005,
    marginHorizontal: windowWidth * 0.04,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#FFFFFF',
    maxWidth: windowWidth * 0.7,
    padding: windowWidth * 0.035,
    borderRadius: windowWidth * 0.05,
    borderBottomRightRadius:0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  userBubbleTail: {
    position: 'absolute',
    right: -8,
    bottom: -2.5,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
    transform: [{ rotate: '125deg' }],
  },
  botBubble: {
    backgroundColor: '#6A0DAD',
    maxWidth: windowWidth * 0.7,
    padding: windowWidth * 0.035,
    borderRadius: windowWidth * 0.05,
    borderBottomLeftRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  botBubbleTail: {
    position: 'absolute',
    left: -8,
    bottom: -2.8,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#6A0DAD',
    transform: [{ rotate: '-125deg' }],
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: windowWidth * 0.04,
    paddingVertical: windowWidth * 0.02,
    gap: 4,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
  },
  botmessageText:{
    color: '#FFF',
  },
  messageText: {
    color: '#000',
    fontSize: windowWidth * 0.04,
    lineHeight: windowWidth * 0.055,
  },
  messageImage: {
    width: windowWidth * 0.6,
    height: windowWidth * 0.6,
    borderRadius: windowWidth * 0.02,
  },
  inputWrapper: {
    padding: windowWidth * 0.04,
  },
  inputBorder: {
    borderRadius: windowWidth * 0.06,
    padding: 1.5, // This creates the border effect

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: windowWidth * 0.06,
    padding: windowWidth * 0.02,
    height: windowWidth * 0.13,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: windowWidth * 0.035,
    paddingHorizontal: windowWidth * 0.04,
    paddingVertical: windowHeight * 0.015,
    height: windowWidth * 0.13,
  },
  sendButton: {
    width: windowWidth * 0.12,
    height: windowWidth * 0.12,
    marginLeft: windowWidth * 0.02,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: windowWidth * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Chat;
