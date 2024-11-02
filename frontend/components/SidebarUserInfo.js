import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export const SidebarUserInfo = ({ username, email }) => {
  return (
    <View>
      <View style={styles.sidebarUserInfo}>
        <FontAwesome
          name="user-circle"
          size={60}
          style={{ paddingBottom: 10 }}
          color="black"
        />
        <View style={styles.sidebarUserInfoTextContainer}>
          <Text style={styles.sidebarUserInfoText}>{username}</Text>
          <Text style={{ color: "#ffffff" }}>{email}</Text>
        </View>
      </View>
      <Pressable>
        <Text>Add Household</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarUserInfo: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },

  sidebarUserInfoTextContainer: {
    marginLeft: 8,
  },

  sidebarUserInfoText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
