import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Pressable, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './navigation/screens/LoginScreen';
import MainContainer from './navigation/MainContainer';
import SetProfile from './navigation/screens/SetProfile';
import MessageScreen from './navigation/screens/MessageScreen';
import MessageContainer from './navigation/MessageContainer';

const Stack = createNativeStackNavigator(); 

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen name="strength in numbers"  component={MainContainer} />
        <Stack.Screen name="Messages" component={MessageContainer}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginLeft: 'auto',
    marginTop: 0
  }
});
