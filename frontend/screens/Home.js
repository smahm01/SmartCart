import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { auth } from "../firebase/config";
import { AddButton } from "../components/AddButton";
import {CreateHouseholdPopup} from "../components/CreateHouseholdPopup.js";
import { HouseholdCard } from "../components/HouseholdCard";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebase/config";

export const Home = () => {
  const [hasAssociatedHousehold, setHasAssociatedHousehold] = useState(false);
  const [showCreateHouseholBottomSheet, setShowCreateHouseholdBottomSheet] =
    useState(false);
  const [userHouseholds, setUserHouseholds] = useState([]);
  const currentUser = auth.currentUser;

  const openCreateHouseholdBottomSheet = () => {
    setShowCreateHouseholdBottomSheet(true);
  };

  const closeCreateHouseholdBottomSheet = () => {
    setShowCreateHouseholdBottomSheet(false);
  };

  useEffect(() => {
    if (!currentUser) {
      setUserHouseholds([]);
      setHasAssociatedHousehold(false);
      return;
    }

    const householdsCollection = collection(firestore, "households");
    const userDocRef = doc(firestore, "users", currentUser.uid);
    const q = query(
      householdsCollection,
      where("people", "array-contains", userDocRef)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const households = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserHouseholds(households);
      setHasAssociatedHousehold(households.length > 0);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Households</Text>

      {!hasAssociatedHousehold ? (
        <Text style={styles.noHouseholdsMessage}>
          No households found. Please join a household or create a new one to
          get started.
        </Text>
      ) : (
        <FlatList
          data={userHouseholds}
          renderItem={({ item }) => (
            <HouseholdCard
              householdName={item.name}
              numberOfMembers={item.people.length}
              householdId={item.id}
              style={styles.cardStyle}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {showCreateHouseholBottomSheet && (
        <View style={styles.bottomSheetOverlay}>
          <CreateHouseholdPopup
            onClose={closeCreateHouseholdBottomSheet}
          />
        </View>
      )}

      <View style={styles.addButtonContainer}>
        <AddButton
          color="#EF2A39"
          size="56"
          onPress={openCreateHouseholdBottomSheet}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  headerTitle: {
    fontSize: 36, // Larger font size for emphasis
    fontWeight: "bold",
    color: "#EF2A39", // Vibrant red color matching the app's theme
    textAlign: "left",
    marginTop: 20,
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.1)", // Subtle shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerContainer: {
    backgroundColor: "white",
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // Shadow for Android
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    marginBottom: 10,
  },
  noHouseholdsMessage: {
    fontSize: 15,
    marginTop: 50,
    marginHorizontal: 20,
    fontWeight: "600",
    color: "#EF2A39",
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  cardStyle: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Adds shadow effect for Android
  },
  bottomSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 25,
    right: 25,
  },
});

