import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Feather from "@expo/vector-icons/Feather";
import { Household } from "../firebase/models/Household";
import { auth } from "../firebase/config";

export const CreateHouseholdBottomSheetForm = ({ onClose }) => {
  const snapPoints = useMemo(() => ["20%", "80%"], []);
  const [householdName, setHouseholdName] = useState("");
  const curentUser = auth.currentUser;

  const createNewHousehold = async () => {
    try {
      const householdToCreate = new Household(householdName, [], []);
      const householdDocRef = await Household.createHousehold(
        householdToCreate,
        curentUser.uid
      );
      console.log("Household created with ID: ", householdDocRef.id);
      return householdDocRef;
    } catch (error) {
      console.error("Error creating household: ", error);
    } finally {
      setHouseholdName("");
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <BottomSheet
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
      >
        <BottomSheetView>
          <View style={styles.createHouseholdTitleContainer}>
            <Text style={styles.createHouseholdTitle}>Create Household</Text>
            <Pressable style={{ marginHorizontal: 5 }} onPress={onClose}>
              <Feather name="x-circle" size={28} color="red" />
            </Pressable>
          </View>

          <View style={styles.househouldInputContainer}>
            <TextInput
              style={styles.input}
              name="householdName"
              value={householdName}
              placeholder="Household Name"
              onChangeText={(householdName) => setHouseholdName(householdName)}
            ></TextInput>

            <Pressable style={styles.createHouseholdButton}>
              <Text
                style={styles.createHouseholdButtonText}
                onPress={createNewHousehold}
              >
                Create
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  createHouseholdTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  createHouseholdTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 5,
  },

  househouldInputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 0,
    margin: 20,
  },

  input: {
    padding: 10,
    width: 200,
    height: 40,
    borderRadius: 4,
    backgroundColor: "white",
    fontWeight: "700",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  createHouseholdButton: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "white",
    borderColor: "#EF2A39",
    borderWidth: 2,
    borderRadius: 30,
    width: 80,
    backgroundColor: "#EF2A39",
    padding: 8,
  },

  createHouseholdButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
