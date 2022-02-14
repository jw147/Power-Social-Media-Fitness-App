import React, {Component, useEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Button, TextInput, Alert, Switch } from 'react-native'
import exercises from './../../weightExercises.json';
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import DropDownPicker from 'react-native-dropdown-picker'
import PropTypes from 'prop-types';
import { doc, getDoc } from "firebase/firestore";
import MapView from 'react-native-maps';
import Marker from 'react-native-maps';
import * as Location from 'expo-location';



let tempSet = [];
let tempSetWeight = [];
let tempSetReps = [];
let tempEx = [];

let cardioDBIndex = 1;
let weightDBIndex = 1;
let weightsTitle = "";

let previousCount = 1;

var count = 0;
var calories = 0;

var tMin = 0
var tSec = 0
var firstTimer = false

export default function ExerciseScreen({ navigation }) {
  const date = new Date()

  const [previousWeight, SetPreviousWeight] = useState("-");
  

  //-----------------------------------------------------Timer-----------------------------------------------------
  function startTimer(){
    if(firstTimer === false){
      firstTimer = true;
      const interval = setInterval(() => {
  
        if (tSec < 60) {
          tSec++
        }
        if (tSec === 60) {
          tMin++
          tSec = 0
        }
      }, 1000);
    }else{
      tSec = -1
      tMin = 0
    }
    
  }

  //-----------------------------------------------------Hide Views-----------------------------------------------------
  const [selectHidden, setSelectHidden] = useState(false);
  const [weightsHidden, setWeightsHidden] = useState(true);
  const [runningHidden, setRunningHidden] = useState(true);
  const [tRunningHidden, setTRunningHidden] = useState(true);
  const [oRunningHidden, setORunningHidden] = useState(true);
  const [cyclingHidden, setCyclingHidden] = useState(true);
  const [sCyclingHidden, setSCyclingHidden] = useState(true);
  const [oCyclingHidden, setOCyclingHidden] = useState(true);
  const [walkingHidden, setWalkingHidden] = useState(true);

  const HideView = (props) => {
    const { children, hide, style } = props;
    if (hide) {
      return null;
    }
    return (
      <View {...props} style={style}>
        { children }
      </View>
    );
  };
  
  HideView.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.element,
      ])),
    ]).isRequired,
    hide: PropTypes.bool,
  };

  
  
  //-----------------------------------------------------Database Work-----------------------------------------------------
  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();

  const [displayName, setDisplayName] = useState('')

  function getDisplayName(documentSnapshot) {
    return documentSnapshot.get('displayname');
  }

  const gettingDisplayName = db.collection('users').doc(currentUser.uid).get()
    .then(
      documentSnapshot => getDisplayName(documentSnapshot))
    .then(displayname => {
      if (displayname === null) { } else {
        setDisplayName(displayname);
      }
    });

  //-----------------------------------------------------Exercise Arrays-----------------------------------------------------
  let bicepsArray = []
  let backArray = []
  let lowerBackArray = []
  let upperBackArray = []
  let tricepsArray = []
  let chestArray = []
  let shouldersArray = []
  let legsArray = []
  let absArray = []
  let allArray = []

  const fillBicepArray = exercises.weights.biceps.map(ex => {
    bicepsArray.push(ex.name)
    allArray.push(ex.name)
  })

  const fillBackArray = exercises.weights.back.map(ex => {
    backArray.push(ex.name)
    if (ex.group === "Upper Back") {
      upperBackArray.push(ex.name)
      allArray.push(ex.name)
    } else {
      lowerBackArray.push(ex.name)
      allArray.push(ex.name)
    }
  })

  const fillTricepArray = exercises.weights.triceps.map(ex => {
    tricepsArray.push(ex.name)
    allArray.push(ex.name)
  })

  const fillChestArray = exercises.weights.chest.map(ex => {
    chestArray.push(ex.name)
    allArray.push(ex.name)
  })

  const fillShouldersArray = exercises.weights.shoulders.map(ex => {
    shouldersArray.push(ex.name)
    allArray.push(ex.name)
  })

  const fillLegsArray = exercises.weights.legs.map(ex => {
    legsArray.push(ex.name)
    allArray.push(ex.name)
  })

  const fillAbsArray = exercises.weights.abs.map(ex => {
    absArray.push(ex.name)
    allArray.push(ex.name)
  })


  //-----------------------------------------------------DropDownMenus-----------------------------------------------------
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState([]);

  const [items, setItems] = useState([
    { label: 'Back', value: 'Back '},
    { label: 'Biceps', value: 'Biceps '},
    { label: 'Triceps', value: 'Triceps '},
    { label: 'Chest', value: 'Chest '},
    { label: 'Shoulders', value: 'Shoulders '},
    { label: 'Legs', value: 'Legs '},
    { label: 'Abs', value: 'Abs '}
  ]);

  const [openC, setOpenC] = useState(false);

  const [valueCardio, setValueCardio] = useState([]);

  const [itemsCardio, setItemsCardio] = useState([
    { label: 'Running', value: 'running'},
    { label: 'Cycling', value: 'cycling'},
    { label: 'Walking', value: 'walking'},
    { label: 'Enter Your Own Exercise', value: 'eyoe'}
  ]);

  //-----------------------------------------------------Weights-----------------------------------------------------
  function workoutTitle(){
    var x = "";
    if(value.length === 7){
      weightsTitle = "Full Body"
    }else{
      for(var i = 0; i < value.length; i++){
        if(i == 0){
          x = value[i];
        }
        else if(i>0 && i < value.length - 1){
          x = x + ", " + value[i]
        }
        else{
          x = x + "& " + value[i]
        }
      }
      weightsTitle = x + "Workout"
    }
  }

  

  function selectToWeights(){
    workoutTitle();
    tempSet = [];
    tempSetWeight = [];
    tempSetReps = [];
    count = 0;
    addWorkoutTitleDB()
    setAddSet([]);
    setAddExercise([]);
    value.map(ex => {
      if(ex === "Abs"){
        alert("When adding an ab exercise if time taken is used instead of reps, please enter the time in seconds into the *Reps* box")
      }
    })
    
    if(value.length === 0){
      alert("Please Select from the Dropdown Menu")
    }else{
      setSelectHidden(true);
      setWeightsHidden(false);
    }

    firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).collection(weightsTitle).get().then(snap => {
      weightDBIndex = snap.size
    });
  }

  function finishWorkout(){
    workoutCalories();
    Alert.alert("Congratulations!", "You burned approxiamtely " + calories + "kcal in this workout!")

    firebase.firestore()
      .collection('savedWorkouts')
      .doc(currentUser.uid)
      .collection(weightsTitle)
      .doc(String(weightDBIndex + 1))
      .set({
        date: String(date).substring(0, 15),
        exArray: tempEx,
        calories: calories
      })

    setSelectHidden(false);
    setWeightsHidden(true);
    setValue([]);
    calories = 0;
  }

  function cancel(){
    setSelectHidden(false);
    setWeightsHidden(true);
    setTRunningHidden(true);
    setORunningHidden(true);
    setRunningHidden(true);
    setSCyclingHidden(true);
    setOCyclingHidden(true);
    setCyclingHidden(true);
    setWalkingHidden(true);

    setValue([]);
    tempSet=[]
    tempSetReps=[]
    tempSetWeight=[]
    setAddSet(tempSet);
    setAddExercise(tempSet);
    distance = 0;
    walkingTime = 0;
    cyclingTime = 0;
    runningTime = 0;
    
  }

  function cancelWorkout(){
    Alert.alert("WARNING", "Pressing OK will cancel this workout and not save any progress made",
    [
      {
        text: "Cancel"
      },
      {
        text: "OK",
        onPress: ()=>cancel()
      }
    ])
  }

  const [addExercise, setAddExercise] = useState([]);
  const [addSet, setAddSet] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  
  const deleteExerciseHandler = (key)=>{
    count--;
    const _inputs = addExercise.filter((input,index) => index != key);
    setAddExercise(_inputs);
  }

  function getPreviousWeight(documentSnapshot) {
    return documentSnapshot.get('Weight');
  }    

  const GetPreviousWeight = (name, index) =>{
    firebase.firestore().collection('savedWorkouts')
    .doc(currentUser.uid)
    .collection('Back Workout')
    .doc(String(weightDBIndex))
    .collection(name)
    .doc(String(index))
    .get()
    .then(
      documentSnapshot => getPreviousWeight(documentSnapshot))
    .then(Weight => {
      SetPreviousWeight(Weight);
    });
  }
  
  const addExerciseHandler = (ex)=>{
    previousCount = 1;
    workoutCalories()
    startTimer();
    tempEx = [...addExercise]
    count++;
    firebase.firestore().collection('savedWorkouts')
    .doc(currentUser.uid)
    .collection(weightsTitle)
    .doc(String(weightDBIndex))
    .collection(ex)
    .doc(String(previousCount))
    .get()
    .then(
      documentSnapshot => getPreviousWeight(documentSnapshot))
    .then(Weight => {
      SetPreviousWeight(Weight);
      tempEx.push(ex);
      tempSet.push({name: ex, data:[{key: '', set: count, previous: Weight, weight: '', reps: '', name: ex}]})
      setAddExercise(tempEx);
      setAddSet(tempSet)
      setModalVisible(false);
    });
  }
  

  const addSetHandler = (ex)=>{
    previousCount++;
    count++;
    firebase.firestore().collection('savedWorkouts')
    .doc(currentUser.uid)
    .collection(weightsTitle)
    .doc(String(weightDBIndex))
    .collection(ex)
    .doc(String(previousCount))
    .get()
    .then(
      documentSnapshot => getPreviousWeight(documentSnapshot))
    .then(Weight => {
      SetPreviousWeight(Weight);
      tempSet = [...addSet];
      tempSet.flatMap((name) => {
        if(name.name === ex){
          name.data.push({key: '', set: count, previous: Weight, weight: '', reps: '', name: ex})
        }
      })
      setAddSet(tempSet);
    });
  }

 

  const [refreshPage, SetRefreshPage] = useState([]);
  const deleteSetHandler = (key, weight, set, ex)=>{
    count--;
    tempSet.forEach(function(o) {
      if(o.name == ex){
        o.data = o.data.filter(input => input.set != set)
        o.data.flatMap(x => {
          if(x.set > set){
            x.set--
          }
        })
      }
    })
    const _i = [...refreshPage]
    _i.push("refresh");
    const i = tempSetWeight.indexOf(weight)
    tempSetWeight.splice(i, 1)
    tempSetReps.splice(i, 1)
    setAddSet(tempSet);
    SetRefreshPage(_i);
    firebase.firestore()
      .collection('savedWorkouts')
      .doc(currentUser.uid)
      .collection(weightsTitle)
      .doc(weightDBIndex+1)
      .collection(ex)
      .doc(String(key+1))
      .delete()
      .then(() => {
        console.log('Workout Info Deleted');
      })
  }

  const exBack = (
    backArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton} onPress={() =>addExerciseHandler(ex)}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exBiceps = (
    bicepsArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton} onPress={() =>addExerciseHandler(ex)}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exTriceps = (
    tricepsArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton} onPress={() =>addExerciseHandler(ex)}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exShoulders = (
    shouldersArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton} onPress={() =>addExerciseHandler(ex)}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exChest = (
    chestArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton} onPress={() =>addExerciseHandler(ex)}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exLegs = (
    legsArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton} onPress={() =>addExerciseHandler(ex)}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exAbs = (
    absArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton} onPress={() =>addExerciseHandler(ex)}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const titleBack = (
    <View style={{borderBottomWidth: 1, borderColor: 'black', padding: 15}}><Text style={{fontSize: 20, fontWeight: 'bold'}}>Back Exercises</Text></View>
  )

  const titleBiceps = (
    <View style={{borderBottomWidth: 1, borderColor: 'black', padding: 15}}><Text style={{fontSize: 20, fontWeight: 'bold'}}>Biceps Exercises</Text></View>
  )

  const titleTriceps = (
    <View style={{borderBottomWidth: 1, borderColor: 'black', padding: 15}}><Text style={{fontSize: 20, fontWeight: 'bold'}}>Triceps Exercises</Text></View>
  )

  const titleChest = (
    <View style={{borderBottomWidth: 1, borderColor: 'black', padding: 15}}><Text style={{fontSize: 20, fontWeight: 'bold'}}>Chest Exercises</Text></View>
  )

  const titleShoulders = (
    <View style={{borderBottomWidth: 1, borderColor: 'black', padding: 15}}><Text style={{fontSize: 20, fontWeight: 'bold'}}>Shoulders Exercises</Text></View>
  )

  const titleLegs = (
    <View style={{borderBottomWidth: 1, borderColor: 'black', padding: 15}}><Text style={{fontSize: 20, fontWeight: 'bold'}}>Legs Exercises</Text></View>
  )

  const titleAbs = (
    <View style={{borderBottomWidth: 1, borderColor: 'black', padding: 15}}><Text style={{fontSize: 20, fontWeight: 'bold'}}>Abs Exercises</Text></View>
  )


  const updateWeight = (text, wSet, wName, exName, exSets, exReps) => {
    tempSetWeight[wSet] = text
    updateWorkoutData(wName, exName, exSets, tempSetWeight[wSet], exReps)
  }

  const updateReps = (text, wSet, wName, exName, exSets, exWeight) => {
    tempSetReps[wSet] = text
    updateWorkoutData(wName, exName, exSets, exWeight, tempSetReps[wSet])
  }

  const updateWorkoutData = (wName, exName, exSets, exWeight, exReps) => {
    if(exWeight == null){
      exWeight = "0";
    }
    if(exReps == null){
      exReps = "0";
    }
    firebase.firestore()
      .collection('savedWorkouts')
      .doc(currentUser.uid)
      .collection(wName)
      .doc(String(weightDBIndex + 1))
      .collection(exName)
      .doc(exSets)
      .set({
        Reps: exReps,
        Weight: exWeight
      })

      // addExerciseDB(wName, exName);
    
}

  var dbArray = []

  function getDBArray(documentSnapshot) {
    return documentSnapshot.get('idArray');
  }

  function addWorkoutTitleDB() {
    firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).get()
      .then(
        documentSnapshot => getDBArray(documentSnapshot))
      .then(idArray => {
        for (var i = 0; i < idArray.length; i++) {
          dbArray.push(idArray[i])
        }
        if (dbArray.includes(weightsTitle) === false) {
          dbArray.push(weightsTitle)
          firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).set({
            idArray: dbArray
          })
        }
      });
  }


