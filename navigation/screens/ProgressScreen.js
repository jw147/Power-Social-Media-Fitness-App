import { StyleSheet, Text, View } from 'react-native';
import React from 'react';


export default function ProgressScreen({ navigation }) {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Showing:</Text>
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
});
