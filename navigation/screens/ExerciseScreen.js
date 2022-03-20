import React, {Component, useEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Button, TextInput, Alert, Switch } from 'react-native'
import exercises from './../../weightExercises.json';
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import DropDownPicker from 'react-native-dropdown-picker'
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';

let tempSet = [];
let tempEx = [];
let tempTitle = [];

let cardioDBIndex = 1;
let weightDBIndex = 1;
let weightsTitle = "";

let previousCount = 1;

var count = 0;
var calories = 0;

var tempSetWeight = [];
var tempSetReps = [];
var tempSetEx = [];
var tempSetSets = [];
var customWeightEx = [];
export default function ExerciseScreen({ navigation }) {
  const date = new Date()
  
  const [previousWeight, SetPreviousWeight] = useState("-");
  
  const [PR, setPR] = useState(false);

  //-----------------------------------------------------Hide Views-----------------------------------------------------
  const [selectHidden, setSelectHidden] = useState(false);
  const [weightsHidden, setWeightsHidden] = useState(true);
  const [runningHidden, setRunningHidden] = useState(true);
  const [cyclingHidden, setCyclingHidden] = useState(true);
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
    { label: 'Walking', value: 'walking'}
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
    tempSetEx = [];
    tempSetSets = [];
    customWeightEx = [];
    count = 0;
    calories = 0;
    //addWorkoutTitleDB()
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
    if(workoutTime === 0){
      alert("Please enter the duration of this workout")
    }else{
      updateWorkoutData(weightsTitle)
      var cal = workoutCalories();
      var totalWeight = 0;
      var dbWeight = 0;
      for(var i = 0; i<tempSetWeight.length; i++){
        totalWeight = totalWeight + (parseInt(tempSetWeight[i]) * parseInt(tempSetReps[i]));
      }
      firebase.firestore()
      .collection('rewardCounts')
      .doc(currentUser.uid)
      .collection('weightCounters').get()
      .then(docs=>{
        docs.forEach(doc=>{
          if(doc.data().total != null){
            dbWeight = doc.data().total
          }
        })
        firebase.firestore()
        .collection('rewardCounts')
        .doc(currentUser.uid)
        .collection('weightCounters')
        .doc('totalWeight')
        .set({
          total: dbWeight + totalWeight,
        })
        var total = dbWeight + totalWeight;
        rewards(total, cal, 0)
      })
      var dbCal = 0;
      firebase.firestore()
        .collection('rewardCounts')
        .doc(currentUser.uid)
        .collection('calorieCounters').get()
        .then(docs => {
          docs.forEach(doc => {
            if (doc.data().total != null) {
              dbCal = doc.data().total
            }
          })
          firebase.firestore()
            .collection('rewardCounts')
            .doc(currentUser.uid)
            .collection('calorieCounters')
            .doc('totalCalories')
            .set({
              total: dbCal + parseInt(cal),
            })
        })
      if(PR === true){
        Alert.alert("Congratulations!", "You burned approximately " + calories + "kcal in this workout and hit a new one rep max!",
      [
        {
          text: "OK"
        },
        {
          text: "Post Workout",
          onPress: ()=>postWeights(cal)
        }
      ])
      }else{
        Alert.alert("Congratulations!", "You burned approximately " + calories + "kcal in this workout!",
        [
          {
            text: "OK"
          },
          {
            text: "Post Workout",
            onPress: ()=>postWeights(cal)
          }
        ])
      }
  
      let index = "";
      if(weightDBIndex < 10){
        index = " "+ String(weightDBIndex);
      }else{
        index = String(weightDBIndex);
      }
      console.log("h")
      firebase.firestore()
      .collection('savedWorkouts').get()
      .then(docs=>{
        docs.forEach(doc=>{
          if(doc.id===currentUser.uid){
            tempTitle = doc.data().idArray
          }
        })
        if(tempTitle.includes(weightsTitle)){

        }else{
          tempTitle.push(weightsTitle)
          firebase.firestore()
          .collection('savedWorkouts')
          .doc(currentUser.uid)
          .set({
            idArray: tempTitle
          })
        }
      })

      firebase.firestore()
        .collection('savedWorkouts')
        .doc(currentUser.uid)
        .collection(weightsTitle)
        .doc(index)
        .set({
          date: String(date).substring(0, 15),
          exArray: tempEx,
          calories: cal
        })
  
      setSelectHidden(false);
      setWeightsHidden(true);
      setValue([]);
      // calories = 0;
      // tempSetEx = [];
      // tempSetReps = [];
      // tempSetWeight = [];
      // tempSetSets = [];
    }
  }
  function rewards(tW, tC, tD){
    if(tW >= 1000 && tW<2000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('weights')
      .doc(currentUser.uid)
      .set({
        one: true,
      })
    }
    if(tW >= 2000 && tW<10000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('weights')
      .doc(currentUser.uid)
      .set({
        one: true,
        two: true,
      })
    }
    if(tW >= 10000 && tW<20000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('weights')
      .doc(currentUser.uid)
      .set({
        one: true,
        two: true,
        ten: true,
      })
    }
    if(tW >= 20000 && tW<50000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('weights')
      .doc(currentUser.uid)
      .set({
        one: true,
        two: true,
        ten: true,
        twenty: true,
      })
    }
    if(tW >= 50000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('weights')
      .doc(currentUser.uid)
      .set({
        one: true,
        two: true,
        ten: true,
        twenty: true,
        fifty: true,
      })
    }
    if(tC >= 500 && tC<1000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('calories')
      .doc(currentUser.uid)
      .set({
        half: true,
      })
    }
    if(tC >= 1000 && tC<2000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('calories')
      .doc(currentUser.uid)
      .set({
        half: true,
        one: true,
      })
    }
    if(tC >= 2000 && tC<3500){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('calories')
      .doc(currentUser.uid)
      .set({
        half: true,
        one: true,
        two: true,
      })
    }
    if(tC >= 3500 && tC<5000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('calories')
      .doc(currentUser.uid)
      .set({
        half: true,
        one: true,
        two: true,
        threehalf: true,
      })
    }
    if(tC >= 5000 && tC<7000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('calories')
      .doc(currentUser.uid)
      .set({
        half: true,
        one: true,
        two: true,
        threehalf: true,
        five: true,
      })
    }
    if(tC >= 7000 && tC<10000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('calories')
      .doc(currentUser.uid)
      .set({
        half: true,
        one: true,
        two: true,
        threehalf: true,
        five: true,
        seven: true,
      })
    }
    if(tC >= 10000){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('calories')
      .doc(currentUser.uid)
      .set({
        half: true,
        one: true,
        two: true,
        threehalf: true,
        five: true,
        seven: true,
        ten: true,
      })
    }
    if(tD >= 2 && tD < 5){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('distance')
      .doc(currentUser.uid)
      .set({
        two: true,
      })
    }
    if(tD >= 5 && tD < 10){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('distance')
      .doc(currentUser.uid)
      .set({
        two: true,
        five: true,
      })
    }
    if(tD >= 10 && tD < 15){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('distance')
      .doc(currentUser.uid)
      .set({
        two: true,
        five: true,
        ten: true,
      })
    }
    if(tD >= 15 && tD < 20){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('distance')
      .doc(currentUser.uid)
      .set({
        two: true,
        five: true,
        ten: true,
        fifteen: true,
      })
    }
    if(tD >= 20 && tD < 30){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('distance')
      .doc(currentUser.uid)
      .set({
        two: true,
        five: true,
        ten: true,
        fifteen: true,
        twenty: true,
      })
    }
    if(tD >= 30){
      firebase.firestore()
      .collection('rewards')
      .doc(currentUser.uid)
      .collection('distance')
      .doc(currentUser.uid)
      .set({
        two: true,
        five: true,
        ten: true,
        fifteen: true,
        twenty: true,
        thirty: true,
      })
    }
  }


  function cancel(){
    setSelectHidden(false);
    setWeightsHidden(true);
    setRunningHidden(true);
    setCyclingHidden(true);
    setWalkingHidden(true);

    setValue([]);
    tempSet=[]
    tempSetReps=[]
    tempSetWeight=[]
    tempSetEx = [];
    tempSetSets = [];
    customWeightEx = [];
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
    tempEx = [...addExercise]
    count++;
    tempSetWeight.push(0)
    tempSetReps.push(0)
    tempSetEx.push(ex)
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
    customWeightEx[0] = "";
  }
  

  const addSetHandler = (ex)=>{
    previousCount++;
    count++;
    // tempSetWeight.push({ex:ex, weights:[]})
    // tempSetReps.push({ex:ex, reps:[]})
    tempSetWeight.push(0)
    tempSetReps.push(0)
    tempSetEx.push(ex)
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

  
  function updateCustomWeight(text){
    customWeightEx[0] = text
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

  const updateWeight = (text, wSet, wName, exName, exSets, exReps, key) => {
    tempSetWeight[wSet] = text
    tempSetSets[wSet] = exSets
  }

  const updateReps = (text, wSet, wName, exName, exSets, exWeight, key) => {
    
    tempSetReps[wSet] = text
    tempSetSets[wSet] = exSets
  }

  const updateWorkoutData = (wName) => {
    
    let index = "";
    if(weightDBIndex < 10){
      index = " "+ String(weightDBIndex);
    }else{
      index = String(weightDBIndex);
    } 
    for(var i = 0; i<tempSetEx.length; i++)
    {
      if(tempSetEx[i] === "Deadlift" || tempSetEx[i] === "Barbell Bench Press" || tempSetEx[i] === "Barbell Squat"){
        if(tempSetReps[i] === "1"){
          
          weightPR(tempSetEx[i], tempSetWeight[i]);
        }
      }
      firebase.firestore()
      .collection('savedWorkouts')
      .doc(currentUser.uid)
      .collection(wName)
      .doc(index)
      .collection(tempSetEx[i])
      .doc(String(tempSetSets[i]))
      .set({
        Reps: tempSetReps[i],
        Weight: tempSetWeight[i]
      })
    }

}

function weightPR(exName, exWeight){

  firebase.firestore()
  .collection('personalRecords')
  .doc(currentUser.uid)
  .collection(exName).get()
  .then(query=> {
    if (query.size === 0) {
      setPR(true);
      firebase.firestore()
        .collection('personalRecords')
        .doc(currentUser.uid)
        .collection(exName)
        .doc("PR")
        .set({
          weight: exWeight,
          date: String(date),
          name: exName
        })
    } else {
      firebase.firestore()
        .collection('personalRecords')
        .doc(currentUser.uid)
        .collection(exName).get()
        .then(docs => {
          docs.forEach(doc=>{
            if(doc.data().weight >= exWeight){
                  setPR(false)
                  console.log("no PR")
                }else{
                  setPR(true);
                  firebase.firestore()
                  .collection('personalRecords')
                  .doc(currentUser.uid)
                  .collection(exName)
                  .doc("PR")
                  .set({
                    weight: exWeight,
                    date: String(date),
                    name: exName
                  })
                }
            
          })
        })
    }
  
  });
}

let posts = [];
let postIndex = 0;
function postWeights(cal){
  console.log("calories: " + cal)
  setPR(false)
  firebase.firestore()
    .collection('posts')
    .doc(currentUser.uid)
    .collection('posts').get()
    .then(query => {
      postIndex = query.size
      var y = 0;
      let index =""
      if(postIndex < 10){
        index = " " + String(postIndex)
      }else{
        index = String(postIndex)
      }
      
      for(var i = 0; i < addSet.length; i++){
        for(var x = 0; x <addSet[i].data.length; x++){
          posts.push({workout: weightsTitle, ex: addSet[i].data[x].name, set:(x+1) , reps: tempSetReps[y], weight: tempSetWeight[y], date: date, calories: cal})
          y++;
        }
      }
      firebase.firestore()
        .collection('posts')
        .doc(currentUser.uid)
        .collection('posts')
        .doc(index).set({
          post: posts
        })
    })
}

  // var dbArray = []

  // function getDBArray(documentSnapshot) {
  //   return documentSnapshot.get('idArray');
  // }

  // function addWorkoutTitleDB() {
  //   firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).get()
  //     .then(
  //       documentSnapshot => getDBArray(documentSnapshot))
  //     .then(idArray => {
  //       for (var i = 0; i < idArray.length; i++) {
  //         dbArray.push(idArray[i])
  //       }
  //       if (dbArray.includes(weightsTitle) === false) {
  //         dbArray.push(weightsTitle)
  //         firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).set({
  //           idArray: dbArray
  //         })
  //       }
  //     });
  // }


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

let workoutTime= 0;
function workoutCalories(){
  calories = calories + (workoutTime * (6 * 3.5 * userWeight) / 200)
  return calories = calories.toFixed(1)
 
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
        firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).collection("Run").get().then(snap => {
          cardioDBIndex = snap.size
         });
      } else if (valueCardio === "cycling") {
        setCyclingHidden(false);
        firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).collection("Cycle").get().then(snap => {
          cardioDBIndex = snap.size
         });
      } else if (valueCardio === "walking") {
        setWalkingHidden(false);
        firebase.firestore().collection('savedWorkouts').doc(currentUser.uid).collection("Walk").get().then(snap => {
          cardioDBIndex = snap.size
         });
      }
    }
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
    var dbKM = 0;
    var cal = calories;
    firebase.firestore()
      .collection('rewardCounts')
      .doc(currentUser.uid)
      .collection('cardioCounters').get()
      .then(docs=>{
        docs.forEach(doc=>{
          if(doc.data().total != null){
            dbKM = doc.data().total
          }
        })
        firebase.firestore()
        .collection('rewardCounts')
        .doc(currentUser.uid)
        .collection('cardioCounters')
        .doc('totalDistance')
        .set({
          total: dbKM + parseInt(distance),
        })
        var total = dbKM + parseInt(distance)
        rewards(0, cal, total)
      })
    var dbCal = 0;
    firebase.firestore()
      .collection('rewardCounts')
      .doc(currentUser.uid)
      .collection('calorieCounters').get()
      .then(docs => {
        docs.forEach(doc => {
          if (doc.data().total != null) {
            dbCal = doc.data().total
          }
        })
        firebase.firestore()
          .collection('rewardCounts')
          .doc(currentUser.uid)
          .collection('calorieCounters')
          .doc('totalCalories')
          .set({
            total: dbCal + parseInt(cal),
          })
      })
    updateCardioData("Run", distance, runningTime, averageBPM, calories);
    if(PR === true){
      Alert.alert("Congratulations!", "You burned approximately " + calories + "kcal in this workout and made a new personal best! Check your profile to view your PBs!",
    [
      {
        text: "OK"
      },
      {
        text: "Post Workout",
        onPress: ()=>postCardio("Run", distance, runningTime, cal)
      }
    ])
    }else{
      Alert.alert("Congratulations!", "You burned approximately " + calories + "kcal in this workout!",
      [
        {
          text: "OK"
        },
        {
          text: "Post Workout",
          onPress: ()=>postCardio("Run", distance, runningTime, cal)
        }
      ])
    }
    
    setSelectHidden(false);
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
    var dbKM = 0;
    var cal = calories;
    firebase.firestore()
      .collection('rewardCounts')
      .doc(currentUser.uid)
      .collection('cardioCounters').get()
      .then(docs=>{
        docs.forEach(doc=>{
          if(doc.data().total != null){
            dbKM = doc.data().total
          }
        })
        firebase.firestore()
        .collection('rewardCounts')
        .doc(currentUser.uid)
        .collection('cardioCounters')
        .doc('totalDistance')
        .set({
          total: dbKM + parseInt(distance),
        })
        var total = dbKM + parseInt(distance)
        rewards(0, cal, total)
      })
      var dbCal = 0;
      firebase.firestore()
        .collection('rewardCounts')
        .doc(currentUser.uid)
        .collection('calorieCounters').get()
        .then(docs=>{
          docs.forEach(doc=>{
            if(doc.data().total != null){
              dbCal = doc.data().total
            }
          })
          firebase.firestore()
          .collection('rewardCounts')
          .doc(currentUser.uid)
          .collection('calorieCounters')
          .doc('totalCalories')
          .set({
            total: dbCal + parseInt(cal),
          })
        })
    updateCardioData("Cycle", distance, cyclingTime, averageBPM, calories);
    if (PR === true) {
      Alert.alert("Congratulations!", "You burned approximately " + calories + "kcal in this workout and made a new personal best! Check your profile to view your PBs!",
        [
          {
            text: "OK"
          },
          {
            text: "Post Workout",
            onPress: () => postCardio("Cycle", distance, cyclingTime, cal)
          }
        ])
    } else {
      Alert.alert("Congratulations!", "You burned approximately " + calories + "kcal in this workout!",
        [
          {
            text: "OK"
          },
          {
            text: "Post Workout",
            onPress: () => postCardio("Cycle", distance, cyclingTime, cal)
          }
        ])
    }
    setSelectHidden(false);
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
    var dbKM = 0;
    var cal = calories;
    firebase.firestore()
      .collection('rewardCounts')
      .doc(currentUser.uid)
      .collection('cardioCounters').get()
      .then(docs=>{
        docs.forEach(doc=>{
          if(doc.data().total != null){
            dbKM = doc.data().total
          }
        })
        firebase.firestore()
        .collection('rewardCounts')
        .doc(currentUser.uid)
        .collection('cardioCounters')
        .doc('totalDistance')
        .set({
          total: dbKM + parseInt(distance),
        })
        var total = dbKM + parseInt(distance)
        rewards(0, cal, total)
      })
    var dbCal = 0;
    firebase.firestore()
      .collection('rewardCounts')
      .doc(currentUser.uid)
      .collection('calorieCounters').get()
      .then(docs=>{
        docs.forEach(doc=>{
          if(doc.data().total != null){
            dbCal = doc.data().total
          }
        })
        firebase.firestore()
        .collection('rewardCounts')
        .doc(currentUser.uid)
        .collection('calorieCounters')
        .doc('totalCalories')
        .set({
          total: dbCal + parseInt(cal),
        })
      })
    updateCardioData("Walk", distance, walkingTime, averageBPM, calories);
    if (PR === true) {
      Alert.alert("Congratulations!", "You burned approximately " + calories + "kcal in this workout and made a new personal best! Check your profile to view your PBs!",
        [
          {
            text: "OK"
          },
          {
            text: "Post Workout",
            onPress: () => postCardio("Walk", distance, walkingTime, cal)
          }
        ])
    } else {
      Alert.alert("Congratulations!", "You burned approximately " + calories + "kcal in this workout!",
        [
          {
            text: "OK"
          },
          {
            text: "Post Workout",
            onPress: () => postCardio("Walk", distance, walkingTime, cal)
          }
        ])
    }
    setSelectHidden(false);
    setWalkingHidden(true);
    setValueCardio([]);
    calories = 0;
  }
}

  const updateCardioData = (wName, distance, time, avgBPM, cal) => {
    if(avgBPM == null){
      avgBPM = "N/A";
    }
    let speed = distance / (time / 60)
    speed = speed.toFixed(1);
    cardioPR(wName, distance, time, cal, speed);
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

      firebase.firestore()
      .collection('savedWorkouts').get()
      .then(docs=>{
        docs.forEach(doc=>{
          if(doc.id===currentUser.uid){
            tempTitle = doc.data().idArray
          }
        })
        if(tempTitle.includes(wName)){

        }else{
          tempTitle.push(wName)
          firebase.firestore()
          .collection('savedWorkouts')
          .doc(currentUser.uid)
          .set({
            idArray: tempTitle
          })
        }
      })
}
let testPR = false;
function cardioPR(wName, distance, time, cal, speed){

  firebase.firestore()
  .collection('personalRecords')
  .doc(currentUser.uid)
  .collection(wName).get()
  .then(query=> {
    if (query.size === 0) {
      setPR(true);
      testPR = true;
      firebase.firestore()
        .collection('personalRecords')
        .doc(currentUser.uid)
        .collection(wName)
        .doc("DISTANCE")
        .set({
          distance: distance,
          time: time,
          speed: speed,
          date: String(date),
          name: wName
        })
        firebase.firestore()
        .collection('personalRecords')
        .doc(currentUser.uid)
        .collection(wName)
        .doc("SPEED")
        .set({
          distance: distance,
          time: time,
          speed: speed,
          date: String(date),
          name: wName
        })
    } else {
      firebase.firestore()
        .collection('personalRecords')
        .doc(currentUser.uid)
        .collection(wName).get()
        .then(docs => {
          docs.forEach(doc=>{
            if(doc.data().speed >= speed && doc.data().distance >= distance){
                  setPR(false)
                  console.log("no PR")
                }
                if(doc.data().speed < speed){
                  setPR(true);
                  testPR = true;
                  firebase.firestore()
                  .collection('personalRecords')
                  .doc(currentUser.uid)
                  .collection(wName)
                  .doc("SPEED")
                  .set({
                    distance: distance,
                    time: time,
                    speed: speed,
                    date: String(date),
                    name: wName
                  })
                  console.log("speed PR")
                }
                if(doc.data().distance < distance){
                  setPR(true);
                  testPR = true;
                  firebase.firestore()
                  .collection('personalRecords')
                  .doc(currentUser.uid)
                  .collection(wName)
                  .doc("DISTANCE")
                  .set({
                    distance: distance,
                    time: time,
                    speed: speed,
                    date: String(date),
                    name: wName
                  })
                  console.log("distance PR")
                }
            
          })
        })
    }
  
  });
}

