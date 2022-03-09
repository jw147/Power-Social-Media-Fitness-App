import { StyleSheet, Text, View, Button, ScrollView, Pressable, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import { doc } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker'



export default function ProgressScreen({ navigation }) {
    
    const [workout, setWorkout] = useState(false)

    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    function onLoad(){
        if(value[0] === undefined){
            alert("Please Select a Workout from the Dropdown Menu")
        }else if(value.includes("Workout")){
            setWorkout(true)
            getDateWorkout();
        }else{
            setWorkout(false)
            getDateCardio();
        }
    }
    

    let dateArray = [];
    let calorieArray = [];
    const [date, setDate] = useState([])
    const [calories, setCalories] = useState([])
    let tempDisplayW = [];
    let tempWeightDisplay =[];
    const [displayWorkouts, setDisplayWorkouts] = useState([])
    const [displayWeight, setDisplayWeight] = useState([])

    const getDateWorkout = () => {
        firebase.firestore()
            .collection('savedWorkouts')
            .doc(currentUser.uid)
            .collection(value).get()
            .then((docs) => {
                docs.forEach((doc, index = 0) => {
                    dateArray.push(doc.data().date)
                    calorieArray.push(doc.data().calories)
                    let tempDate = doc.data().date
                    let tempSet = doc.id
                    firebase.firestore()
                        .collection('savedWorkouts')
                        .doc(currentUser.uid)
                        .collection(value)
                        .doc(doc.id).get()
                        .then(doc=> {
                            for(var x = 0; x < doc.data().exArray.length; x++){
                                tempDisplayW.push({date: doc.data().date, exercise: doc.data().exArray[x]})
                                firebase.firestore()
                                .collection('savedWorkouts')
                                .doc(currentUser.uid)
                                .collection(value)
                                .doc(tempSet)
                                .collection(doc.data().exArray[x]).get()
                                .then((docs) => {
                                    docs.forEach((doc) => {
                                            tempWeightDisplay.push({date: tempDate, exercise: doc.ref.parent.id, set: doc.id, reps: doc.data().Reps, weight: doc.data().Weight})
                                        })
                                    })
                            }
                        })
                    })
                    setDate(dateArray)
                    setCalories(calorieArray)
                    setDisplayWorkouts(tempDisplayW)
                    setDisplayWeight(tempWeightDisplay)
            })
        }

    const [open, setOpen] = useState(false);

    const [value, setValue] = useState([]);

    let tempPW = []
    const [prevWorkouts, setPrevWorkouts] = useState([])

    function getPreviousWorkouts(documentSnapshot) {
        return documentSnapshot.get('idArray');
      }    
    
    const GetPreviousWorkoutInfo = 
        firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).get()
        .then(
            documentSnapshot => getPreviousWorkouts(documentSnapshot))
        .then(idArray => {
            idArray.forEach((doc, index) => {
                tempPW.push({label: doc + "s", value: doc})
            })
            setPrevWorkouts(tempPW);
        });


    let tempDistance = [];
    let tempSpeed = [];
    let tempTime = [];
    const [distance, setDistance] = useState([])
    const [speed, setSpeed] = useState([])
    const [time, setTime] = useState([])

    const getDateCardio = () => {
        firebase.firestore()
            .collection('savedWorkouts')
            .doc(currentUser.uid)
            .collection(value).get()
            .then((docs) => {
                docs.forEach((doc, index = 0) => {
                    dateArray.push(doc.data().Date)
                    calorieArray.push(doc.data().Calories)
                    tempDistance.push(doc.data().Distance)
                    tempSpeed.push(doc.data().Speed)
                    tempTime.push(doc.data().Time)
                })
                setDate(dateArray)
                setCalories(calorieArray)
                setDistance(tempDistance)
                setSpeed(tempSpeed)
                setTime(tempTime)
            })
    }

    return (
        <View style={styles.container}>
                <DropDownPicker
                    style={{ marginTop: 10 }}
                    multiple={false}
                    open={open}
                    value={value}
                    items={prevWorkouts}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setPrevWorkouts}
                    placeholder='Select a Workout'
                />
                <Pressable style={styles.loadButton} onPress={() => onLoad()}>
                    <Text style={{ textAlign: 'center', color: 'white' }}> Load Progress</Text>
                </Pressable>
            <ScrollView style={styles.container}>
                {workout === true ? date.flatMap((input, key,) => (
                    <View style={styles.exerciseContainer}>
                        <Text style={styles.dateTitle}>{date[key]}</Text>
                        
                        {displayWorkouts.flatMap((_input, KEY) => (date[key]===_input.date &&
                        <View style={{alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 5}}>
                                <Text style={{marginLeft: 5, width: 150, fontWeight: 'bold'}}>{_input.exercise}</Text>
                                
                                <Text style={{marginEnd: 20, fontWeight: 'bold'}}>Set</Text>
                                <Text style={{marginEnd: 20, fontWeight: 'bold'}}>Reps</Text>
                                <Text style={{marginEnd: 20, fontWeight: 'bold'}}>Weight</Text>
                            </View>
                            {displayWeight.flatMap((ex, index) => (_input.exercise === ex.exercise && _input.date === ex.date ?
                            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                <Text style={{marginTop: 5, marginEnd: 35, marginLeft: 165}}>{ex.set}</Text>
                                <Text style={{marginTop: 5, marginEnd: 40}}>{ex.reps}</Text>
                                <Text style={{marginTop: 5, marginEnd: 30}}>{ex.weight}kg</Text>
                            </View>
                            : <View></View>))}
                        </View>
                        ))}
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{height: 15, width: 15}} source={require('../../assets/burn.png')}></Image>
                            <Text style={{marginLeft: 5}}>{calories[key]} kcal</Text>
                        </View>
                    </View>
                    )): date.flatMap((input, key,) => (
                        <View style={styles.exerciseContainer}>
                            <Text style={styles.dateTitle}>{date[key]}</Text>
                            <View style={{flexDirection: 'row'}}>
                                {value.includes("Run") && <Image style={{marginLeft: 10}} source={require('../../assets/run.png')}></Image>}
                                {value.includes("Cycle") && <Image style={{marginLeft: 10}} source={require('../../assets/cycle.png')}></Image>}
                                {value.includes("Walk") && <Image style={{marginLeft: 10}} source={require('../../assets/walk.png')}></Image>}
                                <View style={{marginLeft: 70, marginTop: 20}}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{fontWeight: 'bold', fontSize: 15}}>Speed</Text>
                                        <Text style={{fontWeight: 'bold', fontSize: 15, marginLeft: 30}}>Distance</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{fontSize: 15}}>{speed[key]}km/h</Text>
                                        <Text style={{fontSize: 15, marginLeft: 40}}>{distance[key]}km</Text>
                                    </View>
                                    <View style={{alignItems:'center'}}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginTop: 10 }}>Time</Text>
                                        <Text style={{fontSize: 15}}>{time[key]}minutes</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Image style={{height: 15, width: 15}} source={require('../../assets/burn.png')}></Image>
                                <Text style={{marginLeft: 5}}>{calories[key]} kcal</Text>
                            </View>
                        </View>
                        ))}
                
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
        borderWidth: 1,
        borderColor: 'black',
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
    }
});
