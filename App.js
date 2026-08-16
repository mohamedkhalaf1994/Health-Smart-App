import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Home from './screens/Home';
import ActivityTracker from './screens/ActivityTracker';
import FoodAnalyzer from './screens/FoodAnalyzer';
import Profile from './screens/Profile';
import HeartRate from './screens/HeartRate';
import HealthCalculator from './screens/HealthCalculator';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'ActivityTracker') {
              iconName = focused ? 'fitness' : 'fitness-outline';
            } else if (route.name === 'FoodAnalyzer') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'HeartRate') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'HealthCalculator') {
              iconName = focused ? 'calculator' : 'calculator-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato', 
          tabBarInactiveTintColor: 'gray',
        })}>

          {/* تعديل الـ name بدون مسافات لتتطابق مع navigation.navigate */}
          <Tab.Screen name="Home" component={Home} options={{ title: 'Home' }} />
          <Tab.Screen name="ActivityTracker" component={ActivityTracker} options={{ title: 'Activity Tracker' }} />
          <Tab.Screen name="FoodAnalyzer" component={FoodAnalyzer} options={{ title: 'Food Analyzer' }} />
          <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
          <Tab.Screen name="HeartRate" component={HeartRate} options={{ title: 'Heart Rate' }} />
          <Tab.Screen name="HealthCalculator" component={HealthCalculator} options={{ title: 'Health Calculator' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}