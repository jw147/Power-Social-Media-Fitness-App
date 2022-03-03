import React, {useState, useEffect, useContext, Component} from 'react'
import { StyleSheet, Text, View, ScrollView, Pressable, Image, ImageBackground } from 'react-native'

import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import {storage, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, set } from 'firebase/database';

export default function LeaderboardScreen({navigation}){
    const currentUser = firebase.auth().currentUser;
    const [users, setUsers] = useState([]);
    const [url, setURL] = useState("");
    
    const [isWeights, setIsWeights] = useState(true)
    const [loading, setLoading] = useState(true)

    const [benchPR, setBenchPR] = useState([])
    const [squatPR, setSquatPR] = useState([])
    const [deadliftPR, setDeadliftPR] = useState([])
    const [farthestRun, setFarthestRun] = useState([])
    const [fastestRun, setFastestRun] = useState([])
    const [farthestCycle, setFarthestCycle] = useState([])
    const [fastestCycle, setFastestCycle] = useState([])
    const [farthestWalk, setFarthestWalk] = useState([])
    const [fastestWalk, setFastestWalk] = useState([])
    const [calories, setCalories] = useState([])
    const [weight, setWeight] = useState([])
    const [cardio, setCardio] = useState([])
    const [deadliftPlacements, setDeadliftPlacements] = useState([])
    const [squatPlacements, setSquatPlacements] = useState([])
    const [benchPlacements, setBenchPlacements] = useState([])
    const [farthestRunPlacements, setFarthestRunPlacements] = useState([])
    const [fastestRunPlacements, setFastestRunPlacements] = useState([])
    const [farthestCyclePlacements, setFarthestCyclePlacements] = useState([])
    const [fastestCyclePlacements, setFastestCyclePlacements] = useState([])
    const [farthestWalkPlacements, setFarthestWalkPlacements] = useState([])
    const [fastestWalkPlacements, setFastestWalkPlacements] = useState([])
    const [caloriePlacements, setCaloriePlacements] = useState([])
    const [cardioPlacements, setCardioPlacements] = useState([])
    const [weightsPlacements, setWeightsPlacements] = useState([])

    
    useEffect( () => {
        const getDatabase = async() =>{
            let tempUserArray = [];
            let tempBench = [];
            let tempSquat = [];
            let tempDeadlift = [];
            let tempFarthestRun = [];
            let tempFastestRun = [];
            let tempFarthestCycle = [];
            let tempFastestCycle = [];
            let tempFarthestWalk = [];
            let tempFastestWalk = [];
            let tempCalories = [];
            let tempWeight = [];
            let tempCardio = [];
            let tD = [];
            let tB = [];
            let tS = [];
            let tFrR = [];
            let tFsR = [];
            let tFrC = [];
            let tFsC = [];
            let tFrW = [];
            let tFsW = [];
            let tCal = [];
            let tW = [];
            let tCar = [];
            await firebase.firestore()
                .collection('users').get()
                .then((docs) => {
                    docs.forEach(doc => {
                            let imageRef = getDownloadURL(ref(getStorage(), "images/" + doc.id));
                            imageRef
                                .then((url) => {
                                    tempUserArray.push({ displayName: doc.data().displayname, userName: doc.data().username, id: doc.id, url: url})
                                    setURL(url)
                                    setUsers(tempUserArray)
                                })
                                .catch((e) => console.log('getting downloadURL of image error => ', e));
                            var id = doc.id
                            firebase.firestore()
                            .collection('personalRecords')
                            .doc(id)
                            .collection('Barbell Bench Press').get()
                            .then(docs =>{
                                docs.forEach(doc=>{
                                    tempBench.push({weight:doc.data().weight, id: id})
                                    tB.push({weight:doc.data().weight, id: id})
                                })
                                tempBench.sort((a, b) => b.weight - a.weight)
                                tB.sort((a, b) => b.weight - a.weight)
                                setBenchPR(tempBench)
                                    var secondWeight = tB[1].weight
                                    var secondID = tB[1].id
                                    tB.splice(1,1)
                                    tB.unshift({weight: secondWeight, id: secondID})
                                
                                setBenchPlacements(tB)
                            })
                            firebase.firestore()
                            .collection('personalRecords')
                            .doc(id)
                            .collection('Barbell Squat').get()
                            .then(docs =>{
                                docs.forEach(doc=>{
                                    tempSquat.push({weight:doc.data().weight, id: id})
                                    tS.push({weight:doc.data().weight, id: id})
                                })
                                tempSquat.sort((a, b) => b.weight - a.weight)
                                tS.sort((a, b) => b.weight - a.weight)
                                setSquatPR(tempSquat)
                                    var secondWeight = tS[1].weight
                                    var secondID = tS[1].id
                                    tS.splice(1,1)
                                    tS.unshift({weight: secondWeight, id: secondID})
                                
                                setSquatPlacements(tS)
                            })
                            firebase.firestore()
                            .collection('personalRecords')
                            .doc(id)
                            .collection('Deadlift').get()
                            .then(docs =>{
                                docs.forEach(doc=>{
                                    tempDeadlift.push({weight:doc.data().weight, id: id})
                                    tD.push({weight:doc.data().weight, id: id})
                                })
                                tempDeadlift.sort((a, b) => b.weight - a.weight)
                                tD.sort((a, b) => b.weight - a.weight)
                                setDeadliftPR(tempDeadlift)
                                    var secondWeight = tD[1].weight
                                    var secondID = tD[1].id
                                    tD.splice(1,1)
                                    tD.unshift({weight: secondWeight, id: secondID})
                                
                                setDeadliftPlacements(tD)
                            })
                            firebase.firestore()
                            .collection('personalRecords')
                            .doc(id)
                            .collection('Run').get()
                            .then(docs =>{
                                docs.forEach(doc=>{
                                    if(doc.id === "DISTANCE"){
                                        tempFarthestRun.push({distance:doc.data().distance, id: id})
                                        tFrR.push({distance:doc.data().distance, id: id})
                                    }
                                    if(doc.id === "SPEED"){
                                        tempFastestRun.push({speed:doc.data().speed, id: id})
                                        tFsR.push({speed:doc.data().speed, id: id})
                                    }
                                })
                                tempFarthestRun.sort((a, b) => b.distance - a.distance)
                                tempFastestRun.sort((a, b) => b.speed - a.speed)
                                tFrR.sort((a, b) => b.distance - a.distance)
                                tFsR.sort((a, b) => b.speed - a.speed)
                                setFarthestRun(tempFarthestRun)
                                setFastestRun(tempFastestRun)
                                    var secondDistance = tFrR[1].distance
                                    var secondID = tFrR[1].id
                                    tFrR.splice(1,1)
                                    tFrR.unshift({distance: secondDistance, id: secondID})
                                
                                setFarthestRunPlacements(tFrR)
                                    var secondSpeed = tFsR[1].speed
                                    var secondID2 = tFsR[1].id
                                    tFsR.splice(1,1)
                                    tFsR.unshift({speed: secondSpeed, id: secondID2})
                                
                                setFastestRunPlacements(tFsR)
                                
                            })
                            firebase.firestore()
                            .collection('personalRecords')
                            .doc(id)
                            .collection('Cycle').get()
                            .then(docs =>{
                                docs.forEach(doc=>{
                                    if(doc.id === "DISTANCE"){
                                        tempFarthestCycle.push({distance:doc.data().distance, id: id})
                                        tFrC.push({distance:doc.data().distance, id: id})
                                    }
                                    if(doc.id === "SPEED"){
                                        tempFastestCycle.push({speed:doc.data().speed, id: id})
                                        tFsC.push({speed:doc.data().speed, id: id})
                                    }
                                })
                                tempFarthestCycle.sort((a, b) => b.distance - a.distance)
                                tempFastestCycle.sort((a, b) => b.speed - a.speed)
                                tFrC.sort((a, b) => b.distance - a.distance)
                                tFsC.sort((a, b) => b.speed - a.speed)
                                setFarthestCycle(tempFarthestCycle)
                                setFastestCycle(tempFastestCycle)
                                    var secondDistance = tFrC[1].distance
                                    var secondID = tFrC[1].id
                                    tFrC.splice(1,1)
                                    tFrC.unshift({distance: secondDistance, id: secondID})
                                
                                setFarthestCyclePlacements(tFrC)
                                    var secondSpeed = tFsC[1].speed
                                    var secondID2 = tFsC[1].id
                                    tFsC.splice(1,1)
                                    tFsC.unshift({speed: secondSpeed, id: secondID2})
                                
                                setFastestCyclePlacements(tFsC)
                                console.log("farthest cycle placements:")
                                console.log(tFrC)
                                console.log("farthest cycle Leaderboard: ")
                                console.log(tempFarthestCycle)
                            })
                            firebase.firestore()
                            .collection('personalRecords')
                            .doc(id)
                            .collection('Walk').get()
                            .then(docs =>{
                                docs.forEach(doc=>{
                                    if(doc.id === "DISTANCE"){
                                        tempFarthestWalk.push({distance:doc.data().distance, id: id})
                                        tFrW.push({distance:doc.data().distance, id: id})                                    
                                    }
                                    if(doc.id === "SPEED"){
                                        tempFastestWalk.push({speed:doc.data().speed, id: id})
                                        tFsW.push({speed:doc.data().speed, id: id})  
                                    }
                                })
                                tempFarthestWalk.sort((a, b) => b.distance - a.distance)
                                tempFastestWalk.sort((a, b) => b.speed - a.speed)
                                tFrW.sort((a, b) => b.distance - a.distance)
                                tFsW.sort((a, b) => b.speed - a.speed)
                                setFarthestWalk(tempFarthestWalk)
                                setFastestWalk(tempFastestWalk)
                                    var secondDistance = tFrW[1].distance
                                    var secondID = tFrW[1].id
                                    tFrW.splice(1,1)
                                    tFrW.unshift({distance: secondDistance, id: secondID})
                                
                                setFarthestWalkPlacements(tFrW)
                                    var secondSpeed = tFsW[1].speed
                                    var secondID2 = tFsW[1].id
                                    tFsW.splice(1,1)
                                    tFsW.unshift({speed: secondSpeed, id: secondID2})
                                
                                setFastestWalkPlacements(tFsW)
                            })
                            firebase.firestore()
                            .collection('rewardCounts')
                            .doc(id)
                            .collection('calorieCounters').get()
                            .then(docs =>{
                                docs.forEach(doc=>{
                                    tempCalories.push({ total: doc.data().total, id: id })
                                    tCal.push({ total: doc.data().total, id: id })                                    
                                })
                                tempCalories.sort((a, b) => b.total - a.total)
                                tCal.sort((a, b) => b.total - a.total)
                                setCalories(tempCalories)
                                    var secondWeight = tCal[1].total
                                    var secondID = tCal[1].id
                                    tCal.splice(1,1)
                                    tCal.unshift({total: secondWeight, id: secondID})
                                
                                setCaloriePlacements(tCal)
                            })
                            firebase.firestore()
                            .collection('rewardCounts')
                            .doc(id)
                            .collection('weightCounters').get()
                            .then(docs =>{
                                docs.forEach(doc=>{
                                    tempWeight.push({ total: doc.data().total, id: id })
                                    tW.push({ total: doc.data().total, id: id })                             
                                })
                                tempWeight.sort((a, b) => b.total - a.total)
                                tW.sort((a, b) => b.total - a.total)
                                setWeight(tempWeight)
                                    var secondWeight = tW[1].total
                                    var secondID = tW[1].id
                                    tW.splice(1,1)
                                    tW.unshift({total: secondWeight, id: secondID})
                                
                                setWeightsPlacements(tW)
                            })
                            firebase.firestore()
                            .collection('rewardCounts')
                            .doc(id)
                            .collection('cardioCounters').get()
                            .then(docs =>{
                                docs.forEach(doc=>{
                                    tempCardio.push({ total: doc.data().total, id: id })
                                    tCar.push({ total: doc.data().total, id: id })                               
                                })
                                tempCardio.sort((a, b) => b.total - a.total)
                                tCar.sort((a, b) => b.total - a.total)
                                setCardio(tempCardio)
                                var secondWeight = tCar[1].total
                                var secondID = tCar[1].id
                                tCar.splice(1,1)
                                tCar.unshift({total: secondWeight, id: secondID})
                            
                            setCardioPlacements(tCar)
                            })
                            })
                        })
                    }
                    getDatabase().then(()=>setLoading(false))
                    
                }, [loading]);
    if(loading){
        //add splash
        return(<Text>Loading</Text>)
    }

    return(
        <ScrollView style={styles.container}>
            {isWeights === true ?
            <View>
                <View style={{flexDirection:'row'}}>
                <Pressable style={styles.weightsButton}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Weights Leaderboard</Text>
                </Pressable>
                <Pressable style={styles.cardioNotButton} onPress={()=> setIsWeights(false)}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Cardio Leaderboard</Text>
                </Pressable>
                </View>
                <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Total Weight Lifted Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {weightsPlacements.map((d, key = 0)=>( weightsPlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        weightsPlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        weightsPlacements[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {weight.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.total}KG</Text>
                    </View>
                    ))
                ))

                }
                <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Deadlift Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {deadliftPlacements.map((d, key = 0)=>( deadliftPlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                            deadliftPlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                            deadliftPlacements[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {deadliftPR.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.weight}KG</Text>
                    </View>
                    ))
                ))

                }

                <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Squat Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {squatPlacements.map((d, key = 0)=>( squatPlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        squatPlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        squatPlacements[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {squatPR.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.weight}KG</Text>
                    </View>
                    ))
                ))

                }
                <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Bench Press Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {benchPlacements.map((d, key = 0)=>( benchPlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        benchPlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        benchPlacements[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {benchPR.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.weight}KG</Text>
                    </View>
                    ))
                ))

                }
            </View>
            
            :
            <View>
            <View style={{flexDirection:'row'}}>
                <Pressable style={styles.weightsNotButton} onPress={()=> setIsWeights(true)}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Weights Leaderboard</Text>
                </Pressable>
                <Pressable style={styles.cardioButton}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Cardio Leaderboard</Text>
                </Pressable>
            </View>
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Total Distance Travelled Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {cardioPlacements.map((d, key = 0)=>( cardioPlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        cardioPlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        cardioPlacements[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {cardio.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.total}KM</Text>
                    </View>
                    ))
                ))
                }
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Total Calories Burned Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {caloriePlacements.map((d, key = 0)=>( caloriePlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        caloriePlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        caloriePlacements[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {calories.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.total}kcal</Text>
                    </View>
                    ))
                ))
                }
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Farthest Run Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {farthestRunPlacements.map((d, key = 0)=>( farthestRunPlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        farthestRunPlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        farthestRunPlacements[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {farthestRun.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.distance}km</Text>
                    </View>
                    ))
                ))
                }
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Fastest Run Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {fastestRunPlacements.map((d, key = 0)=>( fastestRunPlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        fastestRunPlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        fastestRunPlacements[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {fastestRun.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.speed}km/hr</Text>
                    </View>
                    ))
                ))
                }
                <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Farthest Cycle Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {farthestCyclePlacements.map((d, key = 0)=>( farthestCyclePlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        farthestCyclePlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            : 
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        farthestCyclePlacements[2] == undefined && u.id === d.id ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            : 
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {farthestCycle.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.distance}km</Text>
                    </View>
                    ))
                ))
                }
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Fastest Cycle Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {fastestCyclePlacements.map((d, key = 0)=>( fastestCyclePlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        farthestCycle[1] == undefined?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        fastestCycle[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {fastestCycle.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.speed}km/hr</Text>
                    </View>
                    ))
                ))
                }

<Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Farthest Walk Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {farthestWalkPlacements.map((d, key = 0)=>( farthestWalkPlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        farthestWalkPlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        farthestWalkPlacements[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {farthestWalk.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.distance}km</Text>
                    </View>
                    ))
                ))
                }
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10, }}>Fastest Walk Leaderboard</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    {fastestWalkPlacements.map((d, key = 0)=>( fastestWalkPlacements.length > 0 &&
                        users.map((u, i) =>(
                        key === 0 && u.id === d.id ?
                        farthestWalkPlacements[1] == undefined ?
                            <ImageBackground style={styles.profilePicDefaultFirst}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicFirst}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                            :
                            <ImageBackground style={styles.profilePicDefaultSecond}
                                source={require('../../assets/profiledefault.png')}>
                                <Image
                                    style={styles.profilePicSecond}
                                    source={{ uri: u.url }}
                                />
                            </ImageBackground>
                        : key === 1 && u.id === d.id ?
                        fastestWalkPlacements[2] == undefined ?
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                                <Text style={{width:60}}></Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <ImageBackground style={styles.profilePicDefaultFirst}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicFirst}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                            </View>
                        : key === 2 && u.id === d.id ?
                                <ImageBackground style={styles.profilePicDefaultThird}
                                    source={require('../../assets/profiledefault.png')}>
                                    <Image
                                        style={styles.profilePicThird}
                                        source={{ uri: u.url }}
                                    />
                                </ImageBackground>
                        :<Text></Text>
                        ))
                        
                    ))}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Image source={require('./../../assets/second.png')} style={{ height: 90, width: 60, marginTop: 'auto'}}></Image>
                    <Image source={require('./../../assets/first.png')} style={{ height: 120, width: 60, marginTop: 'auto' }}></Image>
                    <Image source={require('./../../assets/third.png')} style={{ height: 60, width: 60, marginTop: 'auto' }}></Image>
                </View>
                {fastestWalk.map((de, key) =>(
                    users.map(u=>( u.id === de.id &&
                    <View style={{height:50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00a1d0', width: '90%', alignSelf:'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{key + 1}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 10}}>{u.displayName}</Text>
                        <Text style={{fontSize: 15, alignSelf: 'center', marginLeft: 'auto', marginRight: 10}}>{de.speed}km/hr</Text>
                    </View>
                    ))
                ))
                }
            </View>
            
            }
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
      weightsButton: {
        height: 70,
        width:'50%',
        borderRightWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
      },
      cardioNotButton: {
        height: 70,
        width:'50%',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
      },
      weightsNotButton: {
        height: 70,
        width:'50%',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
      },
      cardioButton: {
        height: 70,
        width:'50%',
        borderRightWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
      },
      profilePicDefaultFirst:{
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
      },
      profilePicFirst:{
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
      },
      profilePicDefaultSecond:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginRight: 10,
        marginTop:10
      },
      profilePicSecond:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginRight: 0,
        marginTop:0
      },
      profilePicDefaultThird:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 10,
        marginTop:10
      },
      profilePicThird:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 0,
        marginTop:0
      },
})
