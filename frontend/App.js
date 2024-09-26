import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { addDocument, getDocuments } from './firebase/firebaseFunctions';
import { HomeScreen } from './screens/HomeScreen/HomeScreen';

export default function App() {
  useEffect(() => {
    const testFirestore = async () => {
      // Adding a test user to firestore
      await addDocument('users', { name: 'Joe Shmoe', age: "24" });

      // Get documents from the "testCollection"
      const users = await getDocuments('users');
      console.log('Retrieved users:', users);
    };

    testFirestore();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text>Created a user in firestore.</Text> */}
      <HomeScreen />
       {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});