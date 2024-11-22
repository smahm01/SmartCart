import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

export const MembersPageNavigatioButtons = ({ onPress, selectedOption }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          selectedOption === "Members"
            ? styles.memberPageButton
            : styles.memberPageButtonNotSelected,
        ]}
        onPress={() => onPress("Members")}
      >
        <Text
          style={[
            selectedOption === "Members"
              ? styles.memberPageButtonText
              : styles.memberPageButtonTextNotSelected,
          ]}
        >
          Members
        </Text>
      </Pressable>
      <Pressable
        style={[
          selectedOption === "Admins"
            ? styles.memberPageButton
            : styles.memberPageButtonNotSelected,
        ]}
        onPress={() => onPress("Admins")}
      >
        <Text
          style={[
            selectedOption === "Admins"
              ? styles.memberPageButtonText
              : styles.memberPageButtonTextNotSelected,
          ]}
        >
          Admins
        </Text>
      </Pressable>
      <Pressable
        style={[
          selectedOption === "Invite"
            ? styles.memberPageButton
            : styles.memberPageButtonNotSelected,
        ]}
        onPress={() => onPress("Invite")}
      >
        <Text
          style={[
            selectedOption === "Invite"
              ? styles.memberPageButtonText
              : styles.memberPageButtonTextNotSelected,
          ]}
        >
          Invite
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 5,
    marginBottom: 10
  },

  memberPageButton: {
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: "#ef2a39",
    borderRadius: 30,
  },

  memberPageButtonNotSelected: {
    padding: 8,
    marginHorizontal: 5,
    borderColor: "#969696",
    borderWidth: 1,
    borderRadius: 30,
  },

  memberPageButtonText: {
    color: "white",
    fontWeight: "700",
  },

  memberPageButtonTextNotSelected: {
    color: "#969696",
    fontWeight: "700",
  },
});
