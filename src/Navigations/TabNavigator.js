import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import Home from '../Screens/Home';
import Profile from '../Screens/Profile';
import AppointmentRequestScreen from '../Screens/AppointmentRequestScreen';
import ScheduleCallScreen from '../Screens/ScheduleCallScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const getTabIcon = (routeName) => {
  switch (routeName) {
    case 'Home':
      return 'home-outline';
    case 'Profile':
      return 'person-outline';
    case 'appointment':
      return 'calendar-outline';
    default:
      return 'apps-outline';
  }
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={[
                styles.tabItem,
                { width: width / state.routes.length - 40 }
              ]}
            >
              {isFocused ? (
                <LinearGradient
                  colors={['#9B3EC1', '#BF2754']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.activeTab}
                >
                  <View style={styles.innerTab}>
                    <Text style={[styles.tabText, styles.activeText]}>
                      {label}
                    </Text>
                  </View>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveTab}>
                  <Ionicons 
                    name={getTabIcon(route.name)} 
                    size={24} 
                    color="#ffffff" 
                    style={styles.tabIcon}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarLabel: 'Home'
        }}
      />
        <Tab.Screen 
          name="appointment" 
          component={AppointmentRequestScreen}
          options={{
            tabBarLabel: 'schedules'
          }}
        />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarLabel: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 5,
    left: 20,
    right: 20,
    elevation: 0,
    height: 70,
    backgroundColor: '#010101',
    borderRadius: 25,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderRadius: 20,
    padding: 2,
  },
  innerTab: {
    backgroundColor: '#010101',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    minWidth: 90,
  },
  inactiveTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#010101',
  },
  tabText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    numberOfLines: 1,
  },
  activeText: {
    opacity: 1,
    fontWeight: '600',
  },
  tabIcon: {
    opacity: 0.7,
  }
});
