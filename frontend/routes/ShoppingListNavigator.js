import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingList from '../screens/ShoppingList'; 
import AddItemShoppingList from '../components/AddItemShoppingList'; 

const Stack = createStackNavigator();

export const ShoppingListNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ShoppingList">
      <Stack.Screen name="ShoppingList" component={ShoppingList} />
      <Stack.Screen name="AddItemShoppingList" component={AddItemShoppingList} />
    </Stack.Navigator>
  );
};

