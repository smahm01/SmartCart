import React from "react";
import {View, Text, StyleSheet, Image, Pressable} from "react-native";

export const UserCard = ({ name, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && styles.cardPressed, // Apply additional styling when pressed
      ]}
    >
      <View>
        <Text style={styles.nameText}>{name}</Text>
      </View>
    </Pressable>
  );
};const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginHorizontal: "5%", // Margin to make space between cards and the screen edge
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    maxWidth: 400, // Ensure a maximum width for larger devices
    height: 70, // Fixed height to ensure uniform card size
  },
  cardPressed: {
    backgroundColor: "#f0f0f0",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    width: "100%", // Ensure text does not overflow the card
  },
});