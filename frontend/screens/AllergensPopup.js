import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { spoonacularAPIKey } from "../firebase/config";

const AllergensPopup = ({ visible, onClose, dietaryData, allergens, recipeId }) => {
    const slideAnim = React.useRef(new Animated.Value(300)).current;
    const [dietaryViolations, setDietaryViolations] = useState([]);

    // Process dietary data when it changes
    useEffect(() => {
        if (visible && dietaryData) {
            const violations = [];
            
            if (dietaryData.vegan === false) violations.push("Non-vegan");
            if (dietaryData.vegetarian === false) violations.push("Non-vegetarian");
            if (dietaryData.glutenFree === false) violations.push("Contains gluten");
            if (dietaryData.dairyFree === false) violations.push("Contains dairy");
            if (dietaryData.ketogenic === false) violations.push("Non-ketogenic");
            if (dietaryData.lowFodmap === false) violations.push("Not low-FODMAP");

            if (dietaryData.diets?.length > 0) {
                violations.push(...dietaryData.diets.map(diet => `Contains ${diet.toLowerCase()}`));
            }

            setDietaryViolations(violations);
        } else {
            setDietaryViolations([]);
        }
    }, [visible, dietaryData]);

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            slideAnim.setValue(300);
        }
    }, [visible]);

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="none" // Disable default modal animation
        >
            {/* Background Overlay */}
            <View style={styles.modalOverlay}>
                {/* Pop-up Card */}
                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            transform: [{ translateY: slideAnim }], // Apply slide animation
                        },
                    ]}
                >
                    <Text style={styles.modalTitle}>⚠️ Allergens Information</Text>
                    <View style={styles.allergensList}>
                        {allergens.length > 0 ? (
                            allergens.map((allergen, index) => (
                                <Text key={index} style={styles.allergenText}>
                                    • {allergen}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.noAllergensText}>No allergens detected for this recipe.</Text>
                        )}
                    </View>
                    
                    {dietaryViolations.length > 0 && (
                        <>
                            <Text style={styles.modalSubtitle}>Dietary Restrictions:</Text>
                            <View style={styles.allergensList}>
                                {dietaryViolations.map((violation, index) => (
                                    <Text key={`diet-${index}`} style={styles.allergenText}>
                                        • {violation}
                                    </Text>
                                ))}
                            </View>
                        </>
                    )}
                    
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};



const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Align pop-up to the bottom
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: '100%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 }, // Shadow at the top
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    allergensList: {
        marginBottom: 20,
    },
    allergenText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
    noAllergensText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#777',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 10,
        padding: 12,
        backgroundColor: '#FF6347', // Tomato color for the button
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AllergensPopup;