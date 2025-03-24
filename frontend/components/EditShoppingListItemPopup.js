import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { HouseholdContext } from "../context/HouseholdContext";
import { RequestedItem } from "../firebase/models/RequestedItem";
import { ScrollView } from "react-native-gesture-handler";

export const EditShoppingListItemPopup = ({ visible, onClose, requestedItem, shoppingListId }) => {
  const {
    id: requestedItemId,
    name: itemName,
    brand,
    quantityRequested,
    allergens = [],
    categories = [],
    itemRequester,
    dateRequested,
  } = requestedItem;

  const { householdId } = useContext(HouseholdContext);

  const [newItemName, setNewItemName] = useState(itemName);
  const [newBrand, setNewBrand] = useState(brand);
  const [newQuantity, setNewQuantity] = useState(quantityRequested.toString());
  const [newCategories, setNewCategories] = useState(categories);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newAllergens, setNewAllergens] = useState(allergens);
  const [newAllergenInput, setNewAllergenInput] = useState("");
  const [isItemNameValid, setIsItemNameValid] = useState(true);
  const [isQuantityValid, setIsQuantityValid] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Validate that item with same name and brand is not already in the list
  const checkItemInList = async () => {
    // Get all items in the list
    const itemsAlreadyInList = await RequestedItem.getRequestedItems(
      householdId,
      shoppingListId
    );
    return (itemsAlreadyInList.length !== 0 && 
      itemsAlreadyInList.some((item) => item.name === newItemName && item.brand === newBrand && item.id !== requestedItemId));
  };

  // Validate item name isn't empty
  const validateItemName = () => {
    const isValid = newItemName.trim().length > 0;
    setIsItemNameValid(isValid);
  };

  // Validate quantity is a number greater than 0
  const validateQuantity = () => {
    const isValid = newQuantity.trim().length > 0 && !isNaN(newQuantity) && parseInt(newQuantity) > 0;
    setIsQuantityValid(isValid);
  };

  // Function to add a new category
  const addCategory = () => {
    const newCategory = newCategoryInput.trim();
    if (newCategory.length > 0) {
      // Check if category already exists (case insensitive)
      if (newCategories !== "Unknown" && !newCategories.some(cat => cat.toLowerCase() === newCategory.toLowerCase())) {
        setNewCategories([...newCategories, newCategory]);
      }
      setNewCategoryInput("");
    }
  };

  // Function to remove a category
  const removeCategory = (categoryToRemove) => {
    setNewCategories(newCategories.filter(category => category !== categoryToRemove));
  };

  // Function to add a new allergen
  const addAllergen = () => {
    const newAllergen = newAllergenInput.trim();
    if (newAllergen.length > 0) {
      // Check if allergen already exists (case insensitive)
      if (newAllergens !== "Unknown" && !newAllergens.some(allergen => allergen.toLowerCase() === newAllergen.toLowerCase())) {
        setNewAllergens([...newAllergens, newAllergen]);
      }
      setNewAllergenInput("");
    }
  };

  // Function to remove an allergen
  const removeAllergen = (allergenToRemove) => {
    setNewAllergens(newAllergens.filter(allergen => allergen !== allergenToRemove));
  };

  // Edit item in list
  const handleEditItem = async () => {
    try {
      // Validate item is not already in list
      if (await checkItemInList()) {
        // If item is in list, show error message
        Alert.alert(
          "Duplicate item",
          "This item already exists in your list.",
          [{ text: "Cancel" }]
        );
        return;
      }

      // Update current item's params with newest values
      requestedItem.name = newItemName;
      requestedItem.brand = newBrand;
      requestedItem.quantityRequested = newQuantity;
      requestedItem.categories = newCategories;
      requestedItem.allergens = newAllergens;

      // Update item in database
      await RequestedItem.updateRequestedItem(
        householdId,
        shoppingListId,
        requestedItemId,
        requestedItem
      );

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error editing item: ", error);
      Alert.alert(
        "Error",
        "Failed to update item. Please try again.",
        [{ text: "OK" }]
      );
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
            <Text style={styles.title}>Edit Product</Text>
            <Pressable onPress={onClose}>
              <Feather name="x-circle" size={28} color="#EF2A39" />
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Name*</Text>
              <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={newItemName}
                onChangeText={(text) => setNewItemName(text)}
                onBlur={validateItemName}
              />
              {!isItemNameValid && (
                <Text style={styles.invalidInput}>
                  Please enter a product name.
                </Text>
              )}
            </View>
          
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Brand</Text>
              <TextInput
                style={styles.input}
                placeholder="Product Brand"
                value={newBrand}
                onChangeText={(text) => setNewBrand(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Quantity*</Text>
              <View style={styles.quantityContainer}>
                <Pressable 
                  style={styles.quantityButton}
                  onPress={() => {
                    const currentValue = parseInt(newQuantity) || 0;
                    if (currentValue > 1) {
                      setNewQuantity((currentValue - 1).toString());
                    }
                  }}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>
                <TextInput
                  style={styles.quantityInput}
                  placeholder="Qty"
                  value={newQuantity}
                  onChangeText={(text) => setNewQuantity(text)}
                  onBlur={validateQuantity}
                  keyboardType="numeric"
                />
                <Pressable 
                  style={styles.quantityButton}
                  onPress={() => {
                    const currentValue = parseInt(newQuantity) || 0;
                    setNewQuantity((currentValue + 1).toString());
                    if (!isQuantityValid) {
                      setIsQuantityValid(true);
                    }
                  }}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
              </View>
              {!isQuantityValid && (
                <Text style={styles.invalidInput}>
                  Quantity must be greater than zero.
                </Text>
              )}
            </View>
          
            {/* Categories Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Categories</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="Add a category"
                  value={newCategoryInput}
                  onChangeText={setNewCategoryInput}
                  onSubmitEditing={addCategory}
                />
                <Pressable style={styles.addButton} onPress={addCategory}>
                  <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
              </View>
              
              <View style={styles.tagsContainer}>
                {newCategories !== "Unknown" && newCategories.map((category, index) => (
                  category.length > 0 &&
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{category}</Text>
                    <Pressable onPress={() => removeCategory(category)} style={styles.removeTag}>
                      <Feather name="x" size={16} color="white" />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Allergens Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Allergens</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="Add an allergen"
                  value={newAllergenInput}
                  onChangeText={setNewAllergenInput}
                  onSubmitEditing={addAllergen}
                />
                <Pressable style={styles.addButton} onPress={addAllergen}>
                  <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
              </View>
              
              <View style={styles.tagsContainer}>
                {newAllergens !== "Unknown" && newAllergens.map((allergen, index) => (
                  allergen.length > 0 &&
                  <View key={index} style={[styles.tag, styles.allergenTag]}>
                    <Text style={styles.tagText}>{allergen}</Text>
                    <Pressable onPress={() => removeAllergen(allergen)} style={styles.removeTag}>
                      <Feather name="x" size={16} color="white" />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.saveButton,
                isItemNameValid && isQuantityValid ? null : styles.disabledButton,
              ]}
              onPress={handleEditItem}
              disabled={!(isItemNameValid && isQuantityValid)}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <Modal
        visible={showSuccessToast}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessToast(false)}
      >
        <View style={styles.toast}>
          <View style={styles.toastContent}>
            <Feather name="check-circle" size={24} color="white" />
            <Text style={styles.toastText}>Item successfully updated!</Text>
          </View>
        </View>
      </Modal>
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
    width: "84%",
    maxHeight: "70%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  invalidInput: {
    color: "#EF2A39",
    marginTop: 5,
    fontSize: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    marginHorizontal: 10,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EF2A39",
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#EF2A39",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "700",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  allergenTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  tagText: {
    color: "#333",
    marginRight: 5,
  },
  removeTag: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(108, 117, 125, 0.7)",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#EF2A39",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: "rgba(239, 42, 57, 0.4)",
  },
  toast: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  toastContent: {
    flexDirection: "row",
    backgroundColor: "rgb(40, 167, 69)",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  toastText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
  },
  toastOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
