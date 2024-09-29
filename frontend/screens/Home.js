import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const Home = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen once Authenticated</Text>
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