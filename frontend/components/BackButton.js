import React from "react";
import { Pressable, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const BackButton = ( { onPress }) => {
  const height = Dimensions.get("window").height;
  console.log(height);
  return (
    <Pressable onPress={onPress} style={styles.backButton}>
      <Ionicons name="chevron-back-sharp" size={32} color="#EF2A39" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
  },
});