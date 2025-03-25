import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';


const AllergensPopup = ({ visible, onClose, allergens }) => {
    const slideAnim = React.useRef(new Animated.Value(300)).current; // Start offscreen (300 units below)

    React.useEffect(() => {
        if (visible) {
            // Slide up when visible
            Animated.timing(slideAnim, {
                toValue: 0, // Slide to the original position
                duration: 300, // Animation duration
                easing: Easing.out(Easing.ease),
                useNativeDriver: true, // Use native driver for better performance
            }).start();
        } else {
            // Reset position when not visible
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