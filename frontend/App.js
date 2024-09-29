import "./gesture-handler";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { addDocument, getDocuments } from "./firebase/firebaseFunctions";
import { NavigationContainer } from "@react-navigation/native";
import { AuthenticationLoading } from "./screens/AuthenticationLoading";
import { Home } from "./screens/Home";

// For sake of demonstration as of rn; we will find the best practice way of doing this
const isAuthenticated = false;

export default function App() {
  // useEffect(() => {
  //   const testFirestore = async () => {
  //     // Adding a test user to firestore
  //     await addDocument("users", { name: "Joe Shmoe", age: "24" });

  //     // Get documents from the "testCollection"
  //     const users = await getDocuments("users");
  //     console.log("Retrieved users:", users);
  //   };

  //   testFirestore();
  // }, []);

  return (
    <NavigationContainer style={styles.container}>
      {isAuthenticated ? <Home /> : <AuthenticationLoading />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
});