//-----------------------------------------------------Calorie Functions-----------------------------------------------------
var userWeight = 0;

function getUserWeight(documentSnapshot) {
  return documentSnapshot.get('weight');
}    

const userInfo = firebase.firestore().collection('users').doc(currentUser.uid).get()
  .then(
      documentSnapshot => getUserWeight(documentSnapshot))
  .then(weight => {
      userWeight = weight;
  });

function workoutCalories(){
  calories = calories + (tMin * (6 * 3.5 * userWeight) / 200)
  calories = calories.toFixed(1)
}

function tRunningCalories(){
  let speed = distance / (runningTime / 60)
  speed = speed.toFixed(1);
  calories = calories + (runningTime * (speed * 3.5 * userWeight) / 200)
  calories = calories.toFixed(1)
}

function sCyclingCalories(){
  let speed = distance / (cyclingTime / 60)
  speed = speed.toFixed(1);
  let MET = 0;
  if(speed < 9){
    MET = 3.5  
  }else if(speed > 8.9 && speed < 15){
    MET = 5.8
  }else if(speed > 14.9 && speed < 19){
    MET = 6.8
  }else if(speed > 18.9 && speed < 22){
    MET = 8
  }else{MET = 10}
  calories = calories + (cyclingTime * (MET * 3.5 * userWeight) / 200)
  calories = calories.toFixed(1)
}

