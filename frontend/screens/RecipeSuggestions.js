import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { HouseholdContext } from "../context/HouseholdContext";
import { BackButton } from "../components/BackButton";
import { RequestedItemCard } from "../components/RequestedItemCard";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { AddButton } from "../components/AddButton";
import { SearchButton } from "../components/SearchButton";
import { FindRecipesButton } from "../components/FindRecipesButton";

export const RecipeSuggestions = ({ route }) => {
    const { shoppingListName, shoppingListId, shoppingListCategory, shoppingListItems } = route.params;

    return (
        <View>
            <Text>Recipe Suggestions</Text>
            <Text>Shopping List Name: {shoppingListName}</Text>
            <Text>Shopping List ID: {shoppingListId}</Text>
            <Text>Shopping List Category: {shoppingListCategory}</Text>
            <Text>Shopping List Length: {shoppingListItems.length}</Text>
        </View>
    );
}


