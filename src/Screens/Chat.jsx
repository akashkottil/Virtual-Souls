import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
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
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import BackIcon from "react-native-vector-icons/MaterialIcons";
import { windowWidth, windowHeight } from "../Constants/Dimensions";
import { Colors } from "../Constants/Colors";
import { Image } from 'expo-image';
// import useSWR from 'swr'

// import icons
import Icon from "react-native-vector-icons/Ionicons";

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

  return (
    <>
      {/* <KeyboardAvoidingView
      style={styles.container}
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={100}
    > */}
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <View style={styles.innerContainer}>
        <LinearGradient
          colors={Colors.headerGradient} // Define your gradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.topbar} // Apply gradient styles
        >
          <View style={styles.left}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon
                name="arrow-back"
                size={windowWidth * 0.06}
                style={styles.backIcon}
              />
            </TouchableOpacity>

            <View style={styles.proDetails}>
              <Image source={{ uri: botImage }}
                style={styles.propicimg}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
              <View>
                <Text style={styles.name}>{botName}</Text>
                {/* <View style={styles.statusbar}>
                <Text style={styles.status}>Active now</Text>
                <View style={styles.active}></View>
              </View> */}
              </View>
            </View>
          </View>

          {/* Add the call icon on the right */}
          <TouchableOpacity
            style={styles.callIconContainer}
            onPress={() => navigation.navigate('schedule', {
              botImage: botImage,
              botName: botName
            })}
          >
            <Icon name="call-outline" size={windowWidth * 0.06} color="white" />
          </TouchableOpacity>
         
        </LinearGradient>

        <LinearGradient
          colors={Colors.chatBgGradient}  // Define your gradient colors
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.messageList} // New style for the gradient container
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEndDrag}
            renderItem={({ item }) => (
              <View
                style={
                  item.user
                    ? styles.userMessageWrapper
                    : styles.botMessageWrapper
                }
              >
                {item.user && (
                  <View style={[styles.userMessageBox, styles.userMessage]}>
                    <Text style={styles.userMessageText}>{item.user}</Text>
                  </View>
                )}
                {item.bot && (
                  <LinearGradient
                    colors={Colors.chatGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.botMessageBox, styles.botMessage]}
                  >
                    {/* Check if the bot's message contains an image extension */}
                    {/\.(jpg|jpeg|png|gif|webp)$/i.test(item.bot) ? (
                      <Image
                        source={{ uri: imageUrls[item.id] }} // Use the URL associated with this message
                        style={styles.image}
                        placeholder={{ blurhash }}
                        contentFit="cover"
                      transition={1000}
                      />
                    //   <Image
                    //   style={styles.botImage}
                    //   source={{ uri: bot.imageUrl }}
                    //   placeholder={{ blurhash }}
                    //   contentFit="cover"
                    //   transition={1000}
                    // />
                    ) : (
                      <Text style={styles.messageText}>{item.bot}</Text>
                    )}
                  </LinearGradient>
                )}
              </View>
            )}
          />
        </LinearGradient>

        <View style={styles.inputContainer}>
          <LinearGradient
            colors={Colors.inputGradient} // Define your gradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 2 }}
            style={styles.gradientBorder} // Gradient wrapper with padding
          >
            <LinearGradient
              colors={Colors.innerInputGradient} // Define your gradient colors
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.innerInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                placeholderTextColor="white"
                value={text}
                onChangeText={setText}
              />
              <LinearGradient
                colors={Colors.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sendButtonGradient}
              >
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                  <Text style={styles.sendButtonText}>Send</Text>
                  {/* <Icon name='paper-plane' size={20} color="#FFFFFF" style={styles.plane} /> */}
                </TouchableOpacity>
              </LinearGradient>
            </LinearGradient>
          </LinearGradient>
        </View>
      </View>
      {/* </TouchableWithoutFeedback> */}
      {/* </KeyboardAvoidingView> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#170617",
  },
  
  innerContainer: {
    flex: 1,
    backgroundColor: "#170617",
  },
  messageList: {
    flex: 1,
    paddingHorizontal: windowWidth * 0.06,
    paddingTop: windowHeight * 0.04
  },
  botMessageBox: {
    padding: 10,
    borderRadius: windowWidth * 0.05,
    maxWidth: "80%",
    marginBottom: 10,
    borderBottomLeftRadius: 0
  },
  userMessageBox: {
    padding: 10,
    borderRadius: windowWidth * 0.05,
    maxWidth: "80%",
    marginBottom: 10,
    borderBottomRightRadius: 0
  },
  userMessageText: {
    fontSize: windowWidth * 0.045,
    color: "black",
  },
  messageText: {
    fontSize: windowWidth * 0.045,
    color: "white",
  },
  userMessageWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  botMessageWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: Colors.userChat,
    alignSelf: "flex-end",

  },
  botMessage: {
    backgroundColor: "#522FDC",
    alignSelf: "flex-start",
  },
  gradientBorder: {
    padding: windowHeight * 0.002, // Padding for the gradient border
    borderRadius: windowWidth * 0.05,
  },
  innerInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: windowWidth * 0.05, // Same as gradientBorder to ensure alignment
    paddingHorizontal: windowWidth * 0.04,
    paddingVertical: windowWidth * 0.01 // Inner padding
  },
  inputContainer: {
    paddingHorizontal: windowWidth * 0.08,
    backgroundColor: "#170617",
    paddingVertical: windowHeight * 0.01,
    borderRadius: windowWidth * 0.05,
  },
  input: {
    flex: 1,
    height: windowHeight * 0.045,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "white"
    // backgroundColor:"red"
  },
  image: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.4,
    marginTop: 0,
    borderRadius: windowWidth * 0.05,
  },

  topbar: {
    flexDirection: "row",
    // backgroundColor: "white",
    paddingHorizontal: windowWidth * 0.04,
    paddingVertical: windowWidth * 0.04,
    justifyContent: "space-between",
    // zIndex: 10,
    // shadowColor: "black",
    // shadowOffset: {
    //   width: 0,
    //   height: 40,
    // },

    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 4,
    alignItems: "center",
    // borderBottomColor:"black"
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: windowWidth * 0.02,
  },
  backIcon: {
    height: windowWidth * 0.06,
    width: windowWidth * 0.06,
    color: "white",
  },
  propicimg: {
    height: windowWidth * 0.11,
    width: windowWidth * 0.11,
    borderRadius: windowWidth * 1,
    backgroundColor: 'gray',
  },
  name: {
    fontWeight: "800",
    fontSize: windowWidth * 0.05,
    fontFamily: "PowerGrotesk-Regular",
    color: Colors.white,
  },
  // statusbar: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "flex-start",
  // },
  // status: {
  //   fontWeight: "300",
  //   paddingRight: windowWidth * 0.03,
  //   fontSize: windowWidth * 0.03,
  //   paddingTop: windowWidth * 0.01,
  //   fontFamily:'PowerGrotesk-Regular',
  //   color:Colors.white
  // },
  // active: {
  //   height: windowWidth * 0.02,
  //   width: windowWidth * 0.02,
  //   backgroundColor: "#00C92C",
  //   borderRadius: windowWidth * 1,
  //   position: "absolute",
  //   right: 0
  // },
  proDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    gap: windowWidth * 0.05,
    color: "white",
  },
  sendButtonGradient: {
    borderRadius: windowWidth * 0.05, // Round the button
    paddingVertical: windowHeight * 0.01,
    paddingHorizontal: windowWidth * 0.05,
  },
  sendButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowWidth * 0.05, // Ensure alignment with gradient radius
  },
  sendButtonText: {
    fontSize: windowWidth * 0.045,
    color: "white", // Text color
    fontWeight: "bold",
  },

});

export default Chat;
