import React from "react";
import { Pressable, StyleSheet, Text, Animated } from "react-native";

export const LandingPageButton = ({ text, onPress, style, fadeInStyle }) => {
  return (
    <Animated.View style={[styles.animatedContainer, fadeInStyle]}>
      <Pressable style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    marginVertical: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4C4C", // Vibrant red color for SmartCart theme
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 5, // Adds subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
  },
});

