import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export const AddCustomItemButton = ({ color, size, onPress, text, backgroundColor }) => {
  return (
    <Pressable onPress={onPress} style={[styles.button, { backgroundColor }]}>
      <AntDesign    
        name="pluscircle"
        size={size}
        color={color}
      />
      <Text style={[styles.text, { color }]}>Add Custom Item</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    marginLeft: 8,
    fontSize: 8,
  },
});