import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import MessageScreen from './screens/MessageScreen';
import ChatScreen from './screens/ChatScreen';
import ExistingChatScreen from './screens/ExistingChatScreen';

const Stack = createStackNavigator();

export default function MessageContainer({navigation}){
return(
    <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false}} name={"MessageContainer"} component={MessageScreen}/>
            <Stack.Screen options={{headerTintColor: "white", headerStyle: {backgroundColor: '#00a1d0'}}} name={"New Chat"} component={ChatScreen}/>
            <Stack.Screen options={{headerTintColor: "white", headerStyle: {backgroundColor: '#00a1d0'}}} name={"Chat"} component={ExistingChatScreen}/>
        </Stack.Navigator>
)
}

const styles = StyleSheet.create({})