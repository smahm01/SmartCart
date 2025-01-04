import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScanItem } from "../screens/ScanItem";
import { ScannedItemDetails } from "../screens/ScannedItemDetails";

const Stack = createStackNavigator();

export const ScanItemStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ScanItem"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ScanItem" component={ScanItem} />
      <Stack.Screen name="ScannedItemDetails" component={ScannedItemDetails} />
    </Stack.Navigator>
  );
};
