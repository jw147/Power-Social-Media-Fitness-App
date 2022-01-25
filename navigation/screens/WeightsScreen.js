import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import exercises from './../../weightExercises.json';
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker'
import { render } from 'react-dom';


export default function WeightsScreen({ navigation }) {
    let bicepsArray = []
    let backArray = []
    let lowerBackArray = []
    let upperBackArray = []
    let tricepsArray = []
    let chestArray = []
    let allArray = []
    
    const t = navigation.test;
    console.log(t);
    

    
        return (
            <View>
                
            </View>
            
        )
    
}


const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        paddingTop: 0,
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
    },
    header: {
        fontSize: 18,
        paddingTop: 10,
        fontStyle: 'italic'
    },
      beginButton: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        backgroundColor: '#00c921',
        borderColor: 'black',
        borderWidth: 1,
        padding: 8,
        borderRadius: 10,
      },
})
