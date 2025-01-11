import React, { useState, useContext } from "react";
import { Text, View, Button } from "react-native";
import { HouseholdContext } from "../context/HouseholdContext";
import { AddItemShoppingList } from "../components/AddItemShoppingList"; // Adjust the path as necessary

export const ShoppingList = () => {
  const { householdId, householdName } = useContext(HouseholdContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]);

  const handleAddItem = (itemName) => {
    setItems([...items, itemName]);
  };

  return (
    <View>
      <Text> Shopping List Screen </Text>
      <Text> Household Name: {householdName} </Text>
      <Text> Household ID: {householdId} </Text>
      <Button title="Add Item" onPress={() => setModalVisible(true)} />
      {items.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
      <AddItemShoppingList
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddItem={handleAddItem}
      />
    </View>
  );
};