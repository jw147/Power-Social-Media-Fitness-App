import React from 'react'
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
        if(usernameInput === '' || displaynameInput === ''){
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
            <View style={styles.container}>
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
                    <TouchableOpacity
                            onPress={updateDatabase}
                            style={styles.buttonContainer}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
            </View>
                        
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
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
