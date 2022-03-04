import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'

import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import { ScrollView } from 'react-native-gesture-handler';




const UsernameTextInput = (props) => {
    return (
      <TextInput
        {...props}
        editable
        maxLength={16}
      />
    );
  }

const DisplayNameTextInput = (props) => {
    return (
        <TextInput
            {...props}
            editable
            maxLength={16}
        />
    );
}

const BioTextInput = (props) => {
    return (
        <TextInput
            {...props}
            editable
            maxLength={100}
        />
    );
}




export default function SetProfile({navigation}){

    const currentUser = firebase.auth().currentUser;

    const [usernameInput, setUsername] = React.useState('');
    const [displaynameInput, setDisplayname] = React.useState('');
    const [bioInput, setBio] = React.useState('');
    const [weightInput, setWeight] = React.useState('');
    const [goalsInput, setGoals] = React.useState('');
    const [ageInput, setAge] = React.useState('');
    const [genderInput, setGender] = React.useState('');

    var Email;

    function getUserEmail(documentSnapshot) {
        return documentSnapshot.get('email');
      }    
    
    const userInfo = firebase.firestore().collection('users').doc(currentUser.uid).get()
        .then(
            documentSnapshot => getUserEmail(documentSnapshot))
        .then(email => {
            Email = email;
        });

    const updateDatabase = () => {
        if(usernameInput === '' || displaynameInput === '' || weightInput === '' || ageInput === '' || genderInput === '' || goalsInput === ''){
            alert("Please enter your details");
        }else{
            firebase.firestore()
                .collection('users')
                .doc(currentUser.uid)
                .set({
                    username: usernameInput,
                    displayname: displaynameInput,
                    email: Email,
                    bio: bioInput,
                    age: ageInput,
                    gender: genderInput,
                    weight: weightInput,
                    goals: goalsInput
                })
                .then(() => {
                    console.log('User Info Updated');
                    navigation.replace("Profile Screen");
                })
        }
        
    }

    return (
        <KeyboardAvoidingView
        style={styles.container}
            behavior="padding"
        >
            <ScrollView style={styles.container}>
                    <Text style={styles.description}>Please enter the following details to create your User Profile</Text>
                    <Text style={styles.textTitle}>Username</Text>
                    <UsernameTextInput
                        onChangeText={text => setUsername(text)}
                        value={usernameInput}
                        style={styles.textInput}
                        placeholder="Enter Your Unique Username"
                    />
                    <Text style={styles.textTitle}>Full Name</Text>
                    <DisplayNameTextInput
                        onChangeText={text => setDisplayname(text)}
                        value={displaynameInput}
                        style={styles.textInput}
                        placeholder="Enter Your Full Name"
                    />
                    <Text style={styles.textTitle}>Biography (optional)</Text>
                    <BioTextInput
                        onChangeText={text => setBio(text)}
                        value={bioInput}
                        style={styles.textInput}
                        placeholder="Enter a Bio"
                    />
                    <Text style={styles.description}>The following information will not be displayed with anyone. This data is used for in-app calculations and the study</Text>
                    <Text style={styles.textTitle}>Current Weight (kg)</Text>
                    <TextInput
                        onChangeText={text => setWeight(text)}
                        value={weightInput}
                        style={styles.textInput}
                        placeholder="Enter Your Current Weight"
                    />
                    <Text style={styles.textTitle}>Frequency of Physical Activity Before Study</Text>
                    <TextInput
                        onChangeText={text => setGoals(text)}
                        value={goalsInput}
                        style={styles.textInput}
                        placeholder="E.g. once a week, twice a week, etc."
                    />
                    <Text style={styles.textTitle}>Age</Text>
                    <TextInput
                        onChangeText={text => setAge(text)}
                        value={ageInput}
                        style={styles.textInput}
                        placeholder="Enter Your Age"
                    />
                    <Text style={styles.textTitle}>Gender</Text>
                    <TextInput
                        onChangeText={text => setGender(text)}
                        value={genderInput}
                        style={styles.textInput}
                        placeholder="Enter Your Gender"
                    />
                    <TouchableOpacity
                            onPress={updateDatabase}
                            style={styles.buttonContainer}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
            </ScrollView>
                        
        </KeyboardAvoidingView>
        
    )
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
      },
    description: {
        paddingTop: 10,
        fontSize: 17,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    textTitle: {
        paddingLeft: 10,
        paddingTop: 15,
        fontSize: 17,
        fontWeight: 'bold',
    },
    textInput: {
        padding: 10,
        fontSize: 15,
        borderColor: 'black',
        borderWidth: 1,
        width: '95%',
        alignSelf: 'center'
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#0782F9',
        padding: 15,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 200
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
