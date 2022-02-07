import * as React from 'react';

import { NavigationContainer, StackActions, TabActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome';


import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useNavigation } from '@react-navigation/core'
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';

import LeaderboardScreen from './screens/LeaderboardScreen';
import HomeScreen from './screens/HomeScreen';
import FeedScreen from './screens/FeedScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import SetProfileScreen from './screens/SetProfile';
import EditProfileScreen from './screens/EditProfileScreen';
import ProgressScreen from './screens/ProgressScreen';


const homeName = 'Home';
const leaderboardName = 'Leaderboard';
const feedName = 'Feed';
const profileName = 'Profile';
const searchName = 'Search';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function HomeScreens() {
    return(
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false}} name={"Home Screen"} component={HomeScreen}/>
            <Stack.Screen options={{headerTintColor: "white", headerStyle: {backgroundColor: '#00a1d0'}}} name="Exercise" component={ExerciseScreen}/>
            <Stack.Screen options={{headerTintColor: "white", headerStyle: {backgroundColor: '#00a1d0'}}} name="Progress" component={ProgressScreen}/>
        </Stack.Navigator>
    )
}

function ProfileScreens() {
    return(
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false}} name={"Profile Screen"} component={ProfileScreen}/>
            <Stack.Screen name="Configure Profile" component={SetProfileScreen}/>
            <Stack.Screen name="Edit Profile" component={EditProfileScreen}/>
        </Stack.Navigator>
    )
}

export default function MainContainer(){
    return(
        <NavigationContainer
        independent={true}>
            <Tab.Navigator
            initialRouteName={homeName}
            
            screenOptions={({route}) =>({
                headerShown: false,
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline'
                        return <Ionicons name={iconName} size={size} color={color}/>
                    } else if (rn === searchName){
                        iconName = focused ? 'search' : 'search-outline'
                        return <Ionicons name={iconName} size={size} color={color}/>
                    }else if (rn === feedName){
                        iconName = focused ? 'newspaper-o' : 'newspaper-o'
                        return <Icon name={iconName} size={size} color={color}/>
                    }else if (rn === leaderboardName){
                        iconName = focused ? 'podium' : 'podium-outline'
                        return <Ionicons name={iconName} size={size} color={color}/>
                    }else if (rn === profileName){
                        iconName = focused ? 'person' : 'person-outline'
                        return <Ionicons name={iconName} size={size} color={color}/>
                    }
                },
            })}>
                <Tab.Screen name={homeName} component={HomeScreens}/>
                <Tab.Screen name={searchName} component={SearchScreen}/>
                <Tab.Screen name={feedName} component={FeedScreen}/>
                <Tab.Screen name={leaderboardName} component={LeaderboardScreen}/>
                <Tab.Screen name={profileName} component={ProfileScreens}/>
            </Tab.Navigator>

        </NavigationContainer>
    );
}