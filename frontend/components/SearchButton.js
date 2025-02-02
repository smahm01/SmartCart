import React from "react";
import { Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export const SearchButton = ({ color, size, onPress }) => {
  return (
    <Pressable>
      <AntDesign
        name="search1"
        size={size}
        color={color}
        onPress={onPress}
      />
    </Pressable>
  );
};