import React, { Component } from "react";
import { Alert, Button, Image, Pressable, StyleSheet, View, Text, ScrollView, ImageBackground } from "react-native";

import LeaderboardScreen from './LeaderboardScreen';
import FeedScreen from './FeedScreen';
import ProfileScreen from './ProfileScreen';
import SearchScreen from './SearchScreen';
import ExerciseScreen from "./ExerciseScreen";


export default function HomeScreen({navigation}){
  
  return(
    
    <View style={styles.container}>
        <ScrollView>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Exercise')}>
            <Image
              style={styles.buttonProperties}
              source={require('../../assets/HomeScreen/exercise.png')}
            />
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => Alert.alert('Diet Page')}>
            <Image
              style={styles.buttonProperties}
              source={require('../../assets/HomeScreen/diet.png')}
            />
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => Alert.alert('Learn Page')}>
            <Image
              style={styles.buttonProperties}
              source={require('../../assets/HomeScreen/learn.png')}
            />
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => Alert.alert('Progress Page')}>
            <Image
              style={styles.buttonProperties}
              source={require('../../assets/HomeScreen/progress.png')}
            />
          </Pressable>
        </ScrollView>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  bannerProperties: {
    width: '100%',
    height: 65,
    resizeMode: 'center',
    marginBottom: 5,
  },
  button: {
    width: '85%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 5,
    backgroundColor: 'black',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  navBar: {
    height: 50,
    paddingBottom: 0,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  navBarButton: {
    width: '20%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderRightWidth: 1,
    borderTopWidth: 1,
  },
  navText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  buttonProperties: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  navBarButtonProperties: {
    width: '70%',
    height: '70%',
    resizeMode: 'center',
  },
  bannerButtonLeft: {
    width: '20%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginTop: 6,
  },
  bannerButtonRight: {
    width: '20%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 225,
    marginTop: 6,
  },
});

//export default App;
