import React from "react";
import { Pressable, StyleSheet, Dimensions, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const BackButton = ( { onPress, backText = '' }) => {
  return (
    <Pressable onPress={onPress} style={styles.backButton}>
      <Ionicons name="chevron-back-sharp" size={32} color="#EF2A39" />
      <Text style={styles.backText}>{backText}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    display: "flex",
    flexDirection: "row",
  },
  backText: {
    fontSize: 20,
    color: "#EF2A39",
    marginTop: 3,
    fontWeight: "600",
  },
});
