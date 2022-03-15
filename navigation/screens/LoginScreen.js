
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase'
import { useNavigation } from '@react-navigation/core'
import {getDatabase, ref, onValue, set} from 'firebase/database';
import firebase from 'firebase/compat';
import { initializeApp } from 'firebase/app';
import 'firebase/compat/firestore';
import {getAuth, setPersistence, signInWithEmailAndPassword, browserLocalPersistence} from 'firebase/auth'
import * as SecureStore from 'expo-secure-store';


const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()


    // const firebaseConfig = {
    //     apiKey: "AIzaSyD5isZ4nQY1WNtRZhP76l4mV0c8Ja7fgjc",
    //     authDomain: "strength-in-numbers-61c20.firebaseapp.com",
    //     databaseURL: "https://strength-in-numbers-61c20-default-rtdb.europe-west1.firebasedatabase.app",
    //     projectId: "strength-in-numbers-61c20",
    //     storageBucket: "strength-in-numbers-61c20.appspot.com",
    //     messagingSenderId: "1048768070970",
    //     appId: "1:1048768070970:web:c0c64c2a40e041203efc03",
    //     measurementId: "G-Z03RMREVPS"
    //   };

    //const app = initializeApp(firebaseConfig)
    //const a = getAuth(app)

    useEffect( () => {
        async function getValue(){
            let resultE = await SecureStore.getItemAsync("1")
            let resultP = await SecureStore.getItemAsync("2")
            if(resultE && resultP){
                auth
                    .signInWithEmailAndPassword(resultE, resultP)
                    .then(userCredentials => {
                        const user = userCredentials.user;
                        console.log('Logged in with: ', user.email);
                    })
                    .catch(error => alert(error.message))
            }
        }
        getValue()
        //await setPersistence(a, browserLocalPersistence);
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("strength in numbers")
            }
            
        })
        return unsubscribe
    }, [])

    async function save(e, p){
        await SecureStore.setItemAsync("1", e);
        await SecureStore.setItemAsync("2", p);
    }

    const handleSignUp = () => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with: ', user.email);
            firebase.firestore()
                .collection('users')
                .doc(userCredentials.user.uid)
                .set({
                    email: email,
                    username: null,
                    bio: null,
                })
                .then(() => {
                    console.log('User Added');
                    save(email, password)
                })
            
        })
        .catch(error => alert(error.message))
        
    }

    const handleLogin = () => {
        auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with: ', user.email);
            save(email, password)
        })
        .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                onPress={handleLogin}
                style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    inputContainer: {
        width: '80%'
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
