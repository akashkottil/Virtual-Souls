import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Import your screens
import Home from '../Screens/Home';
import Profile from '../Screens/Profile';
import ScheduleCallScreen from '../Screens/ScheduleCallScreen';


const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
    const activeTab = useSharedValue(0);
    const tabWidth = Platform.OS === 'ios' ? 210 : 200;

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: withSpring(activeTab.value * tabWidth, { damping: 15, stiffness: 150 }) },
            ],
        };
    });

    return (
        <View style={styles.tabBar}>
            <Animated.View style={[styles.animatedBackgroundWrapper, animatedStyle]}>
                <LinearGradient
                    colors={['#B21BF0', '#C40B42']}
                    style={styles.gradientBorder}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={styles.innerTab}>
                        {/* Content inside the border */}
                    </View>
                </LinearGradient>
            </Animated.View>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const label = descriptors[route.key].options.tabBarLabel ?? route.name;

                const labelStyle = useAnimatedStyle(() => ({
                    transform: [
                        { scale: withSpring(isFocused ? 1.2 : 1, { damping: 15, stiffness: 150 }) },
                    ],
                    opacity: withSpring(isFocused ? 1 : 0.5, { damping: 15, stiffness: 150 }),
                }));

                const onPress = () => {
                    if (!isFocused) {
                        activeTab.value = index;
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableWithoutFeedback key={index} onPress={onPress}>
                        <Animated.View style={[styles.tabItem]}>
                            {isFocused ? (
                                <Animated.Text style={[styles.tabLabel, labelStyle]}>
                                    {label}
                                </Animated.Text>
                            ) : (
                                <Ionicons
                                    name={route.name === 'Home' ? 'home-outline' : 'person-outline'}
                                    size={24}
                                    color="#ffffff"
                                />
                            )}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                );
            })}
        </View>
    );
}

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false, tabBarStyle: {
                backgroundColor: '#010101', // Matches your desired tab bar color
                borderTopColor: '#010101', // Optional: Matches the background
              }, }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 65,
        backgroundColor: "#010101",
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#010101',
        position: 'relative',
        elevation: 10,
        marginBottom: Platform.OS === "ios" ? 20 : 0,
    },
    animatedBackgroundWrapper: {
        position: 'absolute',
        height: 40,
        width: 94,
        top: 12,
        borderRadius: 20,
    },
    gradientBorder: {
        flex: 1,
        borderRadius: 20,
        padding: 2, // This creates the border effect
    },
    innerTab: {
        flex: 1,
        backgroundColor: '#010101',
        borderRadius: 18, // Slightly smaller than parent to show gradient border
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
});
