import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const SignIn = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Sign In Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "red",
        fontWeight: "bold",
        fontSize: 24,
    },
});