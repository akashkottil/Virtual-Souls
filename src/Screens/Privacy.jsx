import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { windowHeight, windowWidth } from '../Constants/Dimensions'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../Constants/Colors'


const termsData = [
  {
    heading: "Introduction",
    paragraph: "Welcome to Virtual Souls. Your privacy is important to us.This Privacy Policy explains how we collect, use, disclose, and safeguard yourinformation when you visit our website."
  },

  {
    heading: "Information Collection and Use",
    paragraph: "We collect various types of information for various purposes to provide and improve our service to you.",
    points: [
      'Personal Data: While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to, email address, first name and last name, phone number, and usage data.',
      'Usage Data: We may also collect information on how the service is accessed and used ("Usage Data"). This Usage Data may include information such as your computers IP address, browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.'
    ]
  },
  {
    heading: "Cookies",
    paragraph: "We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your computer."
  },
  {
    heading: "Disclosure of Data",
    paragraph: "We may disclose your personal information in the good faith belief that such action is necessary to:",
    points: ['Comply with a legal obligation', 'Protect and defend the rights or property of Virtual Souls', 'Prevent or investigate possible wrongdoing in connection with the service', 'Protect the personal safety of users of the service or the public', 'Protect against legal liability']
  },
  {
    heading: "Data Retention",
    paragraph: "We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy."
  },
  {
    heading: "Changes to This Privacy Policy",
    paragraph: "We may update our Privacy Policy from time to time. We willnotify you of any changes by posting the new Privacy Policy on this page."
  },
  {
    heading: "Governing Law",
    paragraph: "This Privacy Policy shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions."
  },
  {
    heading: "Contact Us",
    paragraph: "If you have any questions about this Privacy Policy, please contact us at info@virtualsouls.io"
  },
]

const Privacy = () => {

  const navigation = useNavigation();

  const closeBtn = () => {
    navigation.goBack();
  }

  const styles = StyleSheet.create({
    banner: {},
    bannerImg: {},
    container: {
      flex: 1,
      paddingHorizontal: windowWidth * 0.08,
      gap: windowWidth * 0.04,
      paddingVertical: windowHeight*0.1,
      paddingBottom: windowWidth * 0.2
    },
    contentWrapper: {
  
    },
    heading: {
      fontSize: windowWidth * 0.045,
      fontFamily: 'PowerGrotesk-Regular',
      color:Colors.white
    },
    paragraph: {
      fontSize: windowWidth * 0.04,
      fontFamily: 'PowerGrotesk-Regular',
      color:Colors.white
    },
    title: {
      fontSize: windowWidth * 0.07,
      justifyContent: "center",
      fontWeight: "600",
      alignItems: "center",
      fontFamily: 'PowerGrotesk-Regular',
      color:Colors.white,
      
    },
    termsCard: {
  
    },
    termsWrapper: {
      gap: windowWidth * 0.04
    },

    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    bulletPoint: {
      width: 10,
      textAlign: 'center',
      color:Colors.white
    },
    itemText: {
      fontSize: windowWidth * 0.04,
      flex: 1,
      paddingLeft: 10,
      fontFamily: 'PowerGrotesk-Regular',
      color:Colors.white
    },
  });

  return (
    <LinearGradient
      colors={Colors.bgGradient}
      style={styles.gradient}
    >
    <ScrollView >
      
      <View style={[styles.container, ]}>
        <Text style={[styles.title, ]}>Privacy Policy for
          Virtual Souls</Text>
        <View styles={styles.contentWrapper}>
          <View style={styles.termsWrapper}>
            {
              termsData.map((data, index) => (
                <View style={styles.termsCard} key={`terms-${index}`}>
                  <Text style={[styles.heading]}>
                    {data.heading}
                  </Text>
                  <Text style={[styles.paragraph]}>
                    {data.paragraph}
                  </Text>
                  {data.points && data.points.map((point, pointIndex) => (
                    <View style={styles.listItem} key={`point-${index}-${pointIndex}`}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.itemText}>{point}</Text>
                    </View>
                  ))}
                </View>
              ))
              
            }
          </View>

        </View>
      </View>
    </ScrollView>    
    </LinearGradient>

  )
}

export default Privacy

