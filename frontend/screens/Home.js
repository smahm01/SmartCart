import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { auth } from "../firebase/config";
import { AddButton } from "../components/AddButton";
import { CreateHouseholdBottomSheetForm } from "../components/CreateHouseholdBottomSheetForm";
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
      {/* Upper Container with households user belongs to*/}
      <View style={styles.upperHouseholdInfoContainer}>
        <Text style={styles.upperLowerContainerTitle}>Households</Text>

        {!hasAssociatedHousehold ? (
          <Text style={styles.userHasNoHouseholdsMessage}>
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
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal={true}
            style={styles.householdsList}
          />
        )}
      </View>

      {/* Lower Container with lists user has starred (from various households) */}
      <View style={styles.lowerListInfoContainer}>
        <Text style={styles.upperLowerContainerTitle}>Starred Lists</Text>
      </View>

      {/* Bottom Sheet to create new household */}
      {showCreateHouseholBottomSheet && (
        <View style={styles.bottomSheetOverlay}>
          <CreateHouseholdBottomSheetForm
            onClose={closeCreateHouseholdBottomSheet}
          />
        </View>
      )}

      {/* Floating Add Button to create new household*/}
      <View style={styles.addButtonContainer}>
        <AddButton
          style={styles.addHouseholdButton}
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
  },

  upperHouseholdInfoContainer: {
    flex: 2.25,
    flexDirection: "column",
    backgroundColor: "#FAFAFA",
  },

  upperLowerContainerTitle: {
    fontSize: 28,
    marginTop: 5,
    marginLeft: 10,
    fontWeight: "800",
    color: "#969696",
  },

  userHasNoHouseholdsMessage: {
    fontSize: 15,
    marginTop: 50,
    marginHorizontal: 30,
    fontWeight: "600",
    color: "#EF2A39",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
  },

  householdsList: {
    flex: 1,
    width: "100%",
  },

  lowerListInfoContainer: {
    flex: 7.75,
    flexDirection: "column",
    backgroundColor: "#FAFAFA",
  },

  addButtonContainer: {
    position: "absolute",
    bottom: 25,
    right: 25,
  },

  bottomSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
