import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { firebaseConfig } from './firebase/config';

// initializing firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const App = () => {
    return (
      <View style={styles.container}>
        <Text>Welcome to My React Native App with Firebase!</Text>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
});
  
export default App;