function walkingCalories(){
  let speed = distance / (walkingTime / 60)
  speed = speed.toFixed(1);
  let MET = 0;
  if (speed < 5.6){
    MET = 2.8
  }else{
    MET = 4.3
  }
  calories = calories + (walkingTime * (MET * 3.5 * userWeight) / 200)
  calories = calories.toFixed(1)
}

//-----------------------------------------------------Cardio-----------------------------------------------------

  function selectToCardio() {
    if (valueCardio.length === 0) {
      alert("Please Select from the Dropdown Menu")
    } else {
      setSelectHidden(true);
      if (valueCardio === "running") {
        setRunningHidden(false);
      } else if (valueCardio === "cycling") {
        setCyclingHidden(false);
      } else if (valueCardio === "walking") {
        setWalkingHidden(false);
        firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).collection("Walk").get().then(snap => {
          cardioDBIndex = snap.size
         });
      }
    }
  }


function runningToTreadmill(){
  setTRunningHidden(false)
  setORunningHidden(true)
  firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).collection("Treadmill Run").get().then(snap => {
   cardioDBIndex = snap.size
  });
}
function runningToOutdoors(){
  setTRunningHidden(true)
  setORunningHidden(false)
  firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).collection("Outdoors Run").get().then(snap => {
    cardioDBIndex = snap.size
   });
}