let cPostIndex = 0;
function postCardio(cName, dis, time, cal){
  setPR(false)
  let speed = distance / (time / 60)
  speed = speed.toFixed(1);
  firebase.firestore()
    .collection('posts')
    .doc(currentUser.uid)
    .collection('posts').get()
    .then(query => {
      cPostIndex = query.size
      var y = 0;
      let index = ""
      if (cPostIndex < 10) {
        index = " " + String(cPostIndex)
      } else {
        index = String(cPostIndex)
      }

      firebase.firestore()
        .collection('posts')
        .doc(currentUser.uid)
        .collection('posts')
        .doc(index).set({
          cardio: cName,
          distance: dis,
          time: time,
          date: date,
          calories: cal,
          speed: speed,
          name: cName
        })
    })
    
  }

  function openExercises(){
    setModalVisible(true)
    customWeightEx[0] = ""
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
                    <TextInput style={styles.weightInput} keyboardType='number-pad' returnKeyType={'done'} value={tempSetWeight[_input.set - 1]} onChangeText={(text) => updateWeight(text, _input.set -1, weightsTitle, input.name, String(_key_ + 1), tempSetReps[_input.set - 1], _key_)} 
                    />
                    <TextInput style={styles.repsInput} keyboardType='number-pad' returnKeyType={'done'} value={tempSetReps[_input.set - 1]} onChangeText={(text) => updateReps(text, _input.set -1, weightsTitle, input.name, String(_key_ + 1), tempSetWeight[_input.set - 1], _key_)}
                    />
                    
                    
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
                <Text style={{textAlign: 'center', fontSize: 16, marginTop: 10}}>Enter Your Own Exercise</Text>
                <TextInput style={styles.enterYourOwnWeightsInput} placeholder="Enter Your Own Exercise" value={customWeightEx[0]} onChangeText={text=> updateCustomWeight(text)}></TextInput>
                <Pressable style={styles.enterYourOwnWeightsButton} onPress={()=> addExerciseHandler(customWeightEx[0])}>
                  <Text style={{textAlign: 'center', color: 'white'}}>Add</Text>
                </Pressable>
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
            onPress={()=> openExercises()}>
            <Text style={{ color: 'white' }}>Add Exercise</Text>
          </Pressable>
          <TextInput style={styles.workoutTime} placeholder="Workout Duration (Minutes)" value={workoutTime} onChangeText={text=>workoutTime=text} returnKeyType={'done'} keyboardType='number-pad'></TextInput>
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
          
          <View>
            <Text style={styles.distanceHeader}>Distance Ran (km):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={distance} onChangeText={text => distance = text}></TextInput>
            <Text style={styles.distanceHeader}>Time Taken (minutes):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={runningTime} onChangeText={text => runningTime = text}></TextInput>
            <Text style={styles.distanceHeader}>Average BPM (optional):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={averageBPM} onChangeText={text => averageBPM = text}></TextInput>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

              <Pressable style={styles.cancelWorkout} onPress={() => cancelTRunning()}><Text style={{ color: 'white' }}>Cancel</Text></Pressable>
              <Pressable style={styles.finishWorkout} onPress={() => finishTRunning()}><Text style={{ color: 'white' }}>Finish</Text></Pressable>
            </View>
          </View>
        </View>
      </HideView>
      <HideView hide={cyclingHidden}>
        <View style={styles.container}>
          <Text style={styles.title}>Cycling</Text>
          <View>
            <Text style={styles.distanceHeader}>Distance Cycled (km):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={distance} onChangeText={text => distance = text}></TextInput>
            <Text style={styles.distanceHeader}>Time Taken (minutes):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={cyclingTime} onChangeText={text => cyclingTime = text}></TextInput>
            <Text style={styles.distanceHeader}>Average BPM (optional):</Text>
            <TextInput style={styles.distanceInput} editable={true} keyboardType='number-pad' returnKeyType={'done'} value={averageBPM} onChangeText={text => averageBPM = text}></TextInput>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

              <Pressable style={styles.cancelWorkout} onPress={() => cancelSCycling()}><Text style={{ color: 'white' }}>Cancel</Text></Pressable>
              <Pressable style={styles.finishWorkout} onPress={() => finishSCycling()}><Text style={{ color: 'white' }}>Finish</Text></Pressable>
            </View>
          </View>
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
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

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
    paddingLeft: 11,
    paddingTop: 5,
    borderRadius: 5,
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
    marginLeft: -5,
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
    marginLeft: 5,
    borderRadius: 5
  },
  workoutTime: {
    height: 50,
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 10,
    textAlign: 'center',
  },
  enterYourOwnWeightsInput: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: 'black',
    marginTop: 10,
    textAlign: 'center',
    borderRadius: 15
  },
  enterYourOwnWeightsButton:{
    marginLeft: 'auto',
    height: 40,
    width: 120,
    backgroundColor: '#00a1d0',
    marginRight: 10,
    borderRadius: 15,
    marginTop: 5,
    justifyContent: 'center'
  }
});

//export default App;
