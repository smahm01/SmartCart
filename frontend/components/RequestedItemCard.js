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
          // Debug logging
          console.log('Checking restrictions with:', {
            allergens,
            categories
          });
      
          // Validate inputs
          const safeAllergens = Array.isArray(allergens) ? allergens : [];
          const safeCategories = Array.isArray(categories) ? categories : [];
      
          const household = await Household.getHousehold(householdId);
          const warnings = new Set();
      
          const allMembers = [...household.admins, ...household.people];
          
          const restrictionMappings = {
            // ... (keep your existing mappings)
          };
      
          for (const memberRef of allMembers) {
            const userDoc = await getDoc(memberRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const userRestrictions = Array.isArray(userData.dietaryRestrictions)
                ? userData.dietaryRestrictions
                : [];
      
              if (userRestrictions.length > 0) {
                for (const restriction of userRestrictions) {
                  const normalizedRestriction = restriction.toLowerCase().replace(/[-\s]/g, '');
                  const allergensToCheck = restrictionMappings[normalizedRestriction] || [normalizedRestriction];
                  
                  // Safe allergen check
                  const allergenMatch = safeAllergens.some(allergen => {
                    const normalizedAllergen = allergen.toLowerCase().replace(/[-\s]/g, '');
                    return allergensToCheck.some(check => 
                      normalizedAllergen === check ||
                      (check.length > 4 && normalizedAllergen.startsWith(check)) ||
                      (normalizedAllergen.length > 4 && check.startsWith(normalizedAllergen))
                    );
                  });
      
                  // Safe category check
                  const categoryMatch = safeCategories.some(category => {
                    const normalizedCategory = category.toLowerCase().replace(/[-\s]/g, '');
                    return allergensToCheck.some(check => 
                      normalizedCategory === check ||
                      (check.length > 4 && normalizedCategory.startsWith(check)) ||
                      (normalizedCategory.length > 4 && check.startsWith(normalizedCategory))
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
          setDietaryWarnings(["Error checking restrictions"]);
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
                <Text style={styles.requestedItemBrand}>{requestedItemBrand}</Text>
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
        borderRadius: 8,
        marginVertical: 5,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    checkboxContainer: {
        marginRight: 10,
        padding: 0,
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