function cyclingToStationary(){
  setSCyclingHidden(false)
  setOCyclingHidden(true)
  firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).collection("Stationary Cycle").get().then(snap => {
    cardioDBIndex = snap.size
   });
}
function cyclingToOutdoors(){
  setSCyclingHidden(true)
  setOCyclingHidden(false)
  firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).collection("Outdoors Cycle").get().then(snap => {
    cardioDBIndex = snap.size
   });
}

var distance = 0;
var runningTime = 0;
var averageBPM = 0;
var cyclingTime = 0;
var walkingTime = 0;

function cancelTRunning(){
  Alert.alert("WARNING", "Pressing OK will cancel this workout and not save any progress made",
    [
      {
        text: "Cancel"
      },
      {
        text: "OK",
        onPress: ()=>cancel()
      }
    ])
}

function cancelSCycling(){
  Alert.alert("WARNING", "Pressing OK will cancel this workout and not save any progress made",
    [
      {
        text: "Cancel"
      },
      {
        text: "OK",
        onPress: ()=>cancel()
      }
    ])
}

function cancelWalking(){
  Alert.alert("WARNING", "Pressing OK will cancel this workout and not save any progress made",
    [
      {
        text: "Cancel"
      },
      {
        text: "OK",
        onPress: ()=>cancel()
      }
    ])
}

