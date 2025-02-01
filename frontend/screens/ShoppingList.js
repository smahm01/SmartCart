import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { useContext, useEffect, useState } from "react";
import { HouseholdContext } from "../context/HouseholdContext";
// import { BackButton } from "../components/BackButton";
import { AddButton } from "../components/AddButton";
import { ListCard } from "../components/ListCard";
import { CreateShoppingListPopup } from "../components/CreateShoppingListPopup";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "../firebase/config";
// import { useNavigation } from "@react-navigation/native";
 
export const ShoppingList = () => {
  const { householdId, householdName } = useContext(HouseholdContext);
  const [hasShoppingLists, setHasShoppingLists] = useState(true);
  const [showCreateShoppingListForm, setShowCreateShoppingListForm] = useState(false);
  const [shoppingLists, setShoppingLists] = useState([]);
  // const navigation = useNavigation();

  const openCreateShoppingListForm = () => {
    setShowCreateShoppingListForm(true);
  };

  const closeCreateShoppingListForm = () => {
    setShowCreateShoppingListForm(false);
  };

  useEffect(() => {
    const shoppingListsCollection = collection(firestore, `households/${householdId}/shopping_list`);
    const q = query(shoppingListsCollection);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shoppingLists = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShoppingLists(shoppingLists);
      setHasShoppingLists(shoppingLists.length > 0);
    });

    return () => unsubscribe();
  }, [householdId]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.backContainer}>
        <BackButton onPress={() => navigation.goBack()} backText="Home"/>
      </View> */}
      <Text style={styles.upperTitle}>{householdName}</Text>
      <Text style={styles.lowerTitle}>Shopping Lists</Text>
      {/* FlatList of Shopping Lists */}
      <View>
        {hasShoppingLists ? (
          <FlatList
            data={shoppingLists}
            renderItem={({ item }) => (
              <ListCard
                shoppingListName={item.name}
                shoppingListId={item.id}
                shoppingListCategory={item.category}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={styles.noShoppingLists}>
            <MaterialIcons name="shopping-cart" size={64} color="#EF2A39" style={styles.noShoppingListsIcon} />
            <Text style={styles.noShoppingListsText}>No shopping lists found for {householdName}.</Text>
            <Text style={styles.noShoppingListsText}>Create one now to get started!</Text>
          </View>
        )}
      </View>
      
      {/* Floating Add Button to create new list */}
      <View style={styles.addButtonContainer}>
        <AddButton
          color="#EF2A39"
          size="56"
          onPress={openCreateShoppingListForm}
        />
      </View>
      {/* Bottom Sheet to create new shopping list */}
      {showCreateShoppingListForm && (
        <View style={styles.bottomFormOverlay}>
          <CreateShoppingListPopup
            onClose={closeCreateShoppingListForm}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  upperTitle: {
    fontSize: 20,
    marginHorizontal: 16,
    marginTop: 8,
    fontWeight: "800",
    color: "#999",
  },
  lowerTitle: {
    fontSize: 28,
    margin: 16,
    marginTop: 0,
    fontWeight: "800",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 110,
    right: 25,
  },
  backContainer: {
    marginTop: 5,
  },
  noShoppingLists: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  noShoppingListsIcon: {
    marginBottom: 10,
  },
  noShoppingListsText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
  },
  bottomFormOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});