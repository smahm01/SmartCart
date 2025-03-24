import React, { useContext, useState, useEffect } from "react";
import { CheckBox } from "react-native-elements";
import { View, Text, StyleSheet } from "react-native";
import { RequestedItem } from "../firebase/models/RequestedItem";
import { HouseholdContext } from "../context/HouseholdContext";
import { Household } from "../firebase/models/Household";
import { User } from "../firebase/models/Users";
import { getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

export const RequestedItemCard = ({ 
    shoppingListId,
    requestedItemId,
    requestedItemName, 
    requestedItemQuantity,
    requestedItemBrand,
    isrequestedItemFulfilled,
    allergens = [],
    categories = []
}) => {
    const { householdId } = useContext(HouseholdContext);
    const [isChecked, setIsChecked] = useState(isrequestedItemFulfilled);
    const [dietaryWarnings, setDietaryWarnings] = useState([]);

    useEffect(() => {
        checkDietaryRestrictions();
    }, [allergens, categories]);

    const checkDietaryRestrictions = async () => {
        try {
            const household = await Household.getHousehold(householdId);
            const warnings = new Set(); // Use Set to prevent duplicate warnings

            // Get all household members (both admins and regular members)
            const allMembers = [...household.admins, ...household.people];
            
            // Common dietary restriction mappings
            const restrictionMappings = {
                'glutenfree': ['gluten'],
                'dairyfree': ['dairy', 'milk', 'lactose'],
                'nutfree': ['nuts', 'peanuts', 'treenuts', 'cashews', 'almonds', 'hazelnuts', 'walnuts', 'macadamia nuts', 'pine nuts', 'pistachios', 'almonds', 'pecans', 'macadamia nuts', 'pine nuts'],
                'vegetarian': ['meat', 'chicken', 'beef', 'pork', 'fish'],
                'vegan': ['meat', 'dairy', 'eggs', 'honey'],
                'halal': ['pork', 'alcohol'],
                'kosher': ['pork', 'shellfish']
            };

            // Fetch user data for each member
            for (const memberRef of allMembers) {
                const userDoc = await getDoc(memberRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userRestrictions = userData.dietaryRestrictions || [];

                    // Check allergens and categories
                    if (userRestrictions) {
                        for (const restriction of userRestrictions) {
                            // Normalize the restriction
                            const normalizedRestriction = restriction.toLowerCase().replace(/[-\s]/g, '');
                            
                            // Get the allergens to check against for this restriction
                            const allergensToCheck = restrictionMappings[normalizedRestriction] || [normalizedRestriction];
                            
                            // Check allergens
                            const allergenMatch = allergens.some(allergen => {
                                const normalizedAllergen = allergen.toLowerCase().replace(/[-\s]/g, '');
                                return allergensToCheck.some(check => 
                                    normalizedAllergen === check || // Exact match
                                    (check.length > 4 && normalizedAllergen.startsWith(check)) || // Prefix match for longer terms
                                    (normalizedAllergen.length > 4 && check.startsWith(normalizedAllergen)) // Prefix match in reverse
                                );
                            });

                            // Check categories
                            const categoryMatch = categories.some(category => {
                                const normalizedCategory = category.toLowerCase().replace(/[-\s]/g, '');
                                return allergensToCheck.some(check => 
                                    normalizedCategory === check || // Exact match
                                    (check.length > 4 && normalizedCategory.startsWith(check)) || // Prefix match for longer terms
                                    (normalizedCategory.length > 4 && check.startsWith(normalizedCategory)) // Prefix match in reverse
                                );
                            });

                            if (allergenMatch || categoryMatch) {
                                warnings.add(`${userData.name} has a ${restriction} restriction`);
                            }
                        }
                    }
                }
            }

            setDietaryWarnings(Array.from(warnings));
        } catch (error) {
            console.error("Error checking dietary restrictions:", error);
        }
    };

    const handleCheckboxToggle = async () => {
        try {
            const requestedItem = await RequestedItem.getRequestedItem(
                householdId,
                shoppingListId,
                requestedItemId
            );
            requestedItem.requestFullfilled = !isChecked;
            await RequestedItem.updateRequestedItem(
                householdId,
                shoppingListId,
                requestedItemId,
                requestedItem
            );
            setIsChecked(!isChecked);
        } catch (error) {
            console.error("Error updating shopping list item status: ", error);
        }
    }

    return (
        <View style={styles.container}>
            <CheckBox
                checked={isChecked}
                onPress={handleCheckboxToggle}
                containerStyle={styles.checkboxContainer}
                checkedColor="#EF2A39"
            />
            <View style={styles.textContainer}>
                <Text style={styles.requestedItemName}>{requestedItemName}</Text>
                {requestedItemBrand !== '' && <Text style={styles.requestedItemBrand}>{requestedItemBrand}</Text>}
                <Text style={styles.requestedItemQuantity}>Quantity: {requestedItemQuantity}</Text>
                {dietaryWarnings.length > 0 && (
                    <View style={styles.warningsContainer}>
                        {dietaryWarnings.map((warning, index) => (
                            <Text key={index} style={styles.warningText}>⚠️ {warning}</Text>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
    },
    checkboxContainer: {
        marginRight: 10,
        paddingLeft: 0,
    },
    textContainer: {
        flex: 1,
    },
    requestedItemName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    requestedItemBrand: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    requestedItemQuantity: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    warningsContainer: {
        marginTop: 5,
        padding: 5,
        backgroundColor: "#FFF3CD",
        borderRadius: 4,
    },
    warningText: {
        fontSize: 12,
        color: "#856404",
        marginVertical: 2,
    }
});