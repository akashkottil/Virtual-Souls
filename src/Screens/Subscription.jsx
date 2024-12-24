import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image,  } from 'react-native';
import React, { useContext, useState } from 'react';
import tick from '../../assets/Icons/tick.png';
import { LinearGradient } from 'expo-linear-gradient';
import FirstPlan from '../Components/Plans/FirstPlan';
import SecondPlan from '../Components/Plans/SecondPlan';
import ThirdPlan from '../Components/Plans/ThirdPlan';
import CloseIcon from 'react-native-vector-icons/Ionicons';
import { windowHeight, windowWidth } from '../Constants/Dimensions';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from '../Constants/Colors';
import MaskedView from '@react-native-masked-view/masked-view';

const Subscribtion = () => {
  // State for managing the selected plan
  const [selectedPlan, setSelectedPlan] = useState(1);


  // Function to change the selected plan
  const handleSelectPlan = (index) => {
    setSelectedPlan(index);
  };

  // Navigation to back

  const navigation = useNavigation();

   const closeBtn=()=>{
      navigation.goBack()
   }

  // Details for each plan
  const planDetails = [
    {
      duration: "12 Months",
      cost: "Annual renewal 7999.00/Year",
    },
    {
      duration: "6 Months",
      cost: "Monthly renewal 999.00/Month",
      tag: "Recommended"
    },
    {
      duration: "3 Months",
      cost: "Monthly renewal 1599.00/Month",
    },
  ];

  return (
    <LinearGradient
    colors={['#4A0494', 'black']}
    style={styles.blackShade}
    start={{ x: 0, y: 0.1 }}
    end={{ x: 0, y: 1 }}
    >
          <ScrollView showsVerticalScrollIndicator={false}>
    <View style={[styles.container, ]}>

      {/* Content section where plan features are displayed */}
      <View style={styles.content}>
        {/* <TouchableOpacity style={styles.topBar} onPress={closeBtn} activeOpacity={1}>
          <CloseIcon name="close" size={windowWidth * 0.08} style={styles.closeImg}  />
        </TouchableOpacity> */}
        
          <View style={styles.planFeatures}>
            <Text style={[styles.headingText, ]}>Level up Your moments</Text>
            
            {selectedPlan === 0 && <FirstPlan />}
            {selectedPlan === 1 && <SecondPlan />}
            {selectedPlan === 2 && <ThirdPlan />}
          </View>

      </View>

      {/* Bottom section for plan selection */}
      <View style={[styles.plans,]}>
        {planDetails.map((plan, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelectPlan(index)}
            style={[styles.plan, ]}
          >
            {plan.tag && (
              <LinearGradient style={[styles.recommended, ]} colors={Colors.chatGradient}>
                <Text style={[styles.Tagtext, ]}>{plan.tag}</Text>
              </LinearGradient>
            )}
            <View style={styles.planContent}>
              <View style={styles.top}>
                <View style={styles.left}>
                  <View style={[
                    styles.selected,
                    { backgroundColor: selectedPlan === index ? '#522FDC' : 'transparent', borderWidth: selectedPlan === index ? 0 : 2 }
                  ]}>
                    {selectedPlan === index && <Image source={tick} style={styles.tick} />}
                  </View>
                  <Text style={[styles.text, ]}>{plan.duration}</Text>
                </View>
              </View>
              <View style={styles.bottom}>
                <Text style={[styles.text, ]}>{plan.cost}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    </ScrollView>
    </LinearGradient>
  );
};

export default Subscribtion;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignSelf: "stretch",
  },
  content: {
    flex: 1,
    position: "relative",
  },
  plan: {
    height: windowHeight * 0.12,
    borderRadius: windowWidth * 0.04,
    justifyContent: 'center',
    borderWidth: 2,
    elevation: 16,
    position: "relative",
    backgroundColor:"white"
  },
  plans: {
    flex: 1,
    borderTopStartRadius: windowWidth * 0.1,
    borderTopRightRadius: windowWidth * 0.1,
    paddingHorizontal: windowWidth * 0.08,
    // paddingVertical: windowHeight * 0.02,
    gap: 10,
    justifyContent: "center",
    elevation: 80,
  },
  selected: {
    height: windowWidth * 0.05,
    width: windowWidth * 0.05,
    borderRadius: windowWidth * 0.1,
    borderColor: 'blue',
    alignItems: "center",
    justifyContent: "center",
  },
  left: {
    flexDirection: "row",
    gap: windowWidth * 0.08,
    alignItems: 'center',
  },
  planContent: {
    paddingHorizontal: windowWidth * 0.06,
    paddingVertical: windowHeight * 0.02,
    flex: 1,
    justifyContent: "space-between",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottom: {
    alignItems: "flex-start",
  },
  recommended: {
    zIndex: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: "absolute",
    top: -2,
    right: -2,
    borderBottomLeftRadius: windowWidth*0.05,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: windowWidth*0.04,
    
},
Tagtext:{
  color:"white",
  fontSize: windowWidth * 0.04,
    fontWeight: "600",
    fontFamily:'PowerGrotesk-Regular',
},
  tick: {
    height: windowWidth * 0.05,
    width: windowWidth * 0.05,
  },
  text: {
    fontSize: windowWidth * 0.04,
    fontWeight: "800",
    fontFamily:'PowerGrotesk-Regular',
    color:"black"
  },
  topBar: {
    alignItems: "center",
    justifyContent: "center",
    height: windowWidth * 0.1,
    width: windowWidth * 0.1,
    zIndex: 10,
    position: "absolute",
  },
  // blackShade: {
  //   height: "100%",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  planFeatures: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 10,
    height:windowHeight*0.5,
    marginVertical:windowHeight*0.1
  },
  headingText: {
    fontSize: windowWidth * 0.07,
    fontWeight: "800",
    fontFamily:'PowerGrotesk-Regular',
    color:Colors.white
  },
});