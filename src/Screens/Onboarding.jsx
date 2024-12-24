import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Text, Image, TouchableOpacity } from "react-native";
import DotComponent from "../Components/DotComponent";
import { windowWidth } from "../Constants/Dimensions";

const DoneButton = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontSize: 16 }}>Done</Text>
  </TouchableOpacity>
);

const CustomButton = ({ label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: '#007BFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginHorizontal:windowWidth*0.06,
    }}
  >
    <Text style={{ color: '#fff', fontSize: 16 }}>{label}</Text>
  </TouchableOpacity>
);

const OnboardingScreen = ({ navigation, route }) => {
  const { onComplete } = route.params;

  const handleOnboardingDone = async () => {
    if (onComplete) {
      await onComplete(); // Mark onboarding as complete
    }
    navigation.replace("SignUp");
  };

  return (
    <Onboarding
      onSkip={handleOnboardingDone}
      onDone={handleOnboardingDone}
      DotComponent={DotComponent}
      DoneButtonComponent={(props) => <CustomButton label="Done" {...props} />}
      NextButtonComponent={(props) => <CustomButton label="Next" {...props} />}
      SkipButtonComponent={(props) => <CustomButton label="Skip" {...props} />}
      pages={[
        {
          backgroundColor: "#fff",
          image: <Image source={require("../../assets/ProfilePics/pic1.png")} />,
          title: "Welcome",
          subtitle: "Welcome to our app!",
        },
        {
          backgroundColor: "#fdeb93",
          image: <Image source={require("../../assets/ProfilePics/pic2.png")} />,
          title: "Stay Connected",
          subtitle: "Connect with your friends easily.",
        },
        {
          backgroundColor: "#e9bcbe",
          image: <Image source={require("../../assets/ProfilePics/pic3.png")} />,
          title: "Get Started",
          subtitle: "Let’s get started!",
        },
       
      ]}
    />
  );
};


export default OnboardingScreen;
