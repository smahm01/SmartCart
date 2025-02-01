import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Modal } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { ShoppingList } from "../firebase/models/ShoppingList";
import { HouseholdContext } from "../context/HouseholdContext";

export const CreateShoppingListPopup = ({ onClose }) => {
  const [shoppingListName, setShoppingListName] = useState("");
  const [shoppingListCategory, setShoppingListCategory] = useState("None");
  const [isShoppingListNameValid, setIsShoppingListNameValid] = useState(false);
  const [shoppingListNameProvided, setShoppingListNameProvided] = useState(false);
  const { householdId } = useContext(HouseholdContext);

  const validateShoppingListName = () => {
    if (shoppingListName.length === 0) {
      setShoppingListNameProvided(false);
      setIsShoppingListNameValid(false);
    } else {
        setShoppingListNameProvided(true);
        if (shoppingListName.length < 5) {
            setIsShoppingListNameValid(false);
        } else {
            setIsShoppingListNameValid(true);
        }
    }
  };

  const createNewShoppingList = async () => {
    try {
        const shoppingListToCreate = new ShoppingList(
            householdId,
            shoppingListCategory,
            shoppingListName,
            ""
        );
        const shoppingListDocRef = await ShoppingList.createShoppingList(
            householdId,
            shoppingListToCreate
        );
        console.log("Shopping List created with ID: ", shoppingListDocRef.id);
        return shoppingListDocRef;
    } catch (error) {
        console.error("Error creating shopping list: ", error);
    } finally {
        setShoppingListName("");
        onClose();
    }
  };

  return (
      <Modal
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create Shopping List</Text>
              <Pressable onPress={onClose}>
                <Feather name="x-circle" size={28} color="red" />
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputItem}>
                <TextInput
                  style={styles.input}
                  name="shoppingListName"
                  value={shoppingListName}
                  placeholder="Shopping List Name"
                  onChangeText={(shoppingListName) =>
                    setShoppingListName(shoppingListName)
                  }
                  onBlur={validateShoppingListName}
                ></TextInput>
                {shoppingListNameProvided && !isShoppingListNameValid && (
                  <Text style={styles.invalidInput}>
                    Name must contain at least 5 characters.
                  </Text>
                )}
              </View>

              <View style={styles.inputItem}>
                <TextInput
                  style={styles.input}
                  name="shoppingListCategory"
                  value={shoppingListCategory === "None" ? "" : shoppingListCategory}
                  placeholder="Shopping List Category"
                  onChangeText={(shoppingListCategory) =>
                    setShoppingListCategory(shoppingListCategory)
                  }
                ></TextInput>
              </View>
            </View>
            <Pressable
              style={[
                styles.createButton,
                isShoppingListNameValid ? null : styles.disabledButton,
              ]}
              disabled={!isShoppingListNameValid}
              onPress={createNewShoppingList}
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

  titleContainer: {
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
    marginBottom: 12,
  },
  inputItem: {
    marginBottom: 8,
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
