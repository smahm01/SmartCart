import React, { useContext, useState } from "react";
import { CheckBox } from "react-native-elements";
import { View, Text, StyleSheet } from "react-native";
import { RequestedItem } from "../firebase/models/RequestedItem";
import { HouseholdContext } from "../context/HouseholdContext";

export const RequestedItemCard = ({ 
    shoppingListId,
    requestedItemId,
    requestedItemName, 
    requestedItemQuantity,
    requestedItemBrand,
    isrequestedItemFulfilled
}) => {
    const { householdId } = useContext(HouseholdContext);
    const [isChecked, setIsChecked] = useState(isrequestedItemFulfilled);

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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    requestedItemName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    requestedItemBrand: {
        fontSize: 16,
    },
    requestedItemQuantity: {
        fontSize: 16,
    },
    checkboxContainer: {
        // margin: 0,
        // padding: 0,
        backgroundColor: "transparent",
        // borderWidth: 0,
      }
});