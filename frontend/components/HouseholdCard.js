import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, Pressable} from "react-native";
import {useNavigation} from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";

export const HouseholdCard = ({ householdName, numberOfMembers, householdId }) => {
  const navigation = useNavigation();
  return (
    <Pressable style={styles.cardContainer} onPress={() =>
    navigation.navigate("SelectedHousehold", {
        householdName: householdName,
        householdId: householdId,})}>
      <View style={styles.cardContent}>
        <Entypo name="home" size={32} color="#FF4C4C" />
        <View style={styles.textContainer}>
          <Text style={styles.householdName}>{householdName}</Text>
          <Text style={styles.memberCount}>{numberOfMembers} Members</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 20,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#E0E0E0",
  },
  textContainer: {
    flex: 1,
  },
  householdName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  memberCount: {
    fontSize: 14,
    color: "#555555",
    marginTop: 4,
  },
});
