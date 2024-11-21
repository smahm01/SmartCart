import React from "react";
import { Text, View } from "react-native";
import { useContext } from "react";
import { HouseholdContext } from "../context/HouseholdContext";

export const ShoppingList = () => {
  const { householdId, householdName } = useContext(HouseholdContext);

  return (
    <View>
      <Text> Shopping List Screen </Text>
      <Text> Household Name: {householdName} </Text>
      <Text> Household ID: {householdId} </Text>
    </View>
  );
};
