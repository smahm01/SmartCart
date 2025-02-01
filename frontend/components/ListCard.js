import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const ListCard = ({
  shoppingListName,
  shoppingListId,
  shoppingListCategory,
}) => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("ShoppingListContent", {
          shoppingListName,
          shoppingListId,
          shoppingListCategory
        })
      }
    >
      <View style={styles.cardContent}>
          <Text style={styles.listName}>{shoppingListName}</Text>
          <Text style={styles.category}>{shoppingListCategory}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "column",
  },
  listName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
