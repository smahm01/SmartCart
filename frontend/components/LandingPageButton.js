import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";


export const LandingPageButton = ({ text }) => {
  return (
    <Pressable style={styles.button}>
        <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 80,
        margin: 15
    },

    text: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16
    }
});

