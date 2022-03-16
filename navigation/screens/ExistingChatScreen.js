import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard } from 'react-native';
import React, {useState, useEffect} from 'react';
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import {storage, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import LottieView from 'lottie-react-native';
import { onSnapshot, QuerySnapshot } from 'firebase/firestore';

export default function ChatScreen({route, navigation}){
  const date = new Date();
  const currentUser = firebase.auth().currentUser;
  const userID = route.params;
  const [users, setUsers] = useState([]);
  const [url, setURL] = useState("");
  const [message, setMessage] = useState("");
  let tempUserArray = [];
  let tempChatIndex = 0;
  let tempMessageArray = [];
  let tempMessageID = [];
  const [chatRoom, setChatRoom] = useState("");
  const [chatIndex, setChatIndex] = useState(0);
  const [messageArray, setMessageArray] = useState([]);
  const [messageID, setMessageID] = useState([]);


  // const getMessages = firebase.firestore()
  //   .collection('chatrooms')
  //   .doc(userID.title)
  //   .collection('chats')
  //   .get()
  //   .then((docs) => {
  //     docs.forEach(doc => {
  //       tempMessageArray.push({ message: doc.data().message, sentBy: doc.data().sentBy, time: doc.data().time })
  //     })
  //     setMessageArray(tempMessageArray);
  //   });
  // const getMessages = firebase.firestore()
  //                     .collection("chatrooms")
  //                     .doc(userID.title)
  //                     .collection("chats")
  //                     .onSnapshot((querySnapshot) => {
  //                       var tM = [];
  //                       var ID = [...messageID]

  //                       querySnapshot.forEach((doc) =>{
  //                           ID.push(doc.id)
  //                           tM.push({ message: doc.data().message, sentBy: doc.data().sentBy, time: doc.data().time })
  //                       })
  //                       setMessageID(ID);
  //                       setMessageArray(tM);
  //                     })

    const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getDatabase = async() =>{
      // await firebase.firestore()
      //   .collection('chatrooms')
      //   .doc(userID.title)
      //   .collection('chats')
      //   .get()
      //   .then((docs) => {
      //     docs.forEach(doc => {
      //       tempMessageID.push(doc.id)
      //       tempMessageArray.push({ message: doc.data().message, sentBy: doc.data().sentBy, time: doc.data().time })
      //     })
      //     setMessageID(tempMessageID);
      //     setMessageArray(tempMessageArray);
      //   });
      firebase.firestore()
                      .collection("chatrooms")
                      .doc(userID.title)
                      .collection("chats")
                      .onSnapshot((querySnapshot) => {
                        var tM = [];
                        var ID = [...messageID]

                        querySnapshot.forEach((doc) =>{
                            ID.push(doc.id)
                            tM.push({ message: doc.data().message, sentBy: doc.data().sentBy, time: doc.data().time.seconds })
                        })
                        tM.sort((a, b) => a.time - b.time)
                        setMessageID(ID);
                        setMessageArray(tM);
                      })
    }
    getDatabase()
    
        

    
  }, []);

  function sendMessage(){
    //firebase here
    firebase.firestore()
    .collection('chatrooms')
    .doc(userID.title)
    .collection('chats')
    .doc(String(chatIndex))
    .set({
      message: message,
      sentBy: currentUser.uid,
      time: date
    })
    setChatIndex(chatIndex + 1)
    setMessage("");
    Keyboard.dismiss();
    // let t = [...messageArray]
    // t.push({message: message, sentBy: currentUser.uid, time: String(date)})
    // setMessageArray(t);
  }

  function getChatLength(){
    var randomNumber = 1 + Math.random() * (2000 - 1);
    setChatIndex(randomNumber)
  }

  // if (loading) {
  //   //add splash
  //   return (<LottieView source={require('../../loadingAnimation.json')} autoPlay loop />)
  //   } 
    return (
      <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset = "50" behavior={Platform.OS === "ios" ? "padding" : "height"}>

            <ScrollView style={styles.chatContainer}>
              {messageArray.flatMap(m => ( m.sentBy === currentUser.uid ?
                <View style={styles.messageContainerSelf}>
                  <Text style={styles.messageTextSelf}>{m.message}</Text>

                </View>
                : <View style={styles.messageContainerOther}>

                  <Text style={styles.messageTextOther}>{m.message}</Text>
                  </View>
              ))}
            </ScrollView>

            <KeyboardAvoidingView style={styles.chatInputContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>


              <TextInput style={styles.chatInput} placeholder="Message..." value={message} onFocus={()=>getChatLength()} onChangeText={text => setMessage(text)}></TextInput>
              <Pressable style={styles.sendButton} onPress={()=>sendMessage()}><Text style={styles.sendText}>Send</Text></Pressable>
            </KeyboardAvoidingView>
      </KeyboardAvoidingView>
      )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end'
    //alignItems: 'center'
  },
  chatContainer: {
    height: '80%',
    width: '100%',
  },
  chatInputContainer: {
    borderTopColor: 'grey',
    borderTopWidth: 1,
    width: '100%',
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 30
  },
  chatInput: {
    backgroundColor: '#d4d4d4',
    width: '70%',
    height: 50,
    marginTop: 10,
    borderRadius: 20,
    padding: 15,
    fontSize: 18,
    
  },
  sendButton: {
    borderRadius: 10,
    height: 50,
    width: '15%',
    backgroundColor: '#00a1d0',
    marginTop: 10,
    justifyContent: 'center'
  },
  sendText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
},
  messageContainerSelf: {
    marginLeft: 'auto',
    padding: 10,
    backgroundColor: '#00a1d0',
    borderRadius: 10,
    marginTop: 10,
    marginRight: 10
  },
  messageTextSelf: {
    color: 'white',
    fontSize: 15
  },
  messageContainerOther: {
    marginRight: 'auto',
    padding: 10,
    backgroundColor: 'white',
    borderColor: '#00a1d0',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10
  },
  messageTextOther: {
    color: 'black',
    fontSize: 15
  }
})