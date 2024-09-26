import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const LandingPageWelcome = ({ text }) => {
  return (
    <View style={styles.backgroundWelcome}>
      <Text style={styles.welcomeText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundWelcome: {
    backgroundColor: "#f5f4ed",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: height * 0.6, // 60% of the screen height
    padding: 30,
    marginTop: 0,
    borderRadius: 20
  },

  welcomeText: {
    color: "red",
    fontSize: 68,
  },
});