function finishTRunning(){
  if(distance === 0 || runningTime === 0){
    alert("Please fill in the required details")
  }else{
    tRunningCalories()
    Alert.alert("Congratulations!", "You burned approxiamtely " + calories + "kcal in this workout!")
    updateCardioData("Treadmill Run", distance, runningTime, averageBPM, calories);
    setSelectHidden(false);
    setTRunningHidden(true);
    setRunningHidden(true);
    setValueCardio([]);
    calories = 0;
  }
}

function finishSCycling(){
  if(distance === 0 || cyclingTime === 0){
    alert("Please fill in the required details")
  }else{
    sCyclingCalories()
    Alert.alert("Congratulations!", "You burned approxiamtely " + calories + "kcal in this workout!")
    updateCardioData("Stationary Cycle", distance, cyclingTime, averageBPM, calories);
    setSelectHidden(false);
    setSCyclingHidden(true);
    setCyclingHidden(true);
    setValueCardio([]);
    calories = 0;
  }
}

function finishWalking(){
  if(distance === 0 || walkingTime === 0){
    alert("Please fill in the required details")
  }else{
    walkingCalories()
    Alert.alert("Congratulations!", "You burned approxiamtely " + calories + "kcal in this workout!")
    updateCardioData("Walk", distance, walkingTime, averageBPM, calories);
    setSelectHidden(false);
    setWalkingHidden(true);
    setValueCardio([]);
    calories = 0;
  }
}

