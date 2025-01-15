import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Household } from "../firebase/models/Household";
import { auth } from "../firebase/config";
import { getFirestore, doc } from "firebase/firestore";

export const CreateHouseholdPopup = ({ visible, onClose }) => {
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
      return isHouseholdNameValid;
    }
    return false;
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
    } catch (error) {
      console.error("Error creating household: ", error);
    } finally {
      setHouseholdName("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Household</Text>
            <Pressable onPress={onClose}>
              <Feather name="x-circle" size={28} color="red" />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Household Name"
              value={householdName}
              onChangeText={(text) => setHouseholdName(text)}
              onBlur={validateHouseholdName}
            />
            {householdNameProvided && !isHouseholdNameValid && (
              <Text style={styles.invalidInput}>
                Name must contain at least 5 characters.
              </Text>
            )}
          </View>

          <Pressable
            style={[
              styles.createButton,
              validateInput() ? null : styles.disabledButton,
            ]}
            onPress={createNewHousehold}
            disabled={!validateInput()}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  invalidInput: {
    color: "#EF2A39",
    marginTop: 5,
    fontSize: 14,
  },
  createButton: {
    backgroundColor: "#EF2A39",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});
