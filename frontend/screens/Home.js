import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { auth } from "../firebase/config";
import { Household } from "../firebase/models/Household";

export const Home = () => {
  const [hasAssociatedHousehold, setHasAssociatedHousehold] = useState(false);
  const currentUser = auth.currentUser;

  const checkIfUserHasAssociatedHousehold = async () => {
    const userHouseholds = await Household.getHouseholdsByUser(currentUser.uid);
    // If the querySnapshot is not empty, then the user is in a household
    if (!userHouseholds.empty) {
      setHasAssociatedHousehold(true);
    } else {
      setHasAssociatedHousehold(false);
    }
  };

  useEffect(() => {
    checkIfUserHasAssociatedHousehold();
  }, []);

  function Greeting() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome, {currentUser.email}</Text>
        {hasAssociatedHousehold ? (
          <Text>You are in a household</Text>
        ) : (
          <Text>
            You are not in a household. Please create a new household or join an
            existing one!
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container} initialRouteName="Home">
      <Greeting />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "red",
    fontWeight: "bold",
    fontSize: 24,
  },
});
