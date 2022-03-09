import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Pressable, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './navigation/screens/LoginScreen';
import MainContainer from './navigation/MainContainer';
import SetProfile from './navigation/screens/SetProfile';
import MessageScreen from './navigation/screens/MessageScreen';
import MessageContainer from './navigation/MessageContainer';
import cacheAssests from './casheAssets';

const Stack = createNativeStackNavigator(); 

const Tab = createBottomTabNavigator();

export default function App() {

  const [assetsLoading, setAssetsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await cacheAssests({
          images: [
            require('./assets/HomeScreen/diet.png'),
            require('./assets/HomeScreen/exercise.png'),
            require('./assets/HomeScreen/progress.png'),
            require('./assets/Rewards/500kcal.png'),
            require('./assets/Rewards/1Kkcal.png'),
            require('./assets/Rewards/2Kkcal.png'),
            require('./assets/Rewards/3halfKkcal.png'),
            require('./assets/Rewards/5Kkcal.png'),
            require('./assets/Rewards/7Kkcal.png'),
            require('./assets/Rewards/10Kkcal.png'),
            require('./assets/Rewards/1ton.png'),
            require('./assets/Rewards/2tons.png'),
            require('./assets/Rewards/10tons.png'),
            require('./assets/Rewards/20tons.png'),
            require('./assets/Rewards/50tons.png'),
            require('./assets/Rewards/2km.png'),
            require('./assets/Rewards/5km.png'),
            require('./assets/Rewards/10km.png'),
            require('./assets/Rewards/15km.png'),
            require('./assets/Rewards/20km.png'),
            require('./assets/Rewards/30km.png'),
            require('./assets/addFriend.png'),
            require('./assets/addimage.png'),
            require('./assets/BENCH.png'),
            require('./assets/burn.png'),
            require('./assets/cardio.png'),
            require('./assets/createMessage.png'),
            require('./assets/cycle.png'),
            require('./assets/DEADLIFT.png'),
            require('./assets/deleteFriend.png'),
            require('./assets/first.png'),
            require('./assets/message.png'),
            require('./assets/optionsbutton.png'),
            require('./assets/profiledefault.png'),
            require('./assets/run.png'),
            require('./assets/second.png'),
            require('./assets/splash.png'),
            require('./assets/SQUAT.png'),
            require('./assets/third.png'),
            require('./assets/walk.png'),
            require('./assets/weights.png'),
            // all ur other assets here
          ],
          fonts: [{
            //MontserratBold: require('./assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
            // all ur other fonts here
          }]
        })
      } catch (error) {
        console.log('Error caching assets, please try again. ' + error);
      } finally {
        setAssetsLoading(false);
      }
    }
    loadAssets().then(()=>setAssetsLoading(false))
  }, [assetsLoading]);


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen name="strength in numbers" options={{headerTintColor: "white", headerStyle: {backgroundColor: '#00a1d0'}}}  component={MainContainer} />
        <Stack.Screen name="Messages" options={{headerTintColor: "white", headerStyle: {backgroundColor: '#00a1d0'}}} component={MessageContainer}/>
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
