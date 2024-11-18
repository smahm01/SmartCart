import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export const SidebarUserInfo = ({ username, email }) => {
  return (
    <View>
      <View style={styles.sidebarUserInfo}>
        <FontAwesome
          name="user-circle"
          size={60}
          style={{ paddingBottom: 5 }}
          color="black"
        />
        <View style={styles.sidebarUserInfoTextContainer}>
          <Text style={styles.sidebarUserInfoText}>{username}</Text>
          <Text style={{ color: "#ffffff" }}>{email}</Text>
        </View>
      </View>
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

  createHouseholdButton: {
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingBottom: 10,
  },
});
