import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { auth } from "../firebase/config";
import { Household } from "../firebase/models/Household";
import { AddButton } from "../components/AddButton";
import { CreateHouseholdBottomSheetForm } from "../components/CreateHouseholdBottomSheetForm";

export const Home = () => {
  const [hasAssociatedHousehold, setHasAssociatedHousehold] = useState(false);
  const [showCreateHouseholBottomSheet, setShowCreateHouseholdBottomSheet] =
    useState(false);
  const currentUser = auth.currentUser;

  const openCreateHouseholdBottomSheet = () => {
    setShowCreateHouseholdBottomSheet(true);
  };

  const closeCreateHouseholdBottomSheet = () => {
    setShowCreateHouseholdBottomSheet(false);
  };

  const checkIfUserHasAssociatedHousehold = async () => {
    const userHouseholds = await Household.getHouseholdsByUser(currentUser.uid);
    if (!userHouseholds.empty) {
      setHasAssociatedHousehold(true);
    } else {
      setHasAssociatedHousehold(false);
    }
  };

  useEffect(() => {
    checkIfUserHasAssociatedHousehold();
  }, [showCreateHouseholBottomSheet]);

  function Greeting() {
    return (
      <View>
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
      <View style={styles.addButtonContainer}>
        <AddButton
          style={styles.addHouseholdButton}
          color="#EF2A39"
          size="56"
          onPress={openCreateHouseholdBottomSheet}
        />
      </View>
      {showCreateHouseholBottomSheet ? (
        <CreateHouseholdBottomSheetForm
          onClose={closeCreateHouseholdBottomSheet}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  addButtonContainer: {
    position: "absolute",
    bottom: 25,
    right: 25,
  },

  text: {
    color: "red",
    fontWeight: "bold",
    fontSize: 24,
  },
});
