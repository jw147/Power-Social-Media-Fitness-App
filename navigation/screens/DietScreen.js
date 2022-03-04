import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect } from 'react'
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import {storage, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, set } from 'firebase/database';
import LottieView from 'lottie-react-native';

export default function DietScreen({navigation}){
    const currentUser = firebase.auth().currentUser;

    const [loading, setLoading] = useState(true)

    useEffect( () => {
        const getDatabase = async() =>{
            var totalCal = 0;
            var totalBreakfast = 0;
            var totalLunch = 0;
            var totalDinner = 0;
            var totalSnack = 0;
            await firebase.firestore()
            .collection('meals')
            .doc(currentUser.uid)
            .collection(String(date).substring(0, 15)).get()
            .then(docs=>{
                docs.forEach(doc=>{
                    if(doc.id === "breakfast"){
                        setBreakfastEntered(true)
                        setBreakfastName(doc.data().name)
                        setBreakfastDisplayArray(doc.data().breakfast)
                        var t = doc.data().breakfast
                        for(var i = 0; i < t.length; i++){
                            totalBreakfast = totalBreakfast + parseInt(t[i].calories)
                        }
                        setBreakfastCalories(totalBreakfast)
                    }
                    if(doc.id === "lunch"){
                        setLunchEntered(true)
                        setLunchName(doc.data().name)
                        setLunchDisplayArray(doc.data().lunch)
                        var t = doc.data().lunch
                        for(var i = 0; i < t.length; i++){
                            totalLunch = totalLunch + parseInt(t[i].calories)
                        }
                        setLunchCalories(totalLunch)
                    }
                    if(doc.id === "dinner"){
                        setDinnerEntered(true)
                        setDinnerName(doc.data().name)
                        setDinnerDisplayArray(doc.data().dinner)
                        var t = doc.data().dinner
                        for(var i = 0; i < t.length; i++){
                            totalDinner = totalDinner + parseInt(t[i].calories)
                        }
                        setDinnerCalories(totalDinner)
                    }
                    if(doc.id === "snack"){
                        setSnackEntered(true)
                        setSnacks(doc.data().snacks)
                        var t = doc.data().snacks
                        for(var i = 0; i < t.length; i++){
                            var x = t[i].snack
                            for(var y = 0; y < x.length; y++){
                                totalSnack = totalSnack + parseInt(x[y].calories)

                            }
                        }
                        setSnackCalories(totalSnack)
                    }
                })
                totalCal = totalBreakfast + totalLunch + totalDinner + totalSnack
                setTotalCalories(totalCal)
            })
            setLoading(false)
                    }
                    getDatabase()
                    
                }, [loading]);
    

    const [breakfastCalories, setBreakfastCalories] = useState(0)
    const [lunchCalories, setLunchCalories] = useState(0)
    const [dinnerCalories, setDinnerCalories] = useState(0)
    const [snackCaloriesArray, setSnackCaloriesArray] = useState([])
    const [snackCalories, setSnackCalories] = useState(0)
    const [totalCalories, setTotalCalories] = useState(0)
    const date = new Date()

    const [breakfastVisible, setBreakfastVisible] = useState(false)
    const [breakfastName, setBreakfastName] = useState("")
    const [breakfastDisplayArray, setBreakfastDisplayArray] = useState([])
    const [breakfastEntered, setBreakfastEntered] = useState(false)
    var bIngredient = [];
    var bAmount = [];
    var bCalories = [];

    function addBreakfastIngredient(){
        var i = [...breakfastDisplayArray]
        i.push({ingredients: "", amount: "", calories: ""})
        setBreakfastDisplayArray(i)
    }
    function updateBreakfastIngredient(key, text){
        var i = [...breakfastDisplayArray]
        i[key].ingredients = text
        setBreakfastDisplayArray(i)
    }
    function updateBreakfastAmount(key, text){
        var i = [...breakfastDisplayArray]
        i[key].amount = text
        setBreakfastDisplayArray(i)
    }
    function updateBreakfastCalories(key, text){
        var i = [...breakfastDisplayArray]
        i[key].calories = text
        setBreakfastDisplayArray(i)
    }
    function finishBreakfast(){
        if(breakfastName === ""){
            alert("Please enter a title for this meal")
        }
        else{
            var totalCal = 0;
            for(var i = 0; i < breakfastDisplayArray.length; i++){
                totalCal = totalCal + parseInt(breakfastDisplayArray[i].calories);
            }
            setBreakfastEntered(true)
            setBreakfastCalories(totalCal)
            setTotalCalories(totalCal + lunchCalories + dinnerCalories + snackCalories)
            firebase.firestore()
            .collection('meals')
            .doc(currentUser.uid)
            .collection(String(date).substring(0, 15))
            .doc('breakfast')
            .set({
                breakfast: breakfastDisplayArray,
                name: breakfastName
            })
        }
    }

    const [lunchVisible, setLunchVisible] = useState(false)
    const [lunchName, setLunchName] = useState("")
    const [lunchDisplayArray, setLunchDisplayArray] = useState([])
    const [lunchEntered, setLunchEntered] = useState(false)

    function addLunchIngredient(){
        var i = [...lunchDisplayArray]
        i.push({ingredients: "", amount: "", calories: ""})
        setLunchDisplayArray(i)
    }
    function updateLunchIngredient(key, text){
        var i = [...lunchDisplayArray]
        i[key].ingredients = text
        setLunchDisplayArray(i)
    }
    function updateLunchAmount(key, text){
        var i = [...lunchDisplayArray]
        i[key].amount = text
        setLunchDisplayArray(i)
    }
    function updateLunchCalories(key, text){
        var i = [...lunchDisplayArray]
        i[key].calories = text
        setLunchDisplayArray(i)
    }
    function finishLunch(){
        if(lunchName === ""){
            alert("Please enter a title for this meal")
        }
        else{
            var totalCal = 0;
            for(var i = 0; i < lunchDisplayArray.length; i++){
                totalCal = totalCal + parseInt(lunchDisplayArray[i].calories);
            }
            setLunchEntered(true)
            setLunchCalories(totalCal)
            setTotalCalories(totalCal + breakfastCalories + dinnerCalories + snackCalories)
            firebase.firestore()
            .collection('meals')
            .doc(currentUser.uid)
            .collection(String(date).substring(0, 15))
            .doc('lunch')
            .set({
                lunch: lunchDisplayArray,
                name: lunchName
            })
        }
    }

    const [dinnerVisible, setDinnerVisible] = useState(false)
    const [dinnerName, setDinnerName] = useState("")
    const [dinnerDisplayArray, setDinnerDisplayArray] = useState([])
    const [dinnerEntered, setDinnerEntered] = useState(false)

    function addDinnerIngredient(){
        var i = [...dinnerDisplayArray]
        i.push({ingredients: "", amount: "", calories: ""})
        setDinnerDisplayArray(i)
    }
    function updateDinnerIngredient(key, text){
        var i = [...dinnerDisplayArray]
        i[key].ingredients = text
        setDinnerDisplayArray(i)
    }
    function updateDinnerAmount(key, text){
        var i = [...dinnerDisplayArray]
        i[key].amount = text
        setDinnerDisplayArray(i)
    }
    function updateDinnerCalories(key, text){
        var i = [...dinnerDisplayArray]
        i[key].calories = text
        setDinnerDisplayArray(i)
    }
    function finishDinner(){
        if(dinnerName === ""){
            alert("Please enter a title for this meal")
        }
        else{
            var totalCal = 0;
            for(var i = 0; i < dinnerDisplayArray.length; i++){
                totalCal = totalCal + parseInt(dinnerDisplayArray[i].calories);
            }
            setDinnerEntered(true)
            setDinnerCalories(totalCal)
            setTotalCalories(totalCal + lunchCalories + breakfastCalories + snackCalories)
            firebase.firestore()
            .collection('meals')
            .doc(currentUser.uid)
            .collection(String(date).substring(0, 15))
            .doc('dinner')
            .set({
                dinner: dinnerDisplayArray,
                name: dinnerName
            })
        }
    }


    const [snackVisible, setSnackVisible] = useState(false)
    const [snackName, setSnackName] = useState("")
    const [snackDisplayArray, setSnackDisplayArray] = useState([])
    const [snackEntered, setSnackEntered] = useState(false)
    const [snacks, setSnacks] = useState([])

    function addSnack(){
        setSnackVisible(true)
        console.log("here")
    }

    function addSnackIngredient(){
        var i = [...snackDisplayArray]
        i.push({ingredients: "", amount: "", calories: ""})
        setSnackDisplayArray(i)
    }
    function updateSnackIngredient(key, text){
        var i = [...snackDisplayArray]
        i[key].ingredients = text
        setSnackDisplayArray(i)
    }
    function updateSnackAmount(key, text){
        var i = [...snackDisplayArray]
        i[key].amount = text
        setSnackDisplayArray(i)
    }
    function updateSnackCalories(key, text){
        var i = [...snackDisplayArray]
        i[key].calories = text
        setSnackDisplayArray(i)
    }
    function finishSnack(){
        if(snackName === ""){
            alert("Please enter a title for this meal")
        }
        else{
            var temp = [...snacks]
            temp.push({snack: snackDisplayArray, name: snackName})
            console.log(snacks)
            setSnacks(temp)
            var totalCal = 0;
            for(var i = 0; i < snackDisplayArray.length; i++){
                totalCal = totalCal + parseInt(snackDisplayArray[i].calories);
            }
            setSnackEntered(true)
            setSnackVisible(false)
            setSnackCalories(snackCalories + totalCal)
            setTotalCalories(snackCalories + totalCal + lunchCalories + dinnerCalories + breakfastCalories)
            firebase.firestore()
            .collection('meals')
            .doc(currentUser.uid)
            .collection(String(date).substring(0, 15))
            .doc('snack')
            .set({
                snacks: temp 
            })
            setSnackDisplayArray([])
            setSnackName("")
        }
    }

    if (loading) {
        //add splash
        return (<LottieView source={require('../../loadingAnimation.json')} autoPlay loop />)
        } 
    return (
        <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset = "50" behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView style={styles.container}>
            <Text style = {styles.title}>Total Calories Today</Text>
            <View style={{flexDirection: 'row', justifyContent:'center', marginTop:10}}>
                <Text style={{fontSize:17,textAlign: 'center'}}>Breakfast{"\n"}{breakfastCalories}</Text>
                <Text style={{fontSize:17,textAlign: 'center'}}> + </Text>
                <Text style={{fontSize:17,textAlign: 'center'}}>Lunch{"\n"}{lunchCalories}</Text>
                <Text style={{fontSize:17,textAlign: 'center'}}> + </Text>
                <Text style={{fontSize:17,textAlign: 'center'}}>Dinner{"\n"}{dinnerCalories}</Text>
                <Text style={{fontSize:17,textAlign: 'center'}}> + </Text>
                <Text style={{fontSize:17,textAlign: 'center'}}>Snacks{"\n"}{snackCalories}</Text>
                <Text style={{fontSize:17,textAlign: 'center'}}> = </Text>
                <Text style={{fontSize:17,textAlign: 'center'}}>Total{"\n"}{totalCalories}kcal</Text>
            </View>
            <Text style={{textAlign:'center', marginTop: 10, fontSize:17, fontStyle:'italic'}}>{String(date).substring(0, 15)}</Text>
            {breakfastVisible === false && breakfastEntered===false ?
                <Pressable style={styles.mealButton} onPress={()=>setBreakfastVisible(true)}>
                    <Text style={{ textAlign: 'center', color: 'white' }}>Add Breakfast</Text>
                </Pressable>
                : breakfastVisible === true && breakfastEntered === false ?
                <View style={{marginLeft: 10,marginTop: 20,}}>
                    <Text style={styles.mealNameText}>Breakfast Name</Text>
                    <TextInput style={styles.mealNameInput} textAlign={'center'} value={breakfastName} onChangeText={text => setBreakfastName(text)}></TextInput>
                    <View style={{flexDirection:'row', justifyContent: 'center', marginLeft: -20}}>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, marginRight: 10}}>Ingredient     </Text>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:40}}>Amount(g/ml)</Text>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:10}}>Calories</Text>
                    </View>
                    {breakfastDisplayArray.map((i,key)=>(

                    <KeyboardAvoidingView style={{flexDirection:'row', justifyContent: 'center'}} key={key} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <TextInput style={styles.ingredientInput} value={breakfastDisplayArray[key].ingredients} onChangeText={text=>updateBreakfastIngredient(key, text)}></TextInput>
                        <TextInput style={styles.amountInput} value={breakfastDisplayArray[key].amount} onChangeText={text=>updateBreakfastAmount(key, text)}></TextInput>
                        <TextInput style={styles.calorieInput} value={breakfastDisplayArray[key].calories} onChangeText={text=>updateBreakfastCalories(key, text)}></TextInput>
                    </KeyboardAvoidingView>
                    ))}
                    <Pressable style={styles.addIngredient}>
                        <Text style={{color:'white', textAlign: 'center'}} onPress={()=>addBreakfastIngredient()}>Add Ingredient</Text>
                    </Pressable>
                    <Pressable style={styles.finishMeal}>
                        <Text style={{color:'white', textAlign: 'center'}} onPress={()=>finishBreakfast()}>Finish Breakfast</Text>
                    </Pressable>
                </View>
                : breakfastEntered === true ?
                <View style={{marginLeft: 10,marginTop: 20,}}>
                    <Text style={{fontWeight: 'bold', textAlign:'center', fontSize: 18, marginBottom: 10}}>Breakfast</Text>
                    <Text style={styles.mealNameText}>{breakfastName}</Text>
                    <View style={{flexDirection:'row', justifyContent: 'center', marginLeft: -20}}>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, width:100, fontWeight: 'bold'}}>Ingredient</Text>
                        <Text style={{fontSize: 16, marginTop: 10, width:110, fontWeight: 'bold'}}>Amount(g/ml)</Text>
                        <Text style={{fontSize: 16, marginTop: 10, width:100, marginLeft: 20, fontWeight: 'bold'}}>Calories</Text>
                    </View>
                    {breakfastDisplayArray.map((i,key)=>(

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: -20 }}>
                            <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, width:100,}}>{breakfastDisplayArray[key].ingredients}</Text>
                            <Text style={{fontSize: 16, marginTop: 10, width:100, textAlign: 'center'}}>{breakfastDisplayArray[key].amount}</Text>
                            <Text style={{fontSize: 16, marginTop: 10, width:100, marginLeft: 10, textAlign: 'center'}}>{breakfastDisplayArray[key].calories}kcal</Text>
                        </View>
                    ))}
                    
                </View>
                : <Text></Text>
            }

            {lunchVisible === false && lunchEntered===false ?
                <Pressable style={styles.mealButton} onPress={()=>setLunchVisible(true)}>
                    <Text style={{ textAlign: 'center', color: 'white' }}>Add Lunch</Text>
                </Pressable>
                : lunchVisible === true && lunchEntered === false ?
                <View style={{marginLeft: 10,marginTop: 20,}}>
                    <Text style={styles.mealNameText}>Lunch Name</Text>
                    <TextInput style={styles.mealNameInput} textAlign={'center'} value={lunchName} onChangeText={text => setLunchName(text)}></TextInput>
                    <View style={{flexDirection:'row', justifyContent: 'center', marginLeft: -20}}>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, marginRight: 10}}>Ingredient     </Text>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:40}}>Amount(g/ml)</Text>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:10}}>Calories</Text>
                    </View>
                    {lunchDisplayArray.map((i,key)=>(

                    <KeyboardAvoidingView style={{flexDirection:'row', justifyContent: 'center'}} key={key} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <TextInput style={styles.ingredientInput} value={lunchDisplayArray[key].ingredients} onChangeText={text=>updateLunchIngredient(key, text)}></TextInput>
                        <TextInput style={styles.amountInput} value={lunchDisplayArray[key].amount} onChangeText={text=>updateLunchAmount(key, text)}></TextInput>
                        <TextInput style={styles.calorieInput} value={lunchDisplayArray[key].calories} onChangeText={text=>updateLunchCalories(key, text)}></TextInput>
                    </KeyboardAvoidingView>
                    ))}
                    <Pressable style={styles.addIngredient}>
                        <Text style={{color:'white', textAlign: 'center'}} onPress={()=>addLunchIngredient()}>Add Ingredient</Text>
                    </Pressable>
                    <Pressable style={styles.finishMeal}>
                        <Text style={{color:'white', textAlign: 'center'}} onPress={()=>finishLunch()}>Finish Lunch</Text>
                    </Pressable>
                </View>
                : lunchEntered === true ?
                <View style={{marginLeft: 10,marginTop: 20,}}>
                    <Text style={{fontWeight: 'bold', textAlign:'center', fontSize: 18, marginBottom: 10}}>Lunch</Text>
                    <Text style={styles.mealNameText}>{lunchName}</Text>
                    <View style={{flexDirection:'row', justifyContent: 'center', marginLeft: -20}}>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, width:100, fontWeight: 'bold'}}>Ingredient</Text>
                        <Text style={{fontSize: 16, marginTop: 10, width:110, fontWeight: 'bold'}}>Amount(g/ml)</Text>
                        <Text style={{fontSize: 16, marginTop: 10, width:100, marginLeft: 20, fontWeight: 'bold'}}>Calories</Text>
                    </View>
                    {lunchDisplayArray.map((i,key)=>(

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: -20 }}>
                            <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, width:100,}}>{lunchDisplayArray[key].ingredients}</Text>
                            <Text style={{fontSize: 16, marginTop: 10, width:100, textAlign: 'center'}}>{lunchDisplayArray[key].amount}</Text>
                            <Text style={{fontSize: 16, marginTop: 10, width:100, marginLeft: 10, textAlign: 'center'}}>{lunchDisplayArray[key].calories}kcal</Text>
                        </View>
                    ))}
                    
                </View>
                : <Text></Text>
            }

            {dinnerVisible === false && dinnerEntered===false ?
                <Pressable style={styles.mealButton} onPress={()=>setDinnerVisible(true)}>
                    <Text style={{ textAlign: 'center', color: 'white' }}>Add Dinner</Text>
                </Pressable>
                : dinnerVisible === true && dinnerEntered === false ?
                <View style={{marginLeft: 10,marginTop: 20,}}>
                    <Text style={styles.mealNameText}>Dinner Name</Text>
                    <TextInput style={styles.mealNameInput} textAlign={'center'} value={dinnerName} onChangeText={text => setDinnerName(text)}></TextInput>
                    <View style={{flexDirection:'row', justifyContent: 'center', marginLeft: -20}}>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, marginRight: 10}}>Ingredient     </Text>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:40}}>Amount(g/ml)</Text>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:10}}>Calories</Text>
                    </View>
                    {dinnerDisplayArray.map((i,key)=>(

                    <KeyboardAvoidingView style={{flexDirection:'row', justifyContent: 'center'}} key={key} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <TextInput style={styles.ingredientInput} value={dinnerDisplayArray[key].ingredients} onChangeText={text=>updateDinnerIngredient(key, text)}></TextInput>
                        <TextInput style={styles.amountInput} value={dinnerDisplayArray[key].amount} onChangeText={text=>updateDinnerAmount(key, text)}></TextInput>
                        <TextInput style={styles.calorieInput} value={dinnerDisplayArray[key].calories} onChangeText={text=>updateDinnerCalories(key, text)}></TextInput>
                    </KeyboardAvoidingView>
                    ))}
                    <Pressable style={styles.addIngredient}>
                        <Text style={{color:'white', textAlign: 'center'}} onPress={()=>addDinnerIngredient()}>Add Ingredient</Text>
                    </Pressable>
                    <Pressable style={styles.finishMeal}>
                        <Text style={{color:'white', textAlign: 'center'}} onPress={()=>finishDinner()}>Finish Dinner</Text>
                    </Pressable>
                </View>
                : dinnerEntered === true ?
                <View style={{marginLeft: 10,marginTop: 20,}}>
                    <Text style={{fontWeight: 'bold', textAlign:'center', fontSize: 18, marginBottom: 10}}>Dinner</Text>
                    <Text style={styles.mealNameText}>{dinnerName}</Text>
                    <View style={{flexDirection:'row', justifyContent: 'center', marginLeft: -20}}>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, width:100, fontWeight: 'bold'}}>Ingredient</Text>
                        <Text style={{fontSize: 16, marginTop: 10, width:110, fontWeight: 'bold'}}>Amount(g/ml)</Text>
                        <Text style={{fontSize: 16, marginTop: 10, width:100, marginLeft: 20, fontWeight: 'bold'}}>Calories</Text>
                    </View>
                    {dinnerDisplayArray.map((i,key)=>(

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: -20 }}>
                            <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, width:100,}}>{dinnerDisplayArray[key].ingredients}</Text>
                            <Text style={{fontSize: 16, marginTop: 10, width:100, textAlign: 'center'}}>{dinnerDisplayArray[key].amount}</Text>
                            <Text style={{fontSize: 16, marginTop: 10, width:100, marginLeft: 10, textAlign: 'center'}}>{dinnerDisplayArray[key].calories}kcal</Text>
                        </View>
                    ))}
                
                    
                </View>
                : <Text></Text>
            }
            
            {/* {snackVisible === true && snackEntered === false ?
                <View style={{marginLeft: 10,marginTop: 20,}}>
                    <Text style={styles.mealNameText}>Snack Name</Text>
                    <TextInput style={styles.mealNameInput} textAlign={'center'} value={snackName} onChangeText={text => setSnackName(text)}></TextInput>
                    <View style={{flexDirection:'row', justifyContent: 'center', marginLeft: -20}}>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, marginRight: 10}}>Ingredient     </Text>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:40}}>Amount(g/ml)</Text>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:10}}>Calories</Text>
                    </View>
                    {snackDisplayArray.map((i,key)=>(

                    <KeyboardAvoidingView style={{flexDirection:'row', justifyContent: 'center'}} key={key} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <TextInput style={styles.ingredientInput} value={snackDisplayArray[key].ingredients} onChangeText={text=>updateSnackIngredient(key, text)}></TextInput>
                        <TextInput style={styles.amountInput} value={snackDisplayArray[key].amount} onChangeText={text=>updateSnackAmount(key, text)}></TextInput>
                        <TextInput style={styles.calorieInput} value={snackDisplayArray[key].calories} onChangeText={text=>updateSnackCalories(key, text)}></TextInput>
                    </KeyboardAvoidingView>
                    ))}
                    <Pressable style={styles.addIngredient}>
                        <Text style={{color:'white', textAlign: 'center'}} onPress={()=>addSnackIngredient()}>Add Ingredient</Text>
                    </Pressable>
                    <Pressable style={styles.finishMeal}>
                        <Text style={{color:'white', textAlign: 'center'}} onPress={()=>finishSnack()}>Finish Snack</Text>
                    </Pressable>
                </View>
                : snackEntered === true ?
                <View style={{marginLeft: 10,marginTop: 20,}}>
                    <Text style={{fontWeight: 'bold', textAlign:'center', fontSize: 18, marginBottom: 10}}>Snack/s</Text>
                    <Text style={styles.mealNameText}>{snackName}</Text>
                    <View style={{flexDirection:'row', justifyContent: 'center', marginLeft: -20}}>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, width:100, fontWeight: 'bold'}}>Ingredient</Text>
                        <Text style={{fontSize: 16, marginTop: 10, width:110, fontWeight: 'bold'}}>Amount(g/ml)</Text>
                        <Text style={{fontSize: 16, marginTop: 10, width:100, marginLeft: 20, fontWeight: 'bold'}}>Calories</Text>
                    </View>
                    {snackDisplayArray.map((i,key)=>(

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: -20 }}>
                            <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, width:100,}}>{snackDisplayArray[key].ingredients}</Text>
                            <Text style={{fontSize: 16, marginTop: 10, width:100, textAlign: 'center'}}>{snackDisplayArray[key].amount}</Text>
                            <Text style={{fontSize: 16, marginTop: 10, width:100, marginLeft: 10, textAlign: 'center'}}>{snackDisplayArray[key].calories}kcal</Text>
                        </View>
                    ))}
                
                    
                </View>
                : <Text></Text>
            } */}
            {snackEntered === true &&
            snacks.map((s, key)=>(
                <View style={{marginLeft: 10,marginTop: 20,}}>
                <Text style={{fontWeight: 'bold', textAlign:'center', fontSize: 18, marginBottom: 10}}>Snack</Text>
                <Text style={styles.mealNameText}>{s.name}</Text>
                <View style={{flexDirection:'row', justifyContent: 'center', marginLeft: -20}}>
                    <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, width:100, fontWeight: 'bold'}}>Ingredient</Text>
                    <Text style={{fontSize: 16, marginTop: 10, width:110, fontWeight: 'bold'}}>Amount(g/ml)</Text>
                    <Text style={{fontSize: 16, marginTop: 10, width:100, marginLeft: 20, fontWeight: 'bold'}}>Calories</Text>
                </View>
                {s.snack.map((i,key)=>(

                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: -20 }}>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, width:100,}}>{i.ingredients}</Text>
                        <Text style={{fontSize: 16, marginTop: 10, width:100, textAlign: 'center'}}>{i.amount}</Text>
                        <Text style={{fontSize: 16, marginTop: 10, width:100, marginLeft: 10, textAlign: 'center'}}>{i.calories}kcal</Text>
                    </View>
                ))}
            
                
            </View>
            ))
            }
            {snackVisible === true && 
                <View style={{marginLeft: 10,marginTop: 20,}}>
                    <Text style={styles.mealNameText}>Snack Name</Text>
                    <TextInput style={styles.mealNameInput} textAlign={'center'} value={snackName} onChangeText={text => setSnackName(text)}></TextInput>
                    <View style={{flexDirection:'row', justifyContent: 'center', marginLeft: -20}}>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:50, marginRight: 10}}>Ingredient     </Text>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:40}}>Amount(g/ml)</Text>
                        <Text style={{fontSize: 16, marginTop: 10, marginLeft:10}}>Calories</Text>
                    </View>
                    {snackDisplayArray.map((i,key)=>(

                    <KeyboardAvoidingView style={{flexDirection:'row', justifyContent: 'center'}} key={key} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <TextInput style={styles.ingredientInput} value={snackDisplayArray[key].ingredients} onChangeText={text=>updateSnackIngredient(key, text)}></TextInput>
                        <TextInput style={styles.amountInput} value={snackDisplayArray[key].amount} onChangeText={text=>updateSnackAmount(key, text)}></TextInput>
                        <TextInput style={styles.calorieInput} value={snackDisplayArray[key].calories} onChangeText={text=>updateSnackCalories(key, text)}></TextInput>
                    </KeyboardAvoidingView>
                    ))}
                    <Pressable style={styles.addIngredient}>
                        <Text style={{color:'white', textAlign: 'center'}} onPress={()=>addSnackIngredient()}>Add Ingredient</Text>
                    </Pressable>
                    <Pressable style={styles.finishMeal}>
                        <Text style={{color:'white', textAlign: 'center'}} onPress={()=>finishSnack()}>Finish Snack</Text>
                    </Pressable>
                </View>
            }
            <Pressable style={styles.mealButton} onPress={()=>addSnack()}>
                    <Text style={{ textAlign: 'center', color: 'white' }}>Add Snack</Text>
            </Pressable>
        </ScrollView>
        </KeyboardAvoidingView>
      )
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
          textAlign: 'center'
      },
      header: {
          fontSize: 17,
          textAlign: 'center',
          marginRight: 40
      },
      mealButton: {
          backgroundColor: '#00a1d0',
          width: 130,
          height: 50,
          borderRadius: 15,
          justifyContent: 'center',
          marginTop: 20,
          marginLeft: 10
      },
      mealNameText:{
        fontSize: 18,
        alignSelf: 'center'
      },
      mealNameInput: {
          width: '80%',
          height: 40,
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 15,
          alignSelf: 'center'
      },
      ingredientInput: {
        width: 160,
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
      },
      amountInput: {
        width: 60,
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        marginLeft: 30
      },
      calorieInput: {
        width: 60,
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        marginLeft: 30
      },
      deleteButton: {
          backgroundColor: 'red',
          width: 40,
          height: 40,
          borderRadius: 15,
          marginLeft: 10,
      },
      addIngredient: {
        backgroundColor: '#00a1d0',
        width: '80%',
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginLeft: 10
      },
      finishMeal: {
        backgroundColor: '#00c921',
        width: '80%',
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginLeft: 10
      }
})