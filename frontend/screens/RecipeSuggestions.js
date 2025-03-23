import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native";
import { BackButton } from "../components/BackButton";
import { spoonacularAPIKey } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import AllergensPopup from './AllergensPopup';

export const RecipeSuggestions = ({ route }) => {
    const { shoppingListName, shoppingListId, shoppingListCategory, shoppingListItems } = route.params;
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasItems, setHasItems] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };
    const navigation = useNavigation();

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            let shoppingListItemNames = [];
            for (let i = 0; i < shoppingListItems.length; i++) {
                shoppingListItemNames.push(shoppingListItems[i].name);
            }
            if (shoppingListItemNames.length > 0) {
                setHasItems(true);
                const ingredients = shoppingListItemNames.join(',+');
                const response = await fetch(
                    `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${spoonacularAPIKey}&ingredients=${ingredients}&number=10`
                );
                const data = await response.json();
                setRecipes(data);
            } else {
                setRecipes([]);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderRecipeCard = ({ item }) => {


        return (
            <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>Used Ingredients:</Text>
                {item.usedIngredients.map((ingredient, index) => (
                    <Text key={index} style={styles.usedIngredient}>
                        {ingredient.original}
                    </Text>
                ))}
                <Text style={styles.subtitle}>Missing Ingredients:</Text>
                {item.missedIngredients.map((ingredient, index) => (
                    <Text key={index} style={styles.missingIngredient}>
                        {ingredient.original}
                    </Text>
                ))}
                <TouchableOpacity onPress={togglePopup} style={styles.allergensButton}>
                    <Text style={styles.allergensButtonText}>Allergens</Text>
                </TouchableOpacity>
                <AllergensPopup
                    visible={isPopupVisible}
                    onClose={togglePopup}
                    allergens={[]}
                />
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.backContainer}>
                    <BackButton
                        onPress={() => navigation.goBack()}
                        backText={shoppingListName}
                    />
                </View>
                <View style={styles.header}>
                    <Text style={styles.listName}>Suggested Recipes</Text>
                </View>

            </View>
            {hasItems ? (
                <View>
                    <FlatList
                        data={recipes}
                        renderItem={renderRecipeCard}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.list}
                    />
                </View>
            ) : (
                <View style={styles.noShoppingListItems}>
                    <Text>Add items to the shopping list to view a list of suggested recipes!</Text>
                </View>)}

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    backContainer: {
        marginTop: 5,
    },
    noShoppingListItems: {
        marginTop: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        margin: 12,
        marginTop: 8,
    },
    listName: {
        fontSize: 28,
        fontWeight: "bold",
        marginRight: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    usedIngredient: {
        fontSize: 14,
        color: 'green',
    },
    missingIngredient: {
        fontSize: 14,
        color: 'red',
    },
    allergensButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#FF6347',
        borderRadius: 5,
        alignItems: 'center',
    },
    allergensButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
