import { StyleSheet, Text, View, TextInput, Pressable, Image, Modal, ScrollView, ImageBackground } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import React, {useState, useEffect} from 'react'
import { auth } from '../../firebase'
import { useNavigation } from '@react-navigation/core'
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import {storage, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createStackNavigator } from '@react-navigation/stack';
import { collection, doc, setDoc } from "firebase/firestore"; 




export default function MessageScreen({navigation}){
    const currentUser = firebase.auth().currentUser;

    const [chatsArray, setChatsArray] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [onLoad, setOnLoad] = useState(false);
    const [friendArray, setFriendArray] = useState([]);
    const [pendingArray, setPendingArray] = useState([]);
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [pendUsers, setPendUsers] = useState([]);
    const [url, setURL] = useState("");
    let tempUserArray = [];
    let tempPendArray = [];
    
    const [chatArray, setChatArray] = useState([]);
    const [messageArray, setMessageArray] = useState([]);


    

    useEffect(() => {
        let tempFriends = [];
        firebase.firestore()
            .collection('users').get()
            .then((docs) => {
                docs.forEach(doc => {
                    if (doc.id == currentUser.uid) {
                        if (doc.data().inbox != null) {
                            setPendingArray(doc.data().inbox)
                        }
                        if (doc.data().friends != null) {
                            tempFriends = doc.data().friends
                            setFriendArray(tempFriends);
                        }

                        firebase.firestore()
                            .collection('users').get()
                            .then((docs) =>{
                                docs.forEach(doc =>{
                                    if (tempFriends.includes(doc.id)) {
                                        let imageRef = getDownloadURL(ref(getStorage(), "images/" + doc.id));
                                        imageRef
                                            .then((url) => {
                                                tempUserArray.push({ displayName: doc.data().displayname, userName: doc.data().username, id: doc.id, url: url, bio: doc.data().bio })
                                                setURL(url)
                                                setUsers(tempUserArray)
                                            })
                                            .catch((e) => console.log('getting downloadURL of image error => ', e));
                                    }
                                })
                            })


                    }
                    
                })

            });

            }, []);

            const isFocused = useIsFocused();
            
            useEffect(() => {
                firebase.firestore()
                    .collection('chatrooms')
                    .get()
                    .then((docs) => {
                        let tempChatArray = [];
                        let tempMessageArray = [];
                        docs.forEach(doc => {
                            if (doc.id.includes(currentUser.uid)) {
                                tempChatArray.push(doc.id)
                                firebase.firestore()
                                    .collection('chatrooms')
                                    .doc(doc.id)
                                    .collection('chats')
                                    .get()
                                    .then((docs) => {
                                        let tempString = "";

                                        docs.forEach(doc => {
                                            tempString = doc.data().message
                                        })
                                        if (tempString.length > 31) {
                                            tempMessageArray.push(tempString.substring(0, 30) + "...")

                                        } else {
                                            tempMessageArray.push(tempString)
                                        }
                                        setMessageArray(tempMessageArray);
                                    });
                            }
                        })
                        setChatArray(tempChatArray);
                    });
                    
                    }, []);

                    


    function loadFriends(){
        setModalVisible(true);
        if(onLoad === false){
            firebase.firestore()
                .collection('users').get()
                .then((docs) => {
                    if (onLoad === false) {
                        docs.forEach(doc => {

                            if (pendingArray.includes(doc.id+currentUser.uid)) {
                                let imageRef = getDownloadURL(ref(getStorage(), "images/" + doc.id));
                                imageRef
                                    .then((url) => {
                                        tempPendArray.push({ displayName: doc.data().displayname, userName: doc.data().username, id: doc.id, url: url, bio: doc.data().bio })
                                        setURL(url)
                                    })
                                    .catch((e) => console.log('getting downloadURL of image error => ', e));
                            }
                            if (friendArray.includes(doc.id)) {
                                let imageRef = getDownloadURL(ref(getStorage(), "images/" + doc.id));
                                imageRef
                                    .then((url) => {
                                        tempUserArray.push({ displayName: doc.data().displayname, userName: doc.data().username, id: doc.id, url: url, bio: doc.data().bio })
                                        setURL(url)
                                        setUsers(tempUserArray)
                                    })
                                    .catch((e) => console.log('getting downloadURL of image error => ', e));
                            }

                        })
                        setPendUsers(tempPendArray)
                        }
                });
                setOnLoad(true);
        }
    }

    function selectUsers(user){
        let temp = [...selected]
        if(selected.includes(user) === false){
            
            
            temp.push(user)
            setSelected(temp)
        }else{
            let index = selected.indexOf(user)
            temp.splice(index, 1)
            setSelected(temp)
        }
    }

    function createChat(){
        setModalVisible(!modalVisible);
        navigation.navigate("New Chat", {userID: selected});
    }

    function existingChat(title){
        navigation.navigate("Chat", {title: title})
    }
    
  return (
      <View style={styles.container}>
          <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 15, flexDirection: 'row', marginBottom: 10}}>
              <TextInput style={styles.searchContainer} placeholder="Search"  ></TextInput>
              <Pressable style={styles.newMessageContainer} onPress={()=> loadFriends()}><Image style={styles.newMessage} source={require("../../assets/createMessage.png")}/></Pressable>
          </View>
          {chatArray.map((c, key) =>(
              users.map(u => ( c.includes(u.id) &&

              <Pressable style={styles.chatContainer} onPress={()=> existingChat(c)}>
                  <View style={{flexDirection: 'row'}}>
                       <ImageBackground style={styles.profilePicDefaultMessage}
                          source={require('../../assets/profiledefault.png')}>
                            <Image
                              style={styles.profilePicMessage}
                              source={{ uri: u.url }}
                            />
                       </ImageBackground>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.displayNameText}>{u.displayName}</Text>
                                <Text style={styles.userNameText}>{u.userName}</Text>
                            </View>
                            <Text style={styles.MessageText}>{messageArray[key]}</Text>
                        </View>
                  </View>
              </Pressable>
              ))
          ))} 
          
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                  setModalVisible(!modalVisible);
              }}
          >
              <View style={styles.friendsContainerView}>
                  <ScrollView style={styles.friendsView}>
                      <Text style={{ marginTop: 10, alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10, }}>Start a new chat</Text>
                      <Text style ={{marginLeft: 10, fontSize: 16}}>Friends List:</Text>
                      {users.map((u, key) => (

                          <Pressable style={styles.userContainer} onPress={() => selectUsers(u.id)}>
                              
                              <ImageBackground style={styles.profilePicDefault}
                                  source={require('../../assets/profiledefault.png')}>
                                  <Image
                                      style={styles.profilePic}
                                      source={{ uri: u.url }}
                                  />
                              </ImageBackground>
                              <View style={{ justifyContent: 'center', marginBottom: 5 }}>
                                  <Text style={styles.displayNameText}>{u.displayName}</Text>
                                  <Text style={styles.userNameText}>{u.userName}</Text>



                              </View>
                              {selected.includes(u.id)=== true ?
                              <Pressable style={{height:20,width:20,borderRadius:10,backgroundColor:'grey', alignSelf: 'center', marginLeft: 'auto'}}></Pressable>
                              :<Pressable style={{height:20,width:20,borderRadius:10,borderColor:'grey', borderWidth:1, alignSelf: 'center', marginLeft: 'auto'}}></Pressable>
                              }
                          </Pressable>

                      ))}
                      <Pressable
                          style={[styles.button, styles.buttonCreate]}
                          onPress={() => createChat()}
                      >
                          <Text style={{ color: 'white' }}>Create</Text>
                      </Pressable>
                      <Pressable
                          style={[styles.button, styles.buttonCloseModal]}
                          onPress={() => setModalVisible(!modalVisible)}
                      >
                          <Text style={{ color: 'white' }}>Close</Text>
                      </Pressable>
                  </ScrollView>
              </View>
          </Modal>
          
      </View>
  )
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        alignItems: 'center'
      },
      searchContainer: {
        backgroundColor: '#d4d4d4',
        width: '75%',
        height: 50,
        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 10,
        padding: 15,
        fontSize: 18
      },
      newMessageContainer:{
          marginLeft: 10,
          width: '10%',
          marginTop: 15
      },
      newMessage: {
          width: 50,
          height: 50
      },
      friendsContainerView: {
        
        marginTop: 100,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 100
      },
      friendsView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        width: 300,
        paddingBottom: 50
      },
      buttonCloseModal:{
        backgroundColor: 'red',
        height: 50,
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 10,
      },
      buttonCreate:{
        backgroundColor: '#00a1d0',
        height: 50,
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 10,
      },
      userContainer: {
        backgroundColor: 'white',
        width: '95%',
        padding: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        borderBottomWidth:1,
        borderColor: 'grey',
      },
      profilePicDefault:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 10,
      },
      profilePic:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 0,
      },
      profilePicDefaultMessage:{
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 10,
      },
      profilePicMessage:{
        width: 70,
        height: 70,
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
      chatContainer: {
        height: 100,
        width: '100%',
        borderColor: 'black',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        justifyContent: 'center',
      },
      MessageText: {
        fontStyle: 'italic',
        fontSize: 16,
        marginLeft: 10,
        marginTop: 10,
        color: 'grey'
      }
})