import React, {useState, useEffect, useContext} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Row, Alert, Pressable, ImageBackground, Modal } from 'react-native'
import { auth } from '../../firebase'
import { useNavigation } from '@react-navigation/core'
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import * as ImagePicker from 'expo-image-picker';
import {storage, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import LottieView from 'lottie-react-native';

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

    const [onLoad, setOnLoad] = useState(false);
    const [friendArray, setFriendArray] = useState([]);
    const [pendingArray, setPendingArray] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [pendUsers, setPendUsers] = useState([]);
    const [url, setURL] = useState("");
    let tempUserArray = [];
    let tempPendArray = [];
    const [tCardio, setTCardio] = useState([]);
    const [tWeights, setTWeights] = useState([]);
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true) 
    useEffect(() => {
      const getDatabase = async () => {
        await firebase.firestore()
            .collection('users').get()
            .then((docs) => {
                    docs.forEach(doc => {
                        if (doc.id == currentUser.uid) {
                            if(doc.data().inbox != null){
                                setPendingArray(doc.data().inbox)
                            }
                            if(doc.data().friends != null){
                                setFriendArray(doc.data().friends)
                                
                            }
                        }
                        if(friendArray.includes(doc.id)){
                            let imageRef = getDownloadURL(ref(getStorage(), "images/" + doc.id));
                            imageRef
                            .then((url) => {
                                tempUserArray.push({ displayName: doc.data().displayname, userName: doc.data().username, id: doc.id, url: url, bio: doc.data().bio })
                                setURL(url)
                            })
                            .catch((e) => console.log('getting downloadURL of image error => ', e));
                        }
                        setUsers(tempUserArray)
                    })

        let tempRewardCount = 0;
        let tempRewards = [];
        firebase.firestore()
        .collection('rewards')
        .doc(currentUser.uid)
        .collection('distance').get()
        .then(docs=>{
          docs.forEach(doc=>{
            if(doc.data().two === true){
              tempRewardCount++;
              tempRewards.push({url: '../../assets/rewards/2km.png', description: 'You Have Travelled 2km!', id:'2km', priority: 16})
              if(doc.data().five === true){
                tempRewardCount++;
                tempRewards.push({url: '../../assets/rewards/5km.png', description: 'You Have Travelled 5km!', id:'5km', priority: 14})
                if(doc.data().ten === true){
                  tempRewardCount++;
                  tempRewards.push({url: '../../assets/rewards/10km.png', description: 'You Have Travelled 10km!', id:'10km', priority: 11})
                  if(doc.data().fifteen === true){
                    tempRewardCount++;
                    tempRewards.push({url: '../../assets/rewards/15km.png', description: 'You Have Travelled 15km!', id:'15km', priority: 8})
                    if(doc.data().twenty === true){
                      tempRewardCount++;
                      tempRewards.push({url: '../../assets/rewards/20km.png', description: 'You Have Travelled 20km!', id:'20km', priority: 5})
                      if(doc.data().thirty === true){
                        tempRewardCount++;
                        tempRewards.push({url: '../../assets/rewards/30km.png', description: 'You Have Travelled 30km!', id:'30km', priority: 2})
                      }
                    }
                  }
                }
              }
            }
          })
          firebase.firestore()
            .collection('rewards')
            .doc(currentUser.uid)
            .collection('weights').get()
            .then(docs => {
              docs.forEach(doc => {
                if (doc.data().one === true) {
                  tempRewardCount++;
                  tempRewards.push({url: '../../assets/rewards/1ton.png', description: 'You Have Lifted 1ton!', id:'1ton', priority: 13})
                  if (doc.data().two === true) {
                    tempRewardCount++;
                    tempRewards.push({url: '../../assets/rewards/2tons.png', description: 'You Have Lifted 2ton!', id:'2ton', priority: 10})
                    if (doc.data().ten === true) {
                      tempRewardCount++;
                      tempRewards.push({url: '../../assets/rewards/10tons.png', description: 'You Have Lifted 10tons!', id:'10ton', priority: 7})
                      if (doc.data().twenty === true) {
                        tempRewardCount++;
                        tempRewards.push({url: '../../assets/rewards/20tons.png', description: 'You Have Lifted 20tons!', id:'20ton', priority: 4})
                        if (doc.data().fifty === true) {
                          tempRewardCount++;
                          tempRewards.push({url: '../../assets/rewards/50ton.png', description: 'You Have Lifted 50tons!', id:'50ton', priority: 1})
                        }
                      }
                    }
                  }
                }
              })
              firebase.firestore()
                .collection('rewards')
                .doc(currentUser.uid)
                .collection('calories').get()
                .then(docs => {
                  docs.forEach(doc => {
                    if (doc.data().half === true) {
                      tempRewardCount++;
                      tempRewards.push({url: '../../assets/rewards/500kcal.png', description: 'You Have Burned 500kcal!', id:'halfkcal', priority: 18})
                      if (doc.data().one === true) {
                        tempRewardCount++;
                        tempRewards.push({url: '../../assets/rewards/1Kkcal.png', description: 'You Have Burned 1000kcal!', id:'1Kkcal', priority: 17})
                        if (doc.data().two === true) {
                          tempRewardCount++;
                          tempRewards.push({url: '../../assets/rewards/2Kkcal.png', description: 'You Have Burned 2000kcal!', id:'2Kkcal', priority: 15})
                          if (doc.data().threehalf === true) {
                            tempRewardCount++;
                            tempRewards.push({url: '../../assets/rewards/3halfKkcal.png', description: 'You Have Burned 3500kcal!', id:'3halfKkcal', priority: 12})
                            if (doc.data().five === true) {
                              tempRewardCount++;
                              tempRewards.push({url: '../../assets/rewards/5Kkcal.png', description: 'You Have Burned 5000kcal!', id:'5Kkcal', priority: 9})
                              if (doc.data().seven === true) {
                                tempRewardCount++;
                                tempRewards.push({url: '../../assets/rewards/7Kkcal.png', description: 'You Have Burned 7000kcal!', id:'7Kkcal', priority: 6})
                                if (doc.data().ten === true) {
                                  tempRewardCount++;
                                  tempRewards.push({url: '../../assets/rewards/10Kkcal.png', description: 'You Have Burned 10000kcal!', id:'10Kkcal', priority: 3})
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  })
                  tempRewards.sort((a, b) => a.priority - b.priority)
                  setRewardCount(tempRewardCount)
                  setRewards(tempRewards)
                })
            })
          })
                    
            });

      let tempWeightsArray = [];
      let tempCardioArray = [];
      var tempPosts = [];
      await firebase.firestore()
        .collection('posts')
        .doc(currentUser.uid)
        .collection('posts').get()
        .then((docs) => {
          docs.forEach(doc => {
            if (doc.data().post == null) {

              tempCardioArray.push({
                calories: doc.data().calories, wName: doc.data().cardio, date: doc.data().date.seconds, distance: doc.data().distance,
                speed: doc.data().speed, time: doc.data().time, id: currentUser.uid
              })
            }
            else {
              tempWeightsArray.push({ weights: doc.data().post, id: currentUser.uid, date: doc.data().post[0].date.seconds })
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
          setPosts(tempPosts);
        })
      }
      getDatabase().then(()=>setLoading(false))
      }, [loading]);

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
                                    })
                                    .catch((e) => console.log('getting downloadURL of image error => ', e));
                            }

                        })
                        setUsers(tempUserArray)
                        setPendUsers(tempPendArray)
                        }
                });
                setOnLoad(true);
        }
    }
    
    function navigatePages(givenID){
        if(givenID != currentUser.uid){
            setModalVisible(false)
            navigation.navigate('View Profile', { userID: givenID })
        }else{
            
        }
    }

  let temppostCount = 0;
  const [postCount, setPostCount] = useState(0)
  const getPostCount = firebase.firestore()
      .collection('posts')
      .doc(currentUser.uid)
      .collection('posts').get()
      .then(query => {
        temppostCount = query.size
        setPostCount(temppostCount)
      });
  
  const [isPB, setIsPB] = useState(true)
  const [benchPR, setBenchPR] = useState("")
  const [benchDate, setBenchDate] = useState("")
  const getBench = firebase.firestore()
      .collection("personalRecords")
      .doc(currentUser.uid)
      .collection("Barbell Bench Press").get()
      .then(docs=>{
        docs.forEach(doc=>{
          //tempBench.push({weight:doc.data().weight, date:doc.data().date})
          setBenchPR(doc.data().weight);
          setBenchDate(doc.data().date)
          
        })
      })

  const [squatPR, setSquatPR] = useState("")
  const [squatDate, setSquatDate] = useState("")
  const getSquat = firebase.firestore()
    .collection("personalRecords")
    .doc(currentUser.uid)
    .collection("Barbell Squat").get()
    .then(docs => {
      docs.forEach(doc => {
        setSquatPR(doc.data().weight);
        setSquatDate(doc.data().date)

      })
    })

  const [deadliftPR, setDeadliftPR] = useState("")
  const [deadliftDate, setDeadliftDate] = useState("")
  const getDeadlift = firebase.firestore()
    .collection("personalRecords")
    .doc(currentUser.uid)
    .collection("Deadlift").get()
    .then(docs => {
      docs.forEach(doc => {
        setDeadliftPR(doc.data().weight);
        setDeadliftDate(doc.data().date)
      })
    })

  const [speedRunSpeed, setSpeedRunSpeed] = useState("")
  const [speedRunTime, setSpeedRunTime] = useState("")
  const [speedRunDistance, setSpeedRunDistance] = useState("")
  const [speedRunDate, setSpeedRunDate] = useState("")
  const getSpeedRun = firebase.firestore()
    .collection("personalRecords")
    .doc(currentUser.uid)
    .collection("Run").get()
    .then(docs => {
      docs.forEach(doc => {
        if(doc.id === "SPEED"){
          setSpeedRunSpeed(doc.data().speed);
          setSpeedRunTime(doc.data().time);
          setSpeedRunDistance(doc.data().distance);
          setSpeedRunDate(doc.data().date)
        }
      })
    })

  const [distanceRunSpeed, setDistanceRunSpeed] = useState("")
  const [distanceRunTime, setDistanceRunTime] = useState("")
  const [distanceRunDistance, setDistanceRunDistance] = useState("")
  const [distanceRunDate, setDistanceRunDate] = useState("")
  const getDistanceRun = firebase.firestore()
    .collection("personalRecords")
    .doc(currentUser.uid)
    .collection("Run").get()
    .then(docs => {
      docs.forEach(doc => {
        if (doc.id === "DISTANCE") {
          setDistanceRunSpeed(doc.data().speed);
          setDistanceRunTime(doc.data().time);
          setDistanceRunDistance(doc.data().distance);
          setDistanceRunDate(doc.data().date);
        }
      })
    })

  const [speedCycleSpeed, setSpeedCycleSpeed] = useState("")
  const [speedCycleTime, setSpeedCycleTime] = useState("")
  const [speedCycleDistance, setSpeedCycleDistance] = useState("")
  const [speedCycleDate, setSpeedCycleDate] = useState("")
  const getSpeedCycle = firebase.firestore()
    .collection("personalRecords")
    .doc(currentUser.uid)
    .collection("Cycle").get()
    .then(docs => {
      docs.forEach(doc => {
        if (doc.id === "SPEED") {
          setSpeedCycleSpeed(doc.data().speed);
          setSpeedCycleTime(doc.data().time);
          setSpeedCycleDistance(doc.data().distance);
          setSpeedCycleDate(doc.data().date)
        }
      })
    })

  const [distanceCycleSpeed, setDistanceCycleSpeed] = useState("")
  const [distanceCycleTime, setDistanceCycleTime] = useState("")
  const [distanceCycleDistance, setDistanceCycleDistance] = useState("")
  const [distanceCycleDate, setDistanceCycleDate] = useState("")
  const getDistanceCycle = firebase.firestore()
    .collection("personalRecords")
    .doc(currentUser.uid)
    .collection("Cycle").get()
    .then(docs => {
      docs.forEach(doc => {
        if (doc.id === "DISTANCE") {
          setDistanceCycleSpeed(doc.data().speed);
          setDistanceCycleTime(doc.data().time);
          setDistanceCycleDistance(doc.data().distance);
          setDistanceCycleDate(doc.data().date);
        }
      })
    })

  const [speedWalkSpeed, setSpeedWalkSpeed] = useState("")
  const [speedWalkTime, setSpeedWalkTime] = useState("")
  const [speedWalkDistance, setSpeedWalkDistance] = useState("")
  const [speedWalkDate, setSpeedWalkDate] = useState("")
  const getSpeedWalk = firebase.firestore()
    .collection("personalRecords")
    .doc(currentUser.uid)
    .collection("Walk").get()
    .then(docs => {
      docs.forEach(doc => {
        if (doc.id === "SPEED") {
          setSpeedWalkSpeed(doc.data().speed);
          setSpeedWalkTime(doc.data().time);
          setSpeedWalkDistance(doc.data().distance);
          setSpeedWalkDate(doc.data().date)
        }
      })
    })

  const [distanceWalkSpeed, setDistanceWalkSpeed] = useState("")
  const [distanceWalkTime, setDistanceWalkTime] = useState("")
  const [distanceWalkDistance, setDistanceWalkDistance] = useState("")
  const [distanceWalkDate, setDistanceWalkDate] = useState("")
  const getDistanceWalk = firebase.firestore()
    .collection("personalRecords")
    .doc(currentUser.uid)
    .collection("Walk").get()
    .then(docs => {
      docs.forEach(doc => {
        if (doc.id === "DISTANCE") {
          setDistanceWalkSpeed(doc.data().speed);
          setDistanceWalkTime(doc.data().time);
          setDistanceWalkDistance(doc.data().distance);
          setDistanceWalkDate(doc.data().date);
        }
      })
    })


  const [isRewardVisible, setIsRewardVisible] = useState(false)
  const [rewardCount, setRewardCount] = useState(0)
  const [rewards, setRewards] = useState([])
  function loadRewards(){
    setIsRewardVisible(true)
  }

  if (loading) {
    //add splash
    return (<LottieView source={require('../../loadingAnimation.json')} autoPlay loop />)
    } 
    return(
        <ScrollView style={styles.container}>
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
                    >
                    <Text style={styles.infoText}>{postCount}{"\n"}Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => loadRewards()}>
                    <Text style={styles.infoText}>{rewardCount}{"\n"}Rewards</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => loadFriends()}>
                    <Text style={styles.infoText}>{friendArray.length}{"\n"}Friends</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bioContainer}>
                <Text style={styles.displayNameText}>{displayName}</Text>
                <Text style={styles.bioText}>{Bio}</Text>
                <TouchableOpacity 
                style={styles.editButton}
                onPress={()=> navigation.navigate("Edit Profile")}>
                    <Text style={styles.editText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
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
            <Text style={{marginTop:10, alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10,}}>Pending Friend Requests ({pendUsers.length})</Text>
            {pendUsers.map((u, key) => ( 
                
                    <Pressable style={styles.userContainer} onPress={() => navigatePages(u.id)}>
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
                    </Pressable>
                
            ))}
                <Text style={{marginTop:10, alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10,}}>Friends</Text>
            {users.map((u, key) => ( 
                
                    <Pressable style={styles.userContainer} onPress={() => navigatePages(u.id)}>
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
                    </Pressable>
                
            ))}
                <Pressable
                  style={[styles.button, styles.buttonCloseModal]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={{ color: 'white' }}>Close</Text>
                </Pressable>
              </ScrollView>
            </View>
          </Modal>
      {isPB === true ?
      <View>
        <View style={{flexDirection:'row'}}>
          <Pressable style={styles.PRButton} onPress={()=>setIsPB(true)}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, alignSelf: 'center' }}>Personal Bests</Text>
          </Pressable>
          <Pressable style={styles.PostButtonNot} onPress={()=>setIsPB(false)}>
            <Text style={{ fontSize: 17, alignSelf: 'center' }}>Posted Workouts</Text>
          </Pressable>
        </View>
        { deadliftPR != "" || squatPR != "" || benchPR != "" ?
        <Text style={{textAlign: 'center', marginTop: 10, fontSize: 17, fontWeight: 'bold'}}>Weight Personal Bests</Text>
        :<Text></Text>
        } 
        {
          deadliftPR != "" &&
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Image source={require('../../assets/DEADLIFT.png')} style={styles.BenchImage}></Image>
            <View style={{ justifyContent: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>Deadlift One Rep Max</Text>
            <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{deadliftDate.substring(0,15)}</Text>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{deadliftPR}KG</Text>
            </View>
          </View>
        }
        {
          squatPR != "" &&
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Image source={require('../../assets/SQUAT.png')} style={styles.BenchImage}></Image>
            <View style={{ justifyContent: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>Squat One Rep Max</Text>
            <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{squatDate.substring(0,15)}</Text>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{squatPR}KG</Text>
            </View>
          </View>
        }
        {
          benchPR != "" &&
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Image source={require('../../assets/BENCH.png')} style={styles.BenchImage}></Image>
            <View style={{ justifyContent: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>Bench One Rep Max</Text>
            <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{benchDate.substring(0,15)}</Text>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{benchPR}KG</Text>
            </View>
          </View>
        }
        { speedRunDate != "" || speedCycleDate != "" || speedWalkDate != "" ?
        <Text style={{textAlign: 'center', marginTop: 10, fontSize: 17, fontWeight: 'bold'}}>Cardio Personal Bests</Text>
        :<Text></Text>
        } 
        {
          speedRunDate != "" &&
          <View style={{flexDirection: 'row', marginTop: 10, alignSelf: 'center'}}>
            <View style={{ justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>Fastest Run</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, textAlign: 'center'}}>{speedRunDate.substring(0,15)}</Text>
              <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>{speedRunSpeed}km/hr</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, textAlign: 'center'}}>{speedRunDistance}km</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, textAlign: 'center'}}>{speedRunTime}mins</Text>
            </View>
            <View style={{ justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>Farthest Run</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceRunDate.substring(0,15)}</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceRunSpeed}km/hr</Text>
              <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceRunDistance}km</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceRunTime}mins</Text>
            </View>
          </View>
        }
        {
          speedCycleDate != "" &&
          <View style={{flexDirection: 'row', marginTop: 10, alignSelf: 'center'}}>
            <View style={{ justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>Fastest Cycle</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, textAlign: 'center'}}>{speedCycleDate.substring(0,15)}</Text>
              <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>{speedCycleSpeed}km/hr</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, textAlign: 'center'}}>{speedCycleDistance}km</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, textAlign: 'center'}}>{speedCycleTime}mins</Text>
            </View>
            <View style={{ justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>Farthest Cycle</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceCycleDate.substring(0,15)}</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceCycleSpeed}km/hr</Text>
              <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceCycleDistance}km</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceCycleTime}mins</Text>
            </View>
          </View>
        }
        {
          speedWalkDate != "" &&
          <View style={{flexDirection: 'row', marginTop: 10, alignSelf: 'center'}}>
            <View style={{ justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>Fastest Walk</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, textAlign: 'center'}}>{speedWalkDate.substring(0,15)}</Text>
              <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>{speedWalkSpeed}km/hr</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, textAlign: 'center'}}>{speedWalkDistance}km</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, textAlign: 'center'}}>{speedWalkTime}mins</Text>
            </View>
            <View style={{ justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>Farthest Walk</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceWalkDate.substring(0,15)}</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceWalkSpeed}km/hr</Text>
              <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceWalkDistance}km</Text>
              <Text style={{fontStyle: 'italic', fontSize: 16, marginLeft: 20, textAlign: 'center'}}>{distanceWalkTime}mins</Text>
            </View>
          </View>
        }
      </View>
        :
        <View>
        <View style={{flexDirection:'row'}}>
          <Pressable style={styles.PRButtonNot} onPress={()=>setIsPB(true)}>
            <Text style={{  fontSize: 17, alignSelf: 'center' }}>Personal Bests</Text>
          </Pressable>
          <Pressable style={styles.PostButton} onPress={()=>setIsPB(false)}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, alignSelf: 'center' }}>Posted Workouts</Text>
          </Pressable>
        </View>
        { posts.length > 0 && posts.map((p, key) => (    p.weights === undefined ?
                <View key={key} style={styles.exerciseContainer}>
                <View style={{flexDirection: 'row'}}>
                    <ImageBackground style={styles.profilePicDefaultPost}
                        source={require('../../assets/profiledefault.png')}>
                        <Image
                            style={styles.profilePicPost}
                            source={{ uri: image }}
                        />
                    </ImageBackground>
                    <View style={{ justifyContent: 'center', marginBottom: 5}}>
                        <Text style={styles.displayNameText}>{displayName}'s {p.wName}</Text>
                        <Text style={styles.userNameText}>{userName}</Text>
                    </View>
                </View>
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
                
                <View style={{flexDirection: 'row'}}>
                    <ImageBackground style={styles.profilePicDefaultPost}
                        source={require('../../assets/profiledefault.png')}>
                        <Image
                            style={styles.profilePicPost}
                            source={{ uri: image }}
                        />
                    </ImageBackground>
                    <View style={{ justifyContent: 'center', marginBottom: 5}}>
                        <Text style={styles.displayNameText}>{displayName}'s {p.weights[0].workout}</Text>
                        <Text style={styles.userNameText}>{userName}</Text>
                    </View>
                </View>
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
            ))}

        </View>
      }
      <Modal
            animationType="slide"
            transparent={true}
            visible={isRewardVisible}
            onRequestClose={() => {
              setIsRewardVisible(!isRewardVisible);
            }}
          >
            <View style={styles.rewardContainerView}>
            <ScrollView style={styles.rewardView}>
            {rewards.length === 0 &&
                <Text style={{fontSize:15, marginTop: 100, marginLeft: 5, textAlign: 'center'}}>You do not currently{"\n"}have any rewards</Text>
            }
            {rewards.map(r=>( r.id === "1ton"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/1ton.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "2ton"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/2tons.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "10ton"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/10tons.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "20ton"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/20tons.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "50ton"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/50tons.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "halfkcal"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/500kcal.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "1Kkcal"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/1Kkcal.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "2Kkcal"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/2Kkcal.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "3halfKkcal"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/3halfKkcal.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "5Kkcal"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/5Kkcal.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "7Kkcal"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/7Kkcal.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "10Kkcal"?
               <View style={{flexDirection:'row'}}>
                 <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/10Kkcal.png')}></Image>
                 <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
               </View>
               : r.id === "2km"?
               <View style={{flexDirection:'row'}}>
                 <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/2km.png')}></Image>
                 <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
               </View>
              : r.id === "5km"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/5km.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "10km"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/10km.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "15km"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/15km.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "20km"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/20km.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              : r.id === "30km"?
              <View style={{flexDirection:'row'}}>
                <Image style={{marginTop: 10, marginLeft: 10, height: 80, width: 70, }} source={require('../../assets/Rewards/30km.png')}></Image>
                <Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{r.description}</Text>
              </View>
              :<Text></Text>
            ))}
            <Pressable
                  style={[styles.button, styles.buttonCloseModal]}
                  onPress={() => setIsRewardVisible(!isRewardVisible)}
                >
                  <Text style={{ color: 'white' }}>Close</Text>
                </Pressable>
            </ScrollView>
            </View>
          </Modal>
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
      },
      friendsContainerView: {
        flex: 1,
        marginTop: 22,
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
      },
      friendsView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        width: 300,
        
      },
      rewardContainerView: {
        flex: 1,
        marginTop: 22,
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
      },
      rewardView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        width: 320,
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
      userContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        width: '95%',
        padding: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor: 'black',
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
      PRButton: {
        height: 60,
        width:'50%',
        borderRightWidth: 1,
        borderRightColor: 'black',
        justifyContent: 'center'
      },
      PostButtonNot: {
        height: 60,
        width:'50%',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: 'black'
      },
      PRButtonNot: {
        height: 60,
        width:'50%',
        borderRightWidth: 1,
        borderRightColor: 'black',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: 'black',
      },
      PostButton: {
        height: 60,
        width:'50%',
        justifyContent: 'center',
      },
      BenchImage: {
        marginLeft: 20,
        marginTop: 10
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
      profilePicDefaultPost:{
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 10,
      },
      profilePicPost:{
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 0,
      },
})
