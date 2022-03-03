import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Pressable } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';


import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import {storage, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { set } from 'firebase/database';

let tempUserArray = [];
export default function SearchScreen({navigation}){
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();



    const [onLoad, setOnLoad] = useState(false);
    const [users, setUsers] = useState([]);
    const [URL, setURL] = useState("");
    const [friendArray, setFriendArray] = useState([]);
    const [pendingArray, setPendingArray] = useState([]);
    const [search, setSearch] = useState('');
    const [requestedArray, setRequestedArray] = useState([]);
    let tempReq = [];

    useEffect(() => {
        firebase.firestore()
            .collection('users').get()
            .then((docs) => {
                if (onLoad === false) {
                    docs.forEach(doc => {
                        if (doc.id != currentUser.uid) {
                            let imageRef = getDownloadURL(ref(getStorage(), "images/" + doc.id));
                            imageRef
                            .then((url) => {
                                
                                tempUserArray.push({ displayName: doc.data().displayname, userName: doc.data().username, id: doc.id, url: url, bio: doc.data().bio })
                                setURL(url)
                            })
                            .catch((e) => console.log('getting downloadURL of image error => ', e));
                            if(doc.data().inbox != null){
                                    setPendingArray(doc.data().inbox);
                            }
                        }else{
                            if(doc.data().friends != null){
                                setFriendArray(doc.data().friends);
                            }
                            if(doc.data().inbox != null){
                            doc.data().inbox.forEach(d =>{
                                tempReq.push(d);
                            })
                            }
                        }
                        })
                        setUsers(tempUserArray)
                        setRequestedArray(tempReq)
                    }
            });
      }, []);

      function confirmFriend(friendID, name) {
        alert(name + " has been added as a friend!");
        firebase.firestore()
            .collection('users').get()
            .then((docs) => {
                    docs.forEach(doc => {
                        if (doc.id == currentUser.uid) {
                            let _age = doc.data().age;
                            let _bio = doc.data().bio;
                            let _displayname = doc.data().displayname;
                            let _email = doc.data().email;
                            let _gender = doc.data().gender;
                            let _goals = doc.data().goals;
                            let _username = doc.data().username;
                            let _weight = doc.data().weight;
                            let _inbox = doc.data().inbox;
                            let _friends = doc.data().friends;
                            if (_friends == null) {
                                _friends = [friendID]
                                setFriendArray(_friends)
                                let index = _inbox.indexOf(friendID + currentUser.uid);
                                    if( index > -1){
                                        _inbox.splice(index, 1);
                                }
                                let index2 = requestedArray.indexOf(friendID + currentUser.uid);
                                    if( index2 > -1){
                                        requestedArray.splice(index2, 1);
                                }
                                firebase.firestore().collection('users').doc(currentUser.uid).set({
                                    inbox: _inbox,
                                    age: _age,
                                    bio: _bio,
                                    displayname: _displayname,
                                    email: _email,
                                    gender: _gender,
                                    goals: _goals,
                                    username: _username,
                                    weight: _weight,
                                    friends: _friends
                                })

                            } else {
                                if (_friends.includes(friendID) == false){
                                    _friends.push(friendID)
                                    let index = _inbox.indexOf(friendID + currentUser.uid);
                                        if( index > -1){
                                            _inbox.splice(index, 1);
                                    }
                                    let index2 = requestedArray.indexOf(friendID + currentUser.uid);
                                    if( index2 > -1){
                                        requestedArray.splice(index2, 1);
                                }
                                setFriendArray(_friends)
                                }
                                firebase.firestore().collection('users').doc(currentUser.uid).set({
                                    inbox: _inbox,
                                    age: _age,
                                    bio: _bio,
                                    displayname: _displayname,
                                    email: _email,
                                    gender: _gender,
                                    goals: _goals,
                                    username: _username,
                                    weight: _weight,
                                    friends: _friends
                                })
                            }
                            
                        }
                        if(doc.id === friendID){
                            let _age = doc.data().age;
                            let _bio = doc.data().bio;
                            let _displayname = doc.data().displayname;
                            let _email = doc.data().email;
                            let _gender = doc.data().gender;
                            let _goals = doc.data().goals;
                            let _username = doc.data().username;
                            let _weight = doc.data().weight;
                            let _inbox = []
                            if(doc.data().inbox != null){

                                _inbox = doc.data().inbox;
                            }
                            let _friends = doc.data().friends;
                            if (_friends == null) {
                                _friends = [currentUser.uid]
                                
                                firebase.firestore().collection('users').doc(friendID).set({
                                    inbox: _inbox,
                                    age: _age,
                                    bio: _bio,
                                    displayname: _displayname,
                                    email: _email,
                                    gender: _gender,
                                    goals: _goals,
                                    username: _username,
                                    weight: _weight,
                                    friends: _friends
                                })

                            } else {
                                if (_friends.includes(currentUser.uid) == false){
                                    _friends.push(currentUser.uid)
                                }
                                
                                firebase.firestore().collection('users').doc(friendID).set({
                                    inbox: _inbox,
                                    age: _age,
                                    bio: _bio,
                                    displayname: _displayname,
                                    email: _email,
                                    gender: _gender,
                                    goals: _goals,
                                    username: _username,
                                    weight: _weight,
                                    friends: _friends
                                })
                            }
                        }

                        })
            });
      }
    
      function addFriend(friendID, name, key) {
        alert(name + " has been sent a friend request!");
        firebase.firestore()
            .collection('users').get()
            .then((docs) => {
                    docs.forEach(doc => {
                        // if (doc.id == currentUser.uid) {
                        //     let _age = doc.data().age;
                        //     let _bio = doc.data().bio;
                        //     let _displayname = doc.data().displayname;
                        //     let _email = doc.data().email;
                        //     let _gender = doc.data().gender;
                        //     let _goals = doc.data().goals;
                        //     let _username = doc.data().username;
                        //     let _weight = doc.data().weight;
                        //     let _friends = doc.data().friends;
                        //     if(_friends == null){
                        //         _friends = [friendID]
                        //     }else{
                        //         if(_friends.includes(friendID)==false)
                        //         _friends.push(friendID);
                        //     }

                        //     firebase.firestore().collection('users').doc(currentUser.uid).set({
                        //         friends: _friends,
                        //         age: _age,
                        //         bio: _bio,
                        //         displayname: _displayname,
                        //         email: _email,
                        //         gender: _gender,
                        //         goals: _goals,
                        //         username: _username,
                        //         weight:_weight,
                        //       })
                            

                            
                        // }

                        if (doc.id == friendID) {
                            let _age = doc.data().age;
                            let _bio = doc.data().bio;
                            let _displayname = doc.data().displayname;
                            let _email = doc.data().email;
                            let _gender = doc.data().gender;
                            let _goals = doc.data().goals;
                            let _username = doc.data().username;
                            let _weight = doc.data().weight;
                            let _inbox = doc.data().inbox;
                            let _friends = []
                            if(doc.data().friends != null){

                                _friends = doc.data().friends;
                            }
                            if (_inbox == null) {
                                _inbox = [currentUser.uid+friendID]
                                let temp = [...pendingArray]
                                temp.push(currentUser.uid+friendID)
                                setPendingArray(temp);
                            } else {
                                if (_inbox.includes(currentUser.uid+friendID) == false){

                                    _inbox.push(currentUser.uid+friendID);
                                }
                                let temp = [...pendingArray]
                                temp.push(currentUser.uid+friendID)
                                setPendingArray(temp);
                            }

                            firebase.firestore().collection('users').doc(friendID).set({
                                inbox: _inbox,
                                age: _age,
                                bio: _bio,
                                displayname: _displayname,
                                email: _email,
                                gender: _gender,
                                goals: _goals,
                                username: _username,
                                weight: _weight,
                                friends: _friends,
                            })
                        }

                        })
                        setUsers(tempUserArray)
                



            });

        //   tempUsers[key].friends = true;
        //   setUsers(tempUsers);
        //   alert(name + " has been added!");
        // firebase.firestore().collection('friends').doc(currentUser.uid).get()
        //   .then(
        //     documentSnapshot => getDBArray(documentSnapshot))
        //   .then(friends => {
        //       if (friends!=null){

        //           for (var i = 0; i < friends.length; i++) {
        //             dbArray.push(friends[i])
        //           }
        //           if (dbArray.includes(friendID) === false) {
        //             dbArray.push(friendID)
        //             firebase.firestore().collection('friends').doc(currentUser.uid).set({
        //               friends: dbArray
        //             })
        //           }
        //       }else{
        //           console.log("here")
        //         dbArray.push(friendID)
        //         firebase.firestore().collection('friends').doc(currentUser.uid).set({
        //           friends: dbArray
        //         })
        //       }
        //   });
      }

      function deletePending(friendID, name, key){
        alert(name + "'s request has been cancelled!");
        firebase.firestore()
            .collection('users').get()
            .then((docs) => {
                    docs.forEach(doc => {
                        if (doc.id == friendID) {
                            let _age = doc.data().age;
                            let _bio = doc.data().bio;
                            let _displayname = doc.data().displayname;
                            let _email = doc.data().email;
                            let _gender = doc.data().gender;
                            let _goals = doc.data().goals;
                            let _username = doc.data().username;
                            let _weight = doc.data().weight;
                            let _inbox = doc.data().inbox;
                            if (_inbox == null) {
                            } else {
                                if (_inbox.includes(currentUser.uid+friendID) == true){
                                    let index = _inbox.indexOf(currentUser.uid+friendID);
                                    if( index > -1){
                                        _inbox.splice(index, 1);
                                    }
                                }
                                let temp = [...pendingArray]
                                let index = temp.indexOf(currentUser.uid+friendID);
                                    if( index > -1){
                                        temp.splice(index, 1);
                                    }
                                setPendingArray(temp);
                            }
                            firebase.firestore().collection('users').doc(friendID).set({
                                inbox: _inbox,
                                age: _age,
                                bio: _bio,
                                displayname: _displayname,
                                email: _email,
                                gender: _gender,
                                goals: _goals,
                                username: _username,
                                weight: _weight,
                            })
                        }

                        })
            });
      }

      return(
        <View style={styles.container}>
            <View style={{borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 15}}>
                <TextInput style={styles.searchContainer} placeholder="Search" value={search} onChangeText={text => setSearch(text)}></TextInput>
            </View>
            <ScrollView>
                {users.map((u, key) => ( search === "" ?
                    <Pressable style={styles.userContainer} onPress={() => navigation.navigate('View Profile', {userID: u.id})}>
                        <ImageBackground style={styles.profilePicDefault}
                            source={require('../../assets/profiledefault.png')}>
                            <Image
                                style={styles.profilePic}
                                source={{ uri: u.url}}
                            />
                        </ImageBackground>
                        <View style={{ justifyContent: 'center', marginBottom: 5}}>
                            <Text style={styles.displayNameText}>{u.displayName}</Text>
                            <Text style={styles.userNameText}>{u.userName}</Text>
                            

                            <Text style={styles.viewProfile}>View Profile</Text>
                            
                        </View>
                        {friendArray.includes(u.id) === true ? <View></View>
                        : pendingArray.includes(currentUser.uid+u.id) === true ?
                         <View style={{ justifyContent: 'center', marginLeft: 'auto', marginRight: 5 }}>

                                <Pressable style={styles.addButton} onPress={() => deletePending(u.id, u.displayName, key)}>
                                    <Text>Pending</Text>
                                </Pressable>
                            </View>
                        : requestedArray.includes(u.id+currentUser.uid) === true ?
                        <View style={{ justifyContent: 'center', marginLeft: 'auto', marginRight: 5 }}>

                        <Pressable style={styles.addButton} onPress={() => confirmFriend(u.id, u.displayName)}>
                        <Image style={styles.addButton} source={require('../../assets/addFriend.png')}></Image>
                        </Pressable>
                    </View>        
                        :       <View style={{ justifyContent: 'center', marginLeft: 'auto', marginRight: 5 }}>

                                    <Pressable style={styles.addButton} onPress={() => addFriend(u.id, u.displayName, key)}>
                                        <Image style={styles.addButton} source={require('../../assets/addFriend.png')}></Image>
                                    </Pressable>
                                </View> 
                            }
                    </Pressable>
                    
                :   u.displayName.includes(search) === true ? 
                <Pressable style={styles.userContainer} onPress={() => navigation.navigate('View Profile', {userID: u.id})}>
                        <ImageBackground style={styles.profilePicDefault}
                            source={require('../../assets/profiledefault.png')}>
                            <Image
                                style={styles.profilePic}
                                source={{ uri: u.url}}
                            />
                        </ImageBackground>
                        <View style={{ justifyContent: 'center', marginBottom: 5}}>
                            <Text style={styles.displayNameText}>{u.displayName}</Text>
                            <Text style={styles.userNameText}>{u.userName}</Text>
                            

                            <Text style={styles.viewProfile}>View Profile</Text>
                            
                        </View>
                        {friendArray.includes(u.id) === true ? <View></View>
                        : pendingArray.includes(currentUser.uid+u.id) === true ?
                         <View style={{ justifyContent: 'center', marginLeft: 'auto', marginRight: 5 }}>

                                <Pressable style={styles.addButton} onPress={() => deletePending(u.id, u.displayName, key)}>
                                    <Text>Pending</Text>
                                </Pressable>
                            </View>
                        : requestedArray.includes(u.id+currentUser.uid) === true ?
                        <View style={{ justifyContent: 'center', marginLeft: 'auto', marginRight: 5 }}>

                        <Pressable style={styles.addButton} onPress={() => confirmFriend(u.id, u.displayName)}>
                        <Image style={styles.addButton} source={require('../../assets/addFriend.png')}></Image>
                        </Pressable>
                    </View>        
                        :       <View style={{ justifyContent: 'center', marginLeft: 'auto', marginRight: 5 }}>

                                    <Pressable style={styles.addButton} onPress={() => addFriend(u.id, u.displayName, key)}>
                                        <Image style={styles.addButton} source={require('../../assets/addFriend.png')}></Image>
                                    </Pressable>
                                </View> 
                            }
                    </Pressable>
                    :u.userName.includes(search) === true ? 
                    <Pressable style={styles.userContainer} onPress={() => navigation.navigate('View Profile', {userID: u.id})}>
                        <ImageBackground style={styles.profilePicDefault}
                            source={require('../../assets/profiledefault.png')}>
                            <Image
                                style={styles.profilePic}
                                source={{ uri: u.url}}
                            />
                        </ImageBackground>
                        <View style={{ justifyContent: 'center', marginBottom: 5}}>
                            <Text style={styles.displayNameText}>{u.displayName}</Text>
                            <Text style={styles.userNameText}>{u.userName}</Text>
                            

                            <Text style={styles.viewProfile}>View Profile</Text>
                            
                        </View>
                        {friendArray.includes(u.id) === true ? <View></View>
                        : pendingArray.includes(currentUser.uid+u.id) === true ?
                         <View style={{ justifyContent: 'center', marginLeft: 'auto', marginRight: 5 }}>

                                <Pressable style={styles.addButton} onPress={() => deletePending(u.id, u.displayName, key)}>
                                    <Text>Pending</Text>
                                </Pressable>
                            </View>
                                
                        : requestedArray.includes(u.id+currentUser.uid) === true ?
                        <View style={{ justifyContent: 'center', marginLeft: 'auto', marginRight: 5 }}>

                        <Pressable style={styles.addButton} onPress={() => confirmFriend(u.id, u.displayName)}>
                        <Image style={styles.addButton} source={require('../../assets/addFriend.png')}></Image>
                        </Pressable>
                    </View>
                        :<View style={{ justifyContent: 'center', marginLeft: 'auto', marginRight: 5 }}>

                                    <Pressable style={styles.addButton} onPress={() => addFriend(u.id, u.displayName, key)}>
                                        <Image style={styles.addButton} source={require('../../assets/addFriend.png')}></Image>
                                    </Pressable>
                                </View> 
                            }
                    </Pressable>:<Text></Text>))}
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
      searchContainer: {
        backgroundColor: '#d4d4d4',
        width: '90%',
        height: 50,
        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 10,
        padding: 15,
        fontSize: 18
      },
      userContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        width: '95%',
        padding: 10,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
        elevation: 5,
        flexDirection: 'row',
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
      displayNameText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 10,
        
      },
      userNameText: {
        fontStyle: 'italic',
        fontSize: 16,
        marginLeft: 10,
      },
      viewProfile: {
        fontStyle: 'normal',
        fontSize: 16,
        marginTop: 30,
        marginLeft: 40,
        
      },
      addButton: {
        width: 60,
        height: 60,
        alignSelf: 'center',
      },
      addText: {
          marginTop: 8, 
          fontSize: 16,
          fontStyle: 'normal'
    }
})