const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }



  const updateCardioData = (wName, distance, time, avgBPM, cal) => {
    if(avgBPM == null){
      avgBPM = "N/A";
    }
    let speed = distance / (time / 60)
    firebase.firestore()
      .collection('savedWorkouts')
      .doc(currentUser.uid)
      .collection(wName)
      .doc(String(cardioDBIndex + 1))
      .set({
        Time: time,
        Distance: distance,
        Speed: speed,
        Date: String(date).substring(0, 15),
        Calories: cal
      })

      firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).get()
      .then(
        documentSnapshot => getDBArray(documentSnapshot))
      .then(idArray => {
        for (var i = 0; i < idArray.length; i++) {
          dbArray.push(idArray[i])
        }
        if (dbArray.includes(wName) === false) {
          dbArray.push(wName)
          firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).set({
            idArray: dbArray
          })
        }
      });
}

  

  return (
    <View style={styles.container}>
      <HideView hide={selectHidden}>
        <Text style={styles.title}>
          Welcome back, {displayName.split(" ")[0]}!
        </Text>
        <View style={{flexDirection: 'row'}}>
        <Text style={styles.headerStrength}>
          New Strength Workout
        </Text>
        <Image source={require('../../assets/weights.png')} style={{height:30, width:30, marginTop: 'auto', marginLeft: 'auto', marginRight: 5}}></Image>
        </View>
        <DropDownPicker
          multiple={true}
          min={0}
          max={7}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder='Select a Muscle Group'
        />
        <Pressable style={styles.beginButton}
          onPress={selectToWeights}>
          <Text style={{ color: 'white' }}>Begin</Text>
        </Pressable>
        <View style={{flexDirection: 'row'}}>
        <Text style={styles.headerCardio}>
          New Cardio Workout
        </Text>
        <Image source={require('../../assets/cardio.png')} style={{height:30, width:30, marginTop: 'auto', marginLeft: 'auto', marginRight: 5}}></Image>
        </View>
        <DropDownPicker
        multiple={false}
        min={0}
        max={1}
        open={openC}
        value={valueCardio}
        items={itemsCardio}
        setOpen={setOpenC}
        setValue={setValueCardio}
        setItems={setItemsCardio}
        placeholder='Select a Cardio Exercise'
      />
        <Pressable style={styles.beginButton}
          onPress={selectToCardio}>
          <Text style={{ color: 'white' }}>Begin</Text>
          </Pressable>
      </HideView>

      <HideView hide={weightsHidden}>
          <Text style={styles.title}>{weightsTitle}</Text>  
        <ScrollView style={{height: '94%'}} keyboardShouldPersistTaps='handled'>
          {addExercise.map((weight, key, name, reps) => (
            <View>
              <View style={{flexDirection:'row', justifyContent: 'center'}}>
              <Text style={styles.exerciseTitle}>{addExercise[key]}</Text>
              <TouchableOpacity style={styles.deleteExercise} onPress={() => deleteExerciseHandler(key)}>
                  <Text style={styles.deleteExerciseText}>-</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5, justifyContent: 'center'}}>
                <Text style={styles.setTitle}>Set</Text>
                <Text style={styles.previousTitle}>Previous</Text>
                <Text style={styles.weightTitle}>Weight (kg)</Text>
                <Text style={styles.weightTitle}>Reps</Text>
              </View>
              {addSet.flatMap((input, _key,) => ( 
                input.name === addExercise[key] && 
                input.data.flatMap((_input, _key_)=> 
                  <View style={styles.inputContainerSet}>
                    <Text style={styles.setInput}>{_key_ + 1}</Text>
                    <TextInput style={styles.previousInput} keyboardType='number-pad' value={_input.previous != null ?_input.previous + ' kg' : "-"} />
                    <TextInput style={styles.weightInput} placeholder={_key_ != 0 ? tempSetWeight[_input.set - 2]: ""} keyboardType='number-pad' returnKeyType={'done'} value={tempSetWeight[_input.set - 1]} onChangeText={(text) => updateWeight(text, _input.set -1, weightsTitle, input.name, String(_key_ + 1), tempSetReps[_input.set - 1])} 
                    onBlur={() => updateWorkoutData(weightsTitle, input.name, String(_key_ + 1), tempSetWeight[_input.set - 1], tempSetReps[_input.set - 1]) } />
                    <TextInput style={styles.repsInput} placeholder={_key_ != 0 ? tempSetReps[_input.set - 2]: ""} keyboardType='number-pad' returnKeyType={'done'} value={tempSetReps[_input.set - 1]} onChangeText={(text) => updateReps(text, _input.set -1, weightsTitle, input.name, String(_key_ + 1), tempSetWeight[_input.set - 1])}
                    onBlur={() => updateWorkoutData(weightsTitle, input.name, String(_key_ + 1), tempSetWeight[_input.set - 1], tempSetReps[_input.set - 1]) } />
                    
                    <TouchableOpacity style={styles.deleteSet} onPress={() => deleteSetHandler(_key_, tempSetWeight[_input.set - 1], _input.set, input.name)}>
                      <Image
                        style={styles.deleteSetButton}
                        source={require('../../assets/minus.png')}
                      />
                    </TouchableOpacity>
                  </View>
                )
              ))}
              
              <Pressable style={styles.addSetButton}
                onPress={()=>addSetHandler(addExercise[key])}>
                <Text style={{ color: 'white' }}>Add Set</Text>
              </Pressable>
            </View>
          ))}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.exerciseContainerView}>
              <ScrollView style={styles.exerciseView}>
              {value.indexOf("Back ") > -1 && titleBack}
              {value.indexOf("Back ") > -1 && exBack}
              {value.indexOf("Biceps ") > -1 && titleBiceps}
              {value.indexOf("Biceps ") > -1 && exBiceps}
              {value.indexOf("Triceps ") > -1 && titleTriceps}
              {value.indexOf("Triceps ") > -1 && exTriceps}
              {value.indexOf("Shoulders ") > -1 && titleShoulders}
              {value.indexOf("Shoulders ") > -1 && exShoulders}
              {value.indexOf("Chest ") > -1 && titleChest}
              {value.indexOf("Chest ") > -1 && exChest}
              {value.indexOf("Legs ") > -1 && titleLegs}
              {value.indexOf("Legs ") > -1 && exLegs}
              {value.indexOf("Abs ") > -1 && titleAbs}
              {value.indexOf("Abs ") > -1 && exAbs}
                <Pressable
                  style={[styles.button, styles.buttonCloseModal]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={{ color: 'white' }}>Cancel</Text>
                </Pressable>
              </ScrollView>
            </View>
          </Modal>
          <Pressable style={styles.addExerciseButton}
            onPress={()=> setModalVisible(true)}>
            <Text style={{ color: 'white' }}>Add Exercise</Text>
          </Pressable>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Pressable style={styles.cancelWorkout}
              onPress={() => cancelWorkout()}>
              <Text style={{ color: 'white' }}>Cancel Workout</Text>
            </Pressable>
            <Pressable style={styles.finishWorkout}
              onPress={() => finishWorkout()}>
              <Text style={{ color: 'white' }}>Finish Workout</Text>
            </Pressable>
          </View>
        </ScrollView>
        
      </HideView>
      <HideView hide={runningHidden}>
        <View style={styles.container}>
          <Text style={styles.title}>Running</Text>
          <View style={{ flexDirection: 'row' }}>
          <Pressable style={styles.runningHeader}onPress={() => runningToTreadmill()}><Text style={styles.runningHeaderText}>Treadmill</Text></Pressable>
            <Pressable style={styles.runningHeader}onPress={() => runningToOutdoors()}><Text style={styles.runningHeaderText}>Outdoors</Text></Pressable>
          </View>
          <HideView hide={tRunningHidden}>
            <View>
            <Text style={styles.distanceHeader}>Distance Ran (km):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={distance} onChangeText={text => distance = text}></TextInput>
            <Text style={styles.distanceHeader}>Time Taken (minutes):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={runningTime} onChangeText={text => runningTime = text}></TextInput>
            <Text style={styles.distanceHeader}>Average BPM (optional):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={averageBPM} onChangeText={text => averageBPM = text}></TextInput>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>

            <Pressable style={styles.cancelWorkout} onPress={() => cancelTRunning()}><Text style={{ color: 'white' }}>Cancel</Text></Pressable>
            <Pressable style={styles.finishWorkout} onPress={() => finishTRunning()}><Text style={{ color: 'white' }}>Finish</Text></Pressable>
            </View>
            </View>
          </HideView>
          <HideView hide={oRunningHidden}>
            {location != null && <MapView style={{ width: '90%', height: 300, alignSelf: 'center', marginTop: 20 }}
              showsUserLocation={true}
              showsCompass={true}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.000922,
                longitudeDelta: 0.000421,
              }}
            ></MapView>}
          </HideView>
        </View>
      </HideView>
      <HideView hide={cyclingHidden}>
        <View style={styles.container}>
          <Text style={styles.title}>Cycling</Text>
          <View style={{ flexDirection: 'row' }}>
          <Pressable style={styles.runningHeader}onPress={() => cyclingToStationary()}><Text style={styles.runningHeaderText}>Stationary</Text></Pressable>
            <Pressable style={styles.runningHeader}onPress={() => cyclingToOutdoors()}><Text style={styles.runningHeaderText}>Outdoors</Text></Pressable>
          </View>
          <HideView hide={sCyclingHidden}>
            <View>
            <Text style={styles.distanceHeader}>Distance Cycled (km):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={distance} onChangeText={text => distance = text}></TextInput>
            <Text style={styles.distanceHeader}>Time Taken (minutes):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={cyclingTime} onChangeText={text => cyclingTime = text}></TextInput>
            <Text style={styles.distanceHeader}>Average BPM (optional):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={averageBPM} onChangeText={text => averageBPM = text}></TextInput>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>

            <Pressable style={styles.cancelWorkout} onPress={() => cancelSCycling()}><Text style={{ color: 'white' }}>Cancel</Text></Pressable>
            <Pressable style={styles.finishWorkout} onPress={() => finishSCycling()}><Text style={{ color: 'white' }}>Finish</Text></Pressable>
            </View>
            </View>
          </HideView>
        </View>
      </HideView>
      <HideView hide={walkingHidden}>
        <View style={styles.container}>
          <Text style={styles.title}>Walking</Text>
            <View>
            <Text style={styles.distanceHeader}>Distance Walked (km):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={distance} onChangeText={text => distance = text}></TextInput>
            <Text style={styles.distanceHeader}>Time Taken (minutes):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={walkingTime} onChangeText={text => walkingTime = text}></TextInput>
            <Text style={styles.distanceHeader}>Average BPM (optional):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={averageBPM} onChangeText={text => averageBPM = text}></TextInput>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>

            <Pressable style={styles.cancelWorkout} onPress={() => cancelWalking()}><Text style={{ color: 'white' }}>Cancel</Text></Pressable>
            <Pressable style={styles.finishWorkout} onPress={() => finishWalking()}><Text style={{ color: 'white' }}>Finish</Text></Pressable>
            </View>
            </View>
        </View>
      </HideView>
      
    </View>
    )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center'
  },
  container: {
    paddingTop: 0,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  headerStrength: {
    fontSize: 18,
    paddingTop: 40,
    fontStyle: 'italic',
    paddingLeft: 5,
    paddingBottom: 5,
  },
  headerCardio: {
    fontSize: 18,
    paddingTop: 140,
    fontStyle: 'italic',
    paddingLeft: 5,
    paddingBottom: 5,
  },
  beginButton: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#00c921',
    padding: 8,
    borderRadius: 10,
  },
  optionsButton: {
    width:15,
    height: 18,
    marginTop: 7,
    marginLeft: 2,
    borderRadius: 5,
  },
  addExerciseButton:{
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#00c921',
    padding: 8,
    borderRadius: 10,
  },
  cancelWorkout:{
    width: '40%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 10,
    marginBottom: 200,
  },
  finishWorkout:{
    width: '40%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginLeft: 30,
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 10,
    marginBottom: 200,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  inputContainerSet: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center'
  },
  setInput: {
    borderWidth: 1,
    borderColor: 'black',
    paddingLeft: 11,
    paddingTop: 5,
    borderRadius: 5,
    marginLeft: 10,
    width: 35,
    height: 30,
    
  },
  weightInput: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 1,
    borderRadius: 5,
    marginLeft: 25,
    height: 30,
    width: 75,
    textAlign: 'center'
  },
  repsInput: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 1,
    borderRadius: 5,
    marginLeft: 25,
    height: 30,
    width: 50,
    textAlign: 'center'
  },
  previousInput: {
    padding: 1,
    borderRadius: 5,
    marginLeft: 20,
    height: 30,
    width: 50,
    textAlign: 'center'
  },
  deleteExercise: {
    padding: 1,
    borderRadius: 5,
    marginLeft: 20,
    height: 15,
    width: 25,
    backgroundColor: 'red',
    marginTop: 15
  },
  confirmSet: {
    borderRadius: 5,
    marginLeft: 15,
    height: 30,
    width: 35,
  },
  deleteSet: {
    borderRadius: 5,
    marginLeft: 5,
    height: 30,
    width: 35,
  },
  deleteSetButton: {
    borderRadius: 5,
    height: 30,
    width: 35,
    alignSelf: 'center',
  },
  deleteExerciseText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: -13,
    fontSize: 30
  },
  setTitle: {
    fontWeight: 'bold',
    width: 35,
    marginLeft: -35,
    fontSize: 16
  },
  previousTitle: {
    fontWeight: 'bold',
    marginLeft: 13,
    fontSize: 16
  },
  weightTitle: {
    fontWeight: 'bold',
    marginLeft: 13,
    fontSize: 16
  },
  deleteTitle: {
    fontWeight: 'bold',
    width: 70,
    marginLeft: 20,
    marginTop: 3,
    fontSize: 14
  },
  exerciseTitle: {
    fontWeight: 'bold',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
    fontSize: 18,
    color: '#04bedf',
  },
  exerciseContainerView: {
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
  exerciseView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: 300
  },
  exerciseButton:{
    borderBottomWidth: 1,
    borderColor: 'black',
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
  addSetButton:{
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#04bedf',
    padding: 8,
    borderRadius: 10,
  },
  runningHeader:{
    height: 60,
    color: 'white',
    borderColor: 'black',
    borderWidth: 1,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  runningHeaderText:{
    fontSize: 18,
    fontStyle: 'italic',
  },
  distanceHeader:{
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 5,
  },
  distanceInput:{
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 10,
    marginLeft: 5
  }
});

//export default App;
