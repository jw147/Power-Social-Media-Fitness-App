import React, {useState, useEffect, useContext} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Row, Alert, Pressable, ImageBackground } from 'react-native'
import { auth } from '../../firebase'
import { useNavigation } from '@react-navigation/core'
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import * as ImagePicker from 'expo-image-picker';
import {storage, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfileScreen({navigation}){

    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    const [userName, setUserName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [Bio, setBio] = useState('')

    function getUserName(documentSnapshot) {
        return documentSnapshot.get('username');
      }    
    
    function getDisplayName(documentSnapshot) {
        return documentSnapshot.get('displayname');
    }

    function getBio(documentSnapshot) {
        return documentSnapshot.get('bio');
    }

    const gettingUserName = db.collection('users').doc(currentUser.uid).get()
        .then(
            documentSnapshot => getUserName(documentSnapshot))
        .then(username => {
            if (username === null) {
                navigation.replace("Configure Profile");
            }else{
                setUserName(username);
            }
        });

    const gettingDisplayName = db.collection('users').doc(currentUser.uid).get()
        .then(
            documentSnapshot => getDisplayName(documentSnapshot))
        .then(displayname => {
            if (displayname === null) {

            } else {
                setDisplayName(displayname);
            }
        });

    const gettingBio = db.collection('users').doc(currentUser.uid).get()
        .then(
            documentSnapshot => getBio(documentSnapshot))
        .then(bio => {
            if (bio === null) {

            } else {
                setBio(bio);
            }
        });

    const [image, setImage] = useState('');


    let imageRef = getDownloadURL(ref(getStorage(), "images/" + currentUser.uid));
    
    imageRef
    .then((url) => {
            setImage(url);
    })
    .catch((e) => console.log('getting downloadURL of image error => ', e));

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
        });
            handleImagePicked(result);
        
    };

    async function handleImagePicked(pickerResult){
        try {
          //setState({ uploading: true });
    
          if (!pickerResult.cancelled) {
            uploadImageAsync(pickerResult.uri);
            //setState({ image: uploadUrl });
          }
        } catch (e) {
          console.log(e);
          alert("Upload failed, sorry :(");
        } finally {
          console.log("exitHandleImage");
        }
      };
    
    async function uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        const fileRef = ref(getStorage(), "images/" + currentUser.uid);
        const result = await uploadBytes(fileRef, blob);

        // We're done with the blob, close and release it
        blob.close();
        let imageRef = getDownloadURL(ref(getStorage(), "images/" + currentUser.uid));

        imageRef
            .then((url) => {
                setImage(url);
            })
            .catch((e) => console.log('getting downloadURL of image error => ', e));
        return await getDownloadURL(fileRef);
    }    

    
        
    
    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{userName}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Pressable style={styles.profilePicFormat}
                onPress={pickImage}>
                    <ImageBackground style = {styles.profilePicDefault}
                    source={require('../../assets/profiledefault.png')}>
                        <Image
                            style={styles.profilePic}
                            source={{ uri: image }}
                        />
                    </ImageBackground>
                        
                    <Image 
                        style={styles.addPic}
                        source={require('../../assets/addimage.png')}
                    />
                </Pressable>
                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => Alert.alert("10 posts")}>
                    <Text style={styles.infoText}>10{"\n"}Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => Alert.alert("1,000 followers")}>
                    <Text style={styles.infoText}>1,000{"\n"}Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => Alert.alert("420 following")}>
                    <Text style={styles.infoText}>420{"\n"}Following</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bioContainer}>
                <Text style={styles.displayNameText}>{displayName}</Text>
                <Text style={styles.bioText}>{Bio}</Text>
                <TouchableOpacity 
                style={styles.editButton}>
                    <Text style={styles.editText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

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
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        color: 'black',
        paddingLeft: 10,
        paddingTop: 5,
      },
      titleContainer: {
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: 'grey',
      },
      infoContainer:{
        flexDirection: 'row',
        paddingTop: 10,
      },
      profilePicDefault:{
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 10,
      },
      profilePic:{
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 0,
      },
      infoText: {
        textAlign: 'center',
        fontSize: 16,
      },
      infoButton: {
        paddingTop: 30,
        paddingLeft: 25,
      },
      bioContainer:{
        flexDirection: 'column',
        paddingTop: 10,
        borderBottomWidth: 1,
        borderColor: 'grey',
      },
      displayNameText: {
        paddingLeft: 10,
        fontWeight: 'bold',
        fontSize: 16,
      },
      bioText: {
        paddingLeft: 10,
        fontSize: 16,
      },
      editButton: {
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        padding: 8,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 10,
      },
      editText: {
          fontSize: 15
      },
      profilePicFormat: {
        flexDirection: 'row',
      },
      addPic: {
          width: 25,
          height: 25,
          marginLeft: -30,
          marginTop: 70,
          borderRadius: 25,
          borderWidth: 1,
          borderColor: 'white',
      }
})
