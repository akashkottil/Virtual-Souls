import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Colors } from "../Constants/Colors";
import { windowWidth } from "../Constants/Dimensions";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../Configuration/firebase';

import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // const GoogleSignInScreen = () => {
  // const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: "758232109197-djj2a87eglkbu2een1jdcdp4550o3fst.apps.googleusercontent.com",
    iosClientId: "758232109197-h1tv7lqoo3j6n5f7sj96hp0n4hs8q8cc.apps.googleusercontent.com",
    include_granted_scopes: true,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      // console.log("Google Sign-In successful. ID Token:", id_token); // Debug Log
      handleFirebaseSignIn(id_token);
    } else {
      // console.log("Google Sign-In response:", response); 
    }
  }, [response]);

  const handleFirebaseSignIn = async (idToken) => {
    try {
      // console.log("Signing in to Firebase..."); // Debug Log
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      // console.log("Firebase Sign-In successful. User:", userCredential); 
      const user = userCredential.user;
      // console.log('user details :', user.displayName, " | ", user.photoURL, " | ", user.email, " | ", user.uid);

      const userRef = doc(db, 'users', user.uid);
      // Check if user already exists
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Save user data only if they don't exist
        await setDoc(userRef, {
          username: user.displayName || '',
          email: user.email,
          photoURL: user.photoURL || '',
          uid: user.uid,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        });
      } else { 
        // Update last login time for existing users
        await setDoc(userRef, {
          lastLoginAt: new Date().toISOString()
        }, { merge: true });
      }



    } catch (error) {
      console.error("Firebase Sign-In error:", error); // Debug Log
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    let valid = true;

    // Validate email
    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // await setDoc(userRef, {
      //   lastLoginAt: new Date().toISOString()
      // }, { merge: true });

      // console.log("Logged in:", userCredential.user.email);
    } catch (error) {
      console.error("Error logging in:", error.message);
      setEmailError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/splashIcon.png")} // Replace with your logo
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.gradientButton, loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        <LinearGradient
          colors={Colors.innerInputGradient}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.googleButton, loading && styles.disabledButton]}
        onPress={() => {
          promptAsync();
        }}
        disabled={!request}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.googleButtonContent}>
            <Image
              source={require("../../assets/Icons/google.png")} // Path to your Google icon
              style={styles.googleIcon}
            />
            <Text style={styles.buttonText}>Sign In with Google</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          disabled={loading}
        >
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          disabled={loading}
        >
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.inputBg,
    paddingHorizontal: windowWidth * 0.13,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: windowWidth * 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: "#170617",
    borderWidth: 2,
    borderRadius: windowWidth * 0.02,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  googleButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#DB4437",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#DB4437",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  link: {
    color: "#007AFF",
    fontSize: 14,
    textDecorationLine: "none",
  },
  gradientButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Login;
