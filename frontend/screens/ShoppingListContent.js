import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { HouseholdContext } from "../context/HouseholdContext";
import { BackButton } from "../components/BackButton";
import { RequestedItemCard } from "../components/RequestedItemCard";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { AddButton } from "../components/AddButton";
import { SearchButton } from "../components/SearchButton";

export const ShoppingListContent = ({ route }) => {
  const { householdId } = useContext(HouseholdContext);
  const { shoppingListName, shoppingListId, shoppingListCategory } =
    route.params;
  const [shoppingListItems, setShoppingListItems] = useState([]);
  const [hasShoppingListItems, setHasShoppingListItems] = useState(false);
  const [numItems, setNumItems] = useState(0);
  const [numItemsFulfilled, setNumItemsFulfilled] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const shoppingListItemsCollection = collection(
      firestore,
      `households/${householdId}/shopping_list/${shoppingListId}/requested_items`
    );
    const q = query(shoppingListItemsCollection);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shoppingListItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShoppingListItems(shoppingListItems);
      setHasShoppingListItems(shoppingListItems.length > 0);
    });
    return () => unsubscribe();
  }, [shoppingListId]);

  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        <BackButton
          onPress={() => navigation.goBack()}
          backText="Shopping Lists"
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.listName}>{shoppingListName}</Text>
        <View style={styles.addButtonContainer}>
          <AddButton
            size={28}
            color={"#EF2A39"}
            onPress={() =>
              navigation.navigate("AddCustomItemShoppingList", {
                shoppingListName,
                shoppingListId,
                shoppingListCategory,
              })
            }
          />
          <SearchButton
            style={styles.searchButton}
            size={28}
            color={"#EF2A39"}
            onPress={() =>
              navigation.navigate("AddItemShoppingList", {
                shoppingListName,
                shoppingListId,
                shoppingListCategory,
              })
            }
          />
        </View>
      </View>
      {shoppingListCategory !== "None" && (
        <View style={{ marginLeft: 12, marginBottom: 8 }}>
          <View style={styles.listCategoryTag}>
            <Text style={styles.listCategoryTagText}>
              {shoppingListCategory}
            </Text>
          </View>
        </View>
      )}

      {/* FlatList of Shopping List Items */}
      <View>
        {hasShoppingListItems ? (
          <FlatList
            data={shoppingListItems}
            renderItem={({ item }) => (
              <RequestedItemCard
                shoppingListId={shoppingListId}
                requestedItemId={item.id}
                requestedItemName={item.name}
                requestedItemQuantity={item.quantityRequested}
                requestedItemBrand={item.brand}
                isrequestedItemFulfilled={item.requestFullfilled}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={styles.noShoppingListItems}>
            <Text style={styles.noShoppingListItemsText}>
              No items found in this shopping list.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backContainer: {
    marginTop: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    marginTop: 8,
  },
  listName: {
    fontSize: 28,
    fontWeight: "bold",
    marginRight: 12,
  },
  listCategoryTag: {
    backgroundColor: "#EF2A39",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start", 
  },

  listCategoryTagText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noShoppingListItems: {
    marginTop: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noShoppingListItemsText: {
    fontSize: 16,
    textAlign: "center",
  },
  addButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    right: 5,
    paddingHorizontal: 10,
    width: 100,
  },
});
