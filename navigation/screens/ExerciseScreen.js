import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
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

  function selectToWeights(){
    workoutTitle();
    setSelectHidden(true);
    setWeightsHidden(false);
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
      setWeightsTitle(x)
    }
  }

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
      <Text style={styles.title}>
        {weightsTitle} Workout
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
        onPress={() => setWeightsHidden(!weightsHidden)}>
        <Text style={{ color: 'white' }}>Begin</Text>
      </Pressable>
      </HideView>

    </View>



  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontStyle: 'italic'
  },
  beginButton: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#00c921',
    borderColor: 'black',
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
  },

});

//export default App;
