import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { Colors } from '../Constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'

const SplashScreen = () => {
  return (
    <LinearGradient
    colors={Colors.bgGradient}
    style={styles.splash}
  >
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={{ marginTop: 20, fontSize: 16, color: '#ffffff' }}>Welcome to Virtual Souls</Text>
    </LinearGradient>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    splash:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
})