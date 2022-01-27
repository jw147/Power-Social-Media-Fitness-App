import React, { useEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Button, TextInput } from 'react-native'
import exercises from './../../weightExercises.json';
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker'
import PropTypes from 'prop-types';

import LeaderboardScreen from './LeaderboardScreen';
import FeedScreen from './FeedScreen';
import ProfileScreen from './ProfileScreen';
import SearchScreen from './SearchScreen';





export default function ExerciseScreen({ navigation }) {
  
  //-----------------------------------------------------Hide Views-----------------------------------------------------
  const [selectHidden, setSelectHidden] = useState(false);
  const [weightsHidden, setWeightsHidden] = useState(true);

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


  //-----------------------------------------------------DropDownMenus-----------------------------------------------------
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState([]);

  const [items, setItems] = useState([
    { label: 'Back', value: 'Back' },
    { label: 'Biceps', value: 'Biceps' },
    { label: 'Triceps', value: 'Triceps' },
    { label: 'Chest', value: 'Chest' },
    { label: 'Shoulders', value: 'Shoulders' },
    { label: 'Legs', value: 'Legs' },
  ]);

  //-----------------------------------------------------Weights-----------------------------------------------------
  const [weightsTitle, setWeightsTitle] = useState('');
  const [currentWorkoutArray, setCurrentWorkoutArray] = useState([]);

  function selectToWeights(){
    var x ="";
    workoutTitle();
    
    if(value.length === 0){
      alert("Please Select from the Dropdown Menu")
    }else{
      setSelectHidden(true);
      setWeightsHidden(false);
    }
  }

  function workoutTitle(){
    var x = "";
    if(value.length === 5){
      setWeightsTitle("Full Body")
    }else{
      for(var i = 0; i < value.length; i++){
        if(i == 0){
          x = value[i];
        }
        else if(i>0 && i < value.length - 1){
          x = x + ", " + value[i]
        }
        else{
          x = x + " & " + value[i]
        }
      }
      setWeightsTitle(x + " Workout")
    }
  }

  const [addExercise, setAddExercise] = useState([]);
  const [addSet, setAddSet] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);


  const addExerciseHandler = (ex)=>{
    const _inputs = [...addExercise];
    _inputs.push({key: '', value: '', name: ex});
    setAddExercise(_inputs);
    setModalVisible(false);
  }
  
  const deleteExerciseHandler = (key)=>{
    const _inputs = addExercise.filter((input,index) => index != key);
    setAddExercise(_inputs);
  }

  const inputExerciseHandler = (text, key)=>{
    const _inputs = [...addExercise];
    _inputs[key].value = text;
    _inputs[key]._key  = key;
    setAddExercise(_inputs);
    //tempInput = [{key:'0', value:'0'}]
  }

  const addSetHandler = (ex)=>{
    const _inputs = [...addSet];
    _inputs.push({_key: '', value: '', name: ex});
    setAddSet(_inputs);
  }
  
  const deleteSetHandler = (key)=>{
    const _inputs = addSet.filter((input,index) => index != key);
    setAddSet(_inputs);
  }

  const inputSetHandler = (text, key)=>{
    const _inputs = [...addSet];
    _inputs[key].value = text;
    _inputs[key]._key  = key;
    setAddSet(_inputs)
    //tempInput = [{key:'', value:''}]
  }

  let tempInput = [{key:'', value:''}]

  const exBack = (
    backArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton} onPress={() =>addExerciseHandler(ex)}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exBiceps = (
    bicepsArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exTriceps = (
    tricepsArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exShoulders = (
    shouldersArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exChest = (
    chestArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton}><Text>{ex}</Text></TouchableOpacity></View>
    ))
  )

  const exLegs = (
    legsArray.map(ex => (
      <View><TouchableOpacity style={styles.exerciseButton}><Text>{ex}</Text></TouchableOpacity></View>
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

  var finishCount = 1;

  return (
    <View style={styles.container}>
      <HideView hide={selectHidden}>
        <Text style={styles.title}>
          Welcome back, {displayName.split(" ")[0]}!
        </Text>
        <Text style={styles.header}>
          New Strength Workout
        </Text>
        <DropDownPicker
          multiple={true}
          min={0}
          max={5}
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
      </HideView>

      <HideView hide={weightsHidden}>
          <TextInput style={styles.title}
          placeholder='Enter Workout Title'
          value={weightsTitle + " needs fixed"}
          onChangeText={text => setWeightsTitle(text)}/>  
        <ScrollView style={styles.inputsContainer}>
          {addExercise.map((input, key, name) => (
            //<TextInput style={styles.weightInput} keyboardType='number-pad' value={tempInput.value} onChangeText={(text) => tempInput.push({key: key, value: text})} onBlur={()=>
            //{if(tempInput.length == 1){inputExerciseHandler(0,key)}else{inputExerciseHandler(tempInput[tempInput.length-1].value, tempInput[tempInput.length-1].key)}}} />
            <View>
              <View style={{flexDirection:'row'}}>
              <Text style={styles.exerciseTitle}>{addExercise[key].name}</Text>
              <TouchableOpacity style={styles.deleteExercise} onPress={() => deleteExerciseHandler(key)}>
                  <Text style={styles.deleteExerciseText}>-</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={styles.setTitle}>Set</Text>
                <Text style={styles.weightTitle}>Previous</Text>
                <Text style={styles.weightTitle}>KG</Text>
                <Text style={styles.weightTitle}>Weight</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.setInput}>1</Text>
                <TextInput style={styles.weightInput} keyboardType='number-pad' value={input} onChangeText={(text) => input = text}/>
                <TextInput style={styles.weightInput} keyboardType='number-pad' value={input} onChangeText={(text) => input = text}/>
                <TextInput style={styles.weightInput} keyboardType='number-pad' value={input} onChangeText={(text) => input = text}/>
              </View>
              {addSet.map((input, _key, name) => ( addSet[_key].name === addExercise[key].name &&
              <View style={styles.inputContainer}>
                <Text style={styles.setInput}>{_key + 2}</Text>
                <TextInput style={styles.weightInput} keyboardType='number-pad' value={input} onChangeText={(text) => input = text}/>
                <TextInput style={styles.weightInput} keyboardType='number-pad' value={input} onChangeText={(text) => input = text}/>
                <TextInput style={styles.weightInput} keyboardType='number-pad' value={input} onChangeText={(text) => input = text}/>
                <TouchableOpacity style={styles.deleteSet} onPress={() => deleteSetHandler(_key)}>
                  <Text style={styles.deleteSetText}>-</Text>
                </TouchableOpacity>
              </View>
              ))}
              
              <Pressable style={styles.addSetButton}
                onPress={()=>addSetHandler(addExercise[key].name)}>
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
              {value.indexOf("Back") > -1 && titleBack}
              {value.indexOf("Back") > -1 && exBack}
              {value.indexOf("Biceps") > -1 && titleBiceps}
              {value.indexOf("Biceps") > -1 && exBiceps}
              {value.indexOf("Triceps") > -1 && titleTriceps}
              {value.indexOf("Triceps") > -1 && exTriceps}
              {value.indexOf("Shoulders") > -1 && titleShoulders}
              {value.indexOf("Shoulders") > -1 && exShoulders}
              {value.indexOf("Chest") > -1 && titleChest}
              {value.indexOf("Chest") > -1 && exChest}
              {value.indexOf("Legs") > -1 && titleLegs}
              {value.indexOf("Legs") > -1 && exLegs}
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
        </ScrollView>
        
      </HideView>
      
    </View>



  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 5,
  },
  container: {
    paddingTop: 0,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  header: {
    fontSize: 18,
    paddingTop: 10,
    fontStyle: 'italic',
    paddingLeft: 5,
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
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
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
    marginLeft: 20,
    height: 30,
    width: 75,
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
  deleteSet: {
    padding: 1,
    borderRadius: 5,
    marginLeft: 20,
    height: 30,
    width: 35,
    backgroundColor: 'red',
  },
  deleteExerciseText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: -13,
    fontSize: 30
  },
  deleteSetText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: -7,
    fontSize: 30
  },
  setTitle: {
    fontWeight: 'bold',
    width: 35,
    marginLeft: 10,
    fontSize: 16
  },
  weightTitle: {
    fontWeight: 'bold',
    width: 70,
    marginLeft: 23,
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
    alignSelf: 'center',
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
});

//export default App;
