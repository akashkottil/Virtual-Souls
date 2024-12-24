import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

// Import navigation components
import AppNavigator from './src/Navigations/AppNavigator';
import SplashScreen from './src/Components/SplashScreen';
import ScheduleScreen from './src/Screens/ScheduleScreen';
import AppointmentRequestScreen from './src/Screens/AppointmentRequestScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  

  

  // if (loading) {
  //   return (
  //    <SplashScreen/>
  //   );
  // }

  return (
    // <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#010101' }}>
    //   <NavigationContainer>
    //     <StatusBar style="light" backgroundColor="#010101" translucent={false} />
    //     <AppNavigator/>
    //   </NavigationContainer>
    // </GestureHandlerRootView>

    <>
    <NavigationContainer>
    <AppointmentRequestScreen/>
    </NavigationContainer>
    </>
  );
};

export default App;