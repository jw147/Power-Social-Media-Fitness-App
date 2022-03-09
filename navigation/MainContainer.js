import * as React from 'react';
import { StyleSheet, Text, View, Button, Pressable, Image } from 'react-native';
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
import ViewProfileScreen from './screens/ViewProfileScreen';
import DietScreen from './screens/DietScreen';


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
            <Stack.Screen options={{headerTintColor: "white", headerStyle: {backgroundColor: '#00a1d0'}}} name="Diet" component={DietScreen}/>
        </Stack.Navigator>
    )
}

function SearchScreens() {
    return(
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false}} name={"Search Screen"} component={SearchScreen}/>
            <Stack.Screen options={{headerTintColor: "white", headerStyle: {backgroundColor: '#00a1d0'}}} name="View Profile" component={ViewProfileScreen}/>
            <Stack.Screen options={{ headerShown: false}} name={"Profile Screen"} component={ProfileScreen}/>
        </Stack.Navigator>
    )
}

function ProfileScreens() {
    return(
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false}} name={"Profile Screen"} component={ProfileScreen}/>
            <Stack.Screen name="Configure Profile" component={SetProfileScreen}/>
            <Stack.Screen name="Edit Profile" component={EditProfileScreen}/>
            <Stack.Screen options={{headerTintColor: "white", headerStyle: {backgroundColor: '#00a1d0'}}} name="View Profile" component={ViewProfileScreen}/>
        </Stack.Navigator>
    )
}

export default function MainContainer({navigation}){

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable style={styles.message} onPress={()=> navigation.navigate("Messages")}>
                    <Image style={{ width: 40, height: 30 }} source={require("../assets/message.png")}></Image>
                </Pressable>
            )
        })
    })
    const [refresh, setRefresh] = React.useState("");
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
                <Tab.Screen name={homeName} component={HomeScreens} options={{ unmountOnBlur: true }} listeners={({ navigation }) => ({
                    blur: () => navigation.setParams({ screen: undefined }),
                })} />
                <Tab.Screen name={searchName} component={SearchScreens} options={{ unmountOnBlur: true }} listeners={({ navigation }) => ({
                    blur: () => navigation.setParams({ screen: undefined }),
                })} />
                <Tab.Screen name={feedName} component={FeedScreen} options={{ unmountOnBlur: true }} listeners={({ navigation }) => ({
                    blur: () => navigation.setParams({ screen: undefined }),
                })} />
                <Tab.Screen name={leaderboardName} component={LeaderboardScreen} options={{ unmountOnBlur: true }} listeners={({ navigation }) => ({
                    blur: () => navigation.setParams({ screen: undefined }),
                })} />
                <Tab.Screen name={profileName} component={ProfileScreens} options={{ unmountOnBlur: true }} listeners={({ navigation }) => ({
                    blur: () => navigation.setParams({ screen: undefined }),
                })} />
            </Tab.Navigator>

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