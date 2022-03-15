import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native'

import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { set } from 'firebase/database';
import LottieView from 'lottie-react-native';
import {getAuth, signOut} from "firebase/auth";
import * as SecureStore from 'expo-secure-store';



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

    const [usernameInput, setUsername] = useState('');
    const [displaynameInput, setDisplayname] = useState('');
    const [bioInput, setBio] = useState('');
    const [weightInput, setWeight] = useState('');
    const [goalsInput, setGoals] = useState('');
    const [ageInput, setAge] = useState('');
    const [genderInput, setGender] = useState('');
    const [email, setEmail] = useState('')
    const [friends, setFriends] = useState([])
    const [inbox, setInbox] = useState([])

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

    const [loading, setLoading] = useState(true)    
    useEffect(()=>{
        const getDatabase = async () => {
            await firebase.firestore()
            .collection('users').get()
            .then(docs=>{
                docs.forEach(doc=>{
                    if(doc.id === currentUser.uid){
                        setAge(doc.data().age)
                        setBio(doc.data().bio)
                        setDisplayname(doc.data().displayname)
                        setEmail(doc.data().email)
                        setFriends(doc.data().friends)
                        setGender(doc.data().gender)
                        setGoals(doc.data().goals)
                        setInbox(doc.data().inbox)
                        setUsername(doc.data().username)
                        setWeight(doc.data().weight)
                    }
                })
            })
        }
        getDatabase().then(()=>setLoading(false))
    }, [loading]);
    

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
                    email: email,
                    bio: bioInput,
                    age: ageInput,
                    gender: genderInput,
                    weight: weightInput,
                    goals: goalsInput,
                    friends: friends,
                    inbox: inbox,
                })
                .then(() => {
                    console.log('User Info Updated');
                    navigation.replace("Profile Screen");
                })
        }
        
    }

    const deleteUser =()=>{
        Alert.alert("WARNING", "Pressing OK will permanently delete this account",
    [
      {
        text: "Cancel"
      },
      {
        text: "OK",
        onPress: ()=>confirmDelete()
      }
    ])
    }
    
    function confirmDelete(){
        currentUser.delete();
        navigation.replace("Login")
    }

    async function SignOut(){
        const auth = getAuth();
        await SecureStore.deleteItemAsync("1");
        await SecureStore.deleteItemAsync("2");
        signOut(auth).then(() =>{
            console.log("sign out successful")
        }).catch((error) => {
            alert("an error has occurred")
        })
    }

    if (loading) {
        //add splash
        return (<LottieView source={require('../../loadingAnimation.json')} autoPlay loop />)
        } 
    return (
        <KeyboardAvoidingView
        style={styles.container}
            behavior="padding"
        >
            <ScrollView style={styles.container}>
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
                    <TouchableOpacity
                        onPress={SignOut}
                        style={styles.signOutButtonContainer}
                    >
                        <Text style={styles.buttonText}>Sign Out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={deleteUser}
                        style={styles.deleteAccountButtonContainer}
                    >
                        <Text style={styles.buttonText}>Delete Account</Text>
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
        backgroundColor: '#00a1d0',
        padding: 15,
        borderRadius: 10,
        alignSelf: 'center',
    },
    signOutButtonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#f9050b',
        padding: 15,
        borderRadius: 10,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    deleteAccountButtonContainer:{
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#b90409',
        padding: 15,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 200
    }
})
