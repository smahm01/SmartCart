import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const HouseholdCard = ({documentId}) => {
  const [houseName, setHouseName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouseName = async () => {
      try {
        const db = getFirestore();
        const docRef = doc(db, 'houses', documentId); // Replace 'houses' and 'houseId' with your Firestore data
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHouseName(docSnap.data().name); // Assuming "name" is the field in the document
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching house name: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseName();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.houseName}>{houseName || "House Name Unavailable"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 3, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4, // iOS shadow
  },
  houseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HouseholdCard;
