import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { windowWidth, windowHeight } from '../../Constants/Dimensions';

// Import icons
import greentick from '../../../assets/Icons/greentick.png';
import closetick from '../../../assets/Icons/redclose.png';
import { Colors } from '../../Constants/Colors';


// Define FirstPlan component
const FirstPlan = () => {

    // Define features for the first plan
    const firstPlan = [
        { text: "first feature", img: greentick, id: 11 },
        { text: "second feature", img: greentick, id: 12 },
        { text: "third feature", img: greentick, id: 13 },
        { text: "fourth feature", img: closetick, id: 14 },
        { text: "fifth feature", img: closetick, id: 15 },
        { text: "sixth feature", img: closetick, id: 16 },
        { text: "seventh feature", img: closetick, id: 17 }
    ];

    return (
        <ScrollView style={styles.contentView} showsVerticalScrollIndicator={false}>
            {firstPlan.map((item) => (
                <View key={item.id} style={styles.content}>
                    <Text style={[styles.text, ]}>{item.text}</Text>
                    <Image source={item.img} style={styles.icon} />
                </View>
            ))}
        </ScrollView>
    );
};

export default FirstPlan;

// Define styles for the component
const styles = StyleSheet.create({
    content: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: windowWidth * 0.03,
        justifyContent: "space-between"
    },
    icon: {
        height: windowHeight * 0.04,
        width: windowWidth * 0.07
    },
    text: {
        fontSize: windowWidth * 0.06,
        fontWeight: "600",
        fontFamily:'PowerGrotesk-Regular',
        color:Colors.white
    },
    contentView: {
        height: "60%",
        alignSelf: "stretch",
        paddingVertical: windowHeight * 0.02,
        paddingHorizontal: windowWidth * 0.1
    }
});
