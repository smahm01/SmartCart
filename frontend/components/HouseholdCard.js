import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const HouseholdCard = ({ name, numberOfMembers}) => {
  const navigation = useNavigation();

  return (
        <Pressable style={styles.cardContainer} onPress={() => navigation.navigate("SelectedHousehold")}>
          <View>
            <View style={styles.householdNameContainer}>
              <Entypo name="home" size={32} color="#ffffff" />
              <Text style={styles.householdName}>{name}</Text>
            </View>
            <View style={styles.householdInformation}>
              <FontAwesome name="users" size={16} color="#ffffff" />
              <Text style={styles.numberOfMembers}>
                Members: {numberOfMembers}
              </Text>
            </View>
          </View>
        </Pressable>
      )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  cardContainer: {
    backgroundColor: "#EF2A39",
    marginVertical: 20,
    marginHorizontal: 10,
    borderRadius: 12,
    shadowColor: "#868686",
    shadowOffset: { width: -3, height: 8 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    width: 250,
  },

  householdNameContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 5,
  },

  householdName: {
    fontSize: 24,
    fontWeight: "700",
    padding: 5,
    color: "#ffffff",
  },

  householdInformation: {
    display: "flex",
    flexDirection: "row",
    textAlign: "flex-start",
    marginHorizontal: 10,
  },

  numberOfMembers: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "700",
    marginLeft: 8,
  },
});

export default HouseholdCard;
