import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export const SidebarFooter = ({ logOut }) => {
  return (
    <View style={styles.footer}>
      <FontAwesome name="sign-out" size={24} color="black" />
      <Pressable onPress={() => logOut()}>
        <Text style={{ fontWeight: "600", marginLeft: 10 }}>Sign Out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 30,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
