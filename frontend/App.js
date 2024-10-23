import "./gesture-handler";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { addDocument, getDocuments } from "./firebase/firebaseFunctions";
import { NavigationContainer } from "@react-navigation/native";
import { AuthenticationLoadingStack } from "./routes/AuthenticationLoadingStack";
import { Home } from "./screens/Home";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";


export default function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer style={styles.container}>
      {user ? <Home /> : <AuthenticationLoadingStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
