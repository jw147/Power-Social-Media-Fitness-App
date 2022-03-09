import React, {useState, useEffect, useContext, Component} from 'react'
import { StyleSheet, Text, View, Image, ImageBackground, ScrollView } from 'react-native'

import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import {storage, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, set } from 'firebase/database';
import LottieView from 'lottie-react-native';


export default function FeedScreen({navigation}){
    const currentUser = firebase.auth().currentUser;
    
    const [friendArray, setFriendArray] = useState([]);
    const [pendingArray, setPendingArray] = useState([]);
    const [users, setUsers] = useState([]);
    const [url, setURL] = useState("");
    const [tCardio, setTCardio] = useState([]);
    const [tWeights, setTWeights] = useState([]);
    const [posts, setPosts] = useState({posts:[]});
    let tempUserArray = [];
    
    
    const [loading, setLoading] = useState(true)

    useEffect( () => {
        const getDatabase = async() =>{
            var tempPosts = [];
            let tempFriends = [];
            let tempWeightsArray = [];
            let tempCardioArray = [];
            await firebase.firestore()
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
                            
                                }
                            })
                        });
                        
            await firebase.firestore()
                .collection('users').get()
                .then((docs) => {
                    docs.forEach(doc => {
                        if (tempFriends.includes(doc.id)) {
                            let imageRef = getDownloadURL(ref(getStorage(), "images/" + doc.id));
                            imageRef
                                .then((url) => {
                                    tempUserArray.push({ displayName: doc.data().displayname, userName: doc.data().username, id: doc.id, url: url, bio: doc.data().bio })
                                    setURL(url)
                                    setUsers(tempUserArray)
                                })
                                .catch((e) => console.log('getting downloadURL of image error => ', e));

                            firebase.firestore()
                                .collection('posts')
                                .doc(doc.id)
                                .collection('posts').get()
                                .then((docs) => {
                                    let ID = doc.id;
                                    docs.forEach(doc => {
                                        if (doc.data().post == null) {
                                            
                                            tempCardioArray.push({
                                                calories: doc.data().calories, wName: doc.data().cardio, date: doc.data().date.seconds, distance: doc.data().distance,
                                                speed: doc.data().speed, time: doc.data().time, id: ID
                                            })
                                        }
                                        else {
                                            tempWeightsArray.push({ weights: doc.data().post, id: ID, date: doc.data().post[0].date.seconds })
                                        }
                                    })
                                    setTWeights(tempWeightsArray)
                                    setTCardio(tempCardioArray)
                                    for (var i = 0; i < tempCardioArray.length; i++) {
                                        if (tempPosts.includes(tempCardioArray[i]) === false) {
        
                                            tempPosts.push(tempCardioArray[i])
                                        }
                                    }
                                    for (var i = 0; i < tempWeightsArray.length; i++) {
                                        if (tempPosts.includes(tempWeightsArray[i]) === false) {
                                            tempPosts.push(tempWeightsArray[i])
                                        }
                                    }
                                    tempPosts.sort((a, b) => b.date - a.date)
                                })
                        }
                    })
                    setPosts(tempPosts);
                })
        }
        getDatabase().then(()=>setLoading(false))
            }, [loading]);

    
    if (loading) {
        //add splash
        return (<LottieView source={require('../../loadingAnimation.json')} autoPlay loop />)
    } 
    return(
        <ScrollView style={styles.container}>
            { posts.length > 0 ? posts.map((p, key) => (    p.weights === undefined ?
                <View key={key} style={styles.exerciseContainer}>
                {users.map(u => ( u.id === p.id &&
                <View style={{flexDirection: 'row'}}>
                    <ImageBackground style={styles.profilePicDefault}
                        source={require('../../assets/profiledefault.png')}>
                        <Image
                            style={styles.profilePic}
                            source={{ uri: u.url }}
                        />
                    </ImageBackground>
                    <View style={{ justifyContent: 'center', marginBottom: 5}}>
                        <Text style={styles.displayNameText}>{u.displayName}'s{"\n"}{p.wName}</Text>
                        <Text style={styles.userNameText}>{u.userName}</Text>
                    </View>
                </View>
                ))}
                <View style={{flexDirection: 'row'}}>
                    {p.wName === "Run" && <Image style={{marginLeft: 10}} source={require('../../assets/run.png')}></Image>}
                    {p.wName === "Cycle" && <Image style={{marginLeft: 10}} source={require('../../assets/cycle.png')}></Image>}
                    {p.wName === "Walk" && <Image style={{marginLeft: 10}} source={require('../../assets/walk.png')}></Image>}
                    <View style={{marginLeft: 70, marginTop: 20}}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{fontWeight: 'bold', fontSize: 15}}>Speed</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 15, marginLeft: 30}}>Distance</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 15}}>{p.speed}km/h</Text>
                            <Text style={{fontSize: 15, marginLeft: 40}}>{p.distance}km</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, marginTop: 10 }}>Time</Text>
                            <Text style={{fontSize: 15}}>{p.time}minutes</Text>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Image style={{height: 15, width: 15}} source={require('../../assets/burn.png')}></Image>
                    <Text style={{marginLeft: 5}}>{p.calories} kcal</Text>
                </View>
            </View>
            :<View style={styles.exerciseContainer}>
                {users.map(u => ( u.id === p.id &&
                <View style={{flexDirection: 'row'}}>
                    <ImageBackground style={styles.profilePicDefault}
                        source={require('../../assets/profiledefault.png')}>
                        <Image
                            style={styles.profilePic}
                            source={{ uri: u.url }}
                        />
                    </ImageBackground>
                    <View style={{ justifyContent: 'center', marginBottom: 5}}>
                        <Text style={styles.displayNameText}>{u.displayName}'s{"\n"}{p.weights[0].workout}</Text>
                        <Text style={styles.userNameText}>{u.userName}</Text>
                    </View>
                </View>
                ))}
                {p.weights.map((w, key = 0) =>(
                    key == 0 ?
                    <View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{width:180, fontWeight: 'bold', fontSize: 15}}>{w.ex}</Text>
                            <Text style={{marginLeft: 20, fontWeight: 'bold', fontSize: 15}}>Set</Text>
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15}}>Weight</Text>
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15}}>Reps</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{width:180}}></Text>
                            <Text style={{width: 20, fontSize:15, marginLeft:25, textAlign: 'center'}}>{w.set}</Text>
                            <Text style={{width:30, fontSize:15, marginLeft:20, textAlign: 'center'}}>{w.weight}</Text>
                            <Text style={{width:20, fontSize:15, marginLeft:30, textAlign: 'center'}}>{w.reps}</Text>
                        </View>
                        
                    </View>:
                    p.weights[key].ex === p.weights[key-1].ex ? 
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{width:180}}></Text>
                        <Text style={{width: 20, fontSize:15, marginLeft:25, textAlign: 'center'}}>{w.set}</Text>
                        <Text style={{width:30, fontSize:15, marginLeft:20, textAlign: 'center'}}>{w.weight}</Text>
                        <Text style={{width:20, fontSize:15, marginLeft:30, textAlign: 'center'}}>{w.reps}</Text>
                    </View>:
                        <View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{width:180, fontWeight: 'bold', fontSize: 15}}>{w.ex}</Text>
                            <Text style={{marginLeft: 20, fontWeight: 'bold', fontSize: 15}}>Set</Text>
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15}}>Weight</Text>
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15}}>Reps</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{width:180}}></Text>
                            <Text style={{width: 20, fontSize:15, marginLeft:25, textAlign: 'center'}}>{w.set}</Text>
                            <Text style={{width:30, fontSize:15, marginLeft:20, textAlign: 'center'}}>{w.weight}</Text>
                            <Text style={{width:20, fontSize:15, marginLeft:30, textAlign: 'center'}}>{w.reps}</Text>
                        </View>
                        
                    </View>
                ))}
                <View style={{flexDirection: 'row'}}>
                            <Image style={{height: 15, width: 15}} source={require('../../assets/burn.png')}></Image>
                            <Text style={{marginLeft: 5}}>{p.weights[0].calories} kcal</Text>
                </View>
            </View>
            )):
            <Text style={styles.noPostsText}>There are no posts to see! Add some friends and keep up with their activity here!</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
      },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center'
    },
    exerciseContainer:{
        backgroundColor: 'white',
        marginTop: 10,
        width: '95%',
        padding: 10,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    dateTitle: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold'
    },
    loadButton: {
        width: 200, 
        height: 40, 
        backgroundColor: '#00a1d0',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 5,
        borderRadius: 7,
    },
    dropContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        borderWidth: 1,
        borderBottomColor: 'black'
    },
    profilePicDefault:{
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 10,
      },
      profilePic:{
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 0,
      },
      displayNameText: {
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 10,
        
      },
      userNameText: {
        fontStyle: 'italic',
        fontSize: 16,
        marginLeft: 10,
      },
      noPostsText: {
          fontStyle: 'italic',
          color: 'grey',
          fontSize: 18,
          textAlign: 'center',
          marginTop: 20
      }
})
