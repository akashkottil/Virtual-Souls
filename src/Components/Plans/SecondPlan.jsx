import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { windowHeight, windowWidth } from '../../Constants/Dimensions';

// Import icons
import greentick from '../../../assets/Icons/greentick.png';
import closetick from '../../../assets/Icons/redclose.png';
import { Colors } from '../../Constants/Colors';

// Define SecondPlan component
const SecondPlan = () => {


    // Define features for the second plan
    const secondPlan = [
        { text: "second feature", img: greentick, id: 21 },
        { text: "second plan second feature", img: greentick, id: 22 },
        { text: "second plan third feature", img: greentick, id: 23 },
        { text: "second plan fourth feature", img: greentick, id: 24 },
        { text: "second plan fifth feature", img: greentick, id: 25 },
        { text: "sixth feature", img: closetick, id: 26 },
        { text: "seventh feature", img: closetick, id: 27 }
    ];

    return (
        <ScrollView style={styles.contentView} showsVerticalScrollIndicator={false}>
            {secondPlan.map((item) => (
                <View key={item.id} style={styles.content}>
                    <Text style={[styles.text,]}>{item.text}</Text>
                    <Image source={item.img} style={styles.icon} />
                </View>
            ))}
        </ScrollView>
    );
};

export default SecondPlan;

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
        fontFamily: 'PowerGrotesk-Regular',
        color:Colors.white
    },
    contentView: {
        height: "60%",
        alignSelf: "stretch",
        paddingVertical: windowHeight * 0.02,
        paddingHorizontal: windowWidth * 0.1
    }
});
