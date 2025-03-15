import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ShoppingList } from "../screens/ShoppingList";
import { ShoppingListContent } from "../screens/ShoppingListContent";
import { AddItemShoppingList } from "../screens/AddItemShoppingList";
import { AddCustomItemShoppingList } from "../screens/AddCustomItemShoppingList";
import { RecipeSuggestions } from "../screens/RecipeSuggestions";
import { ScanItem } from "../screens/ScanItem";

const Stack = createStackNavigator();

export const ShoppingListStack = ({ route }) => {
    const { shoppingListName, shoppingListId, shoppingListCategory, shoppingListItems } = route.params;
    return (
        <Stack.Navigator
            initialRouteName="ShoppingList"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen 
                name="ShoppingList" 
                component={ShoppingList}
            />
            <Stack.Screen 
                name="ShoppingListContent" 
                component={ShoppingListContent} 
                initialParams={{
                    shoppingListName: shoppingListName,
                    shoppingListId: shoppingListId,
                    shoppingListCategory: shoppingListCategory
                }}
            />
            <Stack.Screen 
                name="AddItemShoppingList"
                component={AddItemShoppingList}
                initialParams={{
                    shoppingListName: shoppingListName,
                    shoppingListId: shoppingListId,
                    shoppingListCategory: shoppingListCategory
                }}
            />
            <Stack.Screen 
                name="AddCustomItemShoppingList"
                component={AddCustomItemShoppingList}
                initialParams={{
                    shoppingListName: shoppingListName,
                    shoppingListId: shoppingListId,
                    shoppingListCategory: shoppingListCategory
                }}
            />
            <Stack.Screen
                name="ScanItem"
                component={ScanItem}
            />
            <Stack.Screen 
                name="RecipeSuggestions"
                component={RecipeSuggestions}
                initialParams={{
                    shoppingListName: shoppingListName,
                    shoppingListId: shoppingListId,
                    shoppingListCategory: shoppingListCategory,
                    shoppingListItems: shoppingListItems
                }}
            />
        </Stack.Navigator>
    );
};