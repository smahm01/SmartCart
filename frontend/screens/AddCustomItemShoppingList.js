import React, { useState, useContext } from "react";
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HouseholdContext } from "../context/HouseholdContext";
import { BackButton } from "../components/BackButton";
import { RequestedItem } from "../firebase/models/RequestedItem";
import { auth } from "../firebase/config";

export const AddCustomItemShoppingList = ({ route }) => {
    const { shoppingListName, shoppingListId } = route.params;
    const { householdId } = useContext(HouseholdContext);
    const [productName, setProductName] = useState("");
    const [brand, setBrand] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [categories, setCategories] = useState("");
    const [allergens, setAllergens] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigation = useNavigation();

    const handleAddToList = () => {
        if (!productName.trim()) {
            setErrorMessage("Product name is required.");
            return
        }
        if (!quantity.trim() || isNaN(quantity) || parseInt(quantity) <= 0) {
            setErrorMessage("Please enter a valid quantity.");
            return
        }

        setErrorMessage(""); // Clear error message

        const requestedItem = new RequestedItem(
            householdId,
            shoppingListId,
            auth.currentUser.uid,
            productName,
            brand,
            categories.split(",").map((cat) => cat.trim()), // Convert categories string to array
            allergens.split(",").map((allergen) => allergen.trim()), // Convert allergens string to array
            parseInt(quantity) || 1,
            false,
            new Date(),
            null // No product ID for manually added items
        );

        RequestedItem.createRequestedItem(householdId, shoppingListId, requestedItem).then(() => {
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigation.goBack(); // Optionally navigate back after adding
            }, 2000); // Hide the modal after 2 seconds
        });
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <View style={styles.backContainer}>
                <BackButton onPress={() => navigation.goBack()} backText={shoppingListName} />
            </View>

            {/* Manual Input Fields */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter product name"
                    placeholderTextColor="#999"
                    value={productName}
                    onChangeText={setProductName}
                />

                <Text style={styles.label}>Brand (Optional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter brand"
                    placeholderTextColor="#999"
                    value={brand}
                    onChangeText={setBrand}
                />

                <Text style={styles.label}>Quantity</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter quantity"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                />

                <Text style={styles.label}>Categories (Optional, comma-separated)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Dairy, Snacks"
                    placeholderTextColor="#999"
                    value={categories}
                    onChangeText={setCategories}
                />

                <Text style={styles.label}>Allergens (Optional, comma-separated)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Nuts, Gluten"
                    placeholderTextColor="#999"
                    value={allergens}
                    onChangeText={setAllergens}
                />

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
            </View>

            {/* Add to List Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddToList}>
                <Text style={styles.addButtonText}>Add to List</Text>
            </TouchableOpacity>

            {/* Success Modal */}
            <Modal
                transparent={true}
                visible={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Item added successfully!</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    backContainer: {
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    input: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        color: "#333",
    },
    addButton: {
        backgroundColor: "#28a745",
        padding: 16,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        color: "#28a745",
    },
    errorText: {
        color: "#dc3545",
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center",
    },
});