import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Feather from "@expo/vector-icons/Feather";
import { Household } from "../firebase/models/Household";
import { auth } from "../firebase/config";
import { getFirestore, doc } from "firebase/firestore";

export const CreateHouseholdBottomSheetForm = ({ onClose }) => {
  const snapPoints = useMemo(() => ["70%"], []);
  const [householdName, setHouseholdName] = useState("");
  const [isHouseholdNameValid, setIsHouseholdNameValid] = useState(false);
  const [householdNameProvided, setHouseholdNameProvided] = useState(false);
  const curentUser = auth.currentUser;

  const validateHouseholdName = () => {
    if (householdName.length === 0) {
      setHouseholdNameProvided(false);
    } else {
      setHouseholdNameProvided(true);
      if (householdName.length < 5) {
        setIsHouseholdNameValid(false);
      } else {
        setIsHouseholdNameValid(true);
      }
    }
  };

  const validateInput = () => {
    if (householdNameProvided) {
      if (isHouseholdNameValid) {
        return true;
      } else {
        return false;
      }
    }
  };

  const createNewHousehold = async () => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, `users/${curentUser.uid}`);
      const householdToCreate = new Household(
        householdName,
        [userDocRef],
        [userDocRef],
        ""
      );
      const householdDocRef = await Household.createHousehold(
        householdToCreate
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
        enablePanDownToClose={false}
      >
        <BottomSheetView>
          <View style={styles.createHouseholdTitleContainer}>
            <Text style={styles.createHouseholdTitle}>Create Household</Text>
            <Pressable style={{ marginHorizontal: 5 }} onPress={onClose}>
              <Feather name="x-circle" size={28} color="red" />
            </Pressable>
          </View>

          <View style={styles.househouldInputContainer}>
            <View style={styles.inputAndErrorMessageContainer}>
              <TextInput
                style={styles.input}
                name="householdName"
                value={householdName}
                placeholder="Household Name"
                onChangeText={(householdName) =>
                  setHouseholdName(householdName)
                }
                onBlur={(householdName) => validateHouseholdName(householdName)}
              ></TextInput>
              {householdNameProvided && !isHouseholdNameValid ? (
                <Text style={styles.invalidInput}>
                  Name must contain at least 5 characters.
                </Text>
              ) : null}
            </View>

            <Pressable
              style={[
                styles.createHouseholdButton,
                validateInput() ? null : styles.disabledButton,
              ]}
              disabled={validateInput() ? false : true}
              onPress={createNewHousehold}
            >
              <Text style={styles.createHouseholdButtonText}>Create</Text>
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
    flexGrow: 1, // Ensures title stays visible when typing
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10, // Added margin to prevent title from shifting
  },

  createHouseholdTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 10,
  },

  househouldInputContainer: {
    display: "flex",
    flexDirection: "row", // Changed from row to column for better input alignment
    alignItems: "flex-start",
    justifyContent: "space-around",
    margin: 10,
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
    marginBottom: 10, // Added margin for spacing
    marginLeft: 10,
  },

  invalidInput: {
    color: "#EF2A39",
    fontWeight: "500",
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 10,
  },

  createHouseholdButton: {
    alignItems: "center",
    justifyContent: "center",
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

  disabledButton: {
    backgroundColor: "gray",
    borderColor: "gray",
    opacity: 0.6,
  },
});
