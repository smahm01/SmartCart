import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, Image } from "react-native";
import { HouseholdContext } from "../context/HouseholdContext";
import { BackButton } from "../components/BackButton";
import { RequestedItemCard } from "../components/RequestedItemCard";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore, spoonacularAPIKey } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { AddButton } from "../components/AddButton";
import { SearchButton } from "../components/SearchButton";
import { FindRecipesButton } from "../components/FindRecipesButton";
import axios from "axios";

export const RecipeSuggestions = ({ route }) => {
    const { shoppingListName, shoppingListId, shoppingListCategory, shoppingListItems } = route.params;

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${spoonacularAPIKey}&ingredients=apples,+flour,+potatoes`)
                console.log(response.status)
                console.log('API Response:', response.data);
                if (Array.isArray(response.data)) {
                    setRecipes(response.data);    
                } else {
                    console.error('API response is not an array:', response.data);
                    setRecipes([]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recipes:', err);
                setError(err);
                setRecipes([]);
                setLoading(false);
            }
        }
        fetchRecipes();
    }, []);

    if (loading) {
        return <Text>Loading recipes...</Text>
    }

    if (error) {
        return <Text>Error fetching recipes: {error}</Text>
    }

    console.log('Recipes:', recipes);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Recipe Suggestions</Text>
            <Text>Shopping List Name: {shoppingListName}</Text>
            <Text>Shopping List ID: {shoppingListId}</Text>
            <Text>Shopping List Category: {shoppingListCategory}</Text>
            <Text>Shopping List Length: {shoppingListItems.length}</Text>

            {/* Display the fetched recipes */}
            <Text style={styles.subHeader}>Recipes:</Text>
            {Array.isArray(recipes) && recipes.length > 0 ? (
                recipes.map((recipe) => (
                    <View key={recipe.id} style={styles.recipeCard}>
                        <Image
                            source={{ uri: recipe.image }}
                            style={styles.recipeImage}
                        />
                        <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    </View>
                ))
            ) : (
                <Text>No recipes found.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    subHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 8,
    },
    recipeCard: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 8,
    },
    recipeImage: {
        width: "100%",
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
});


