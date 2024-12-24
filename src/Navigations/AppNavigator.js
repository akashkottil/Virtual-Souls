import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import Login from "../Screens/Login";

// Firebase imports
import { auth } from "../Configuration/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Chat from "../Screens/Chat";
import SignUp from "../Screens/SignUp";
import ForgotPassword from "../Screens/ForgotPassword";
import Terms from "../Screens/Terms";
import Privacy from "../Screens/Privacy";
import Subscribtion from "../Screens/Subscription";
import ScheduleCallScreen from "../Screens/ScheduleCallScreen";
import ScheduleScreen from "../Screens/ScheduleScreen";
import AppointmentRequestScreen from "../Screens/AppointmentRequestScreen";

export default function AppNavigator() {
  const stack = createStackNavigator();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#010101" },
        animationEnabled: true,
      }}
    > 
      {
     
      user ? (
        <>

          <stack.Screen name="main" component={TabNavigator} />
          <stack.Screen
            name="Chat"
            component={Chat}
            options={{ title: "Chat Screen" }}
            />
          {/* <stack.Screen name="home" component={Home} /> */}
          <stack.Screen name="terms" component={Terms} />
          <stack.Screen name="book" component={ScheduleCallScreen} />
          <stack.Screen name="privacy" component={Privacy} />
          <stack.Screen name="plan" component={Subscribtion} />
          <stack.Screen name="schedule" component={ScheduleScreen} />
          <stack.Screen name="appointment" component={AppointmentRequestScreen}/>
        </>

      ) : (
        <>

          <stack.Screen name="login" component={Login} />
          <stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: "Sign Up Page" }}
          />
          <stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ title: "Forgot Password" }}
          />
        </>

      )}
    </stack.Navigator>
  );
}
