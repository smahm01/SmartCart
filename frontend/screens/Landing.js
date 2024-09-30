import React from "react";
import { View, StyleSheet } from "react-native";
import { LandingPageButton } from "../components/LandingPageButton";
import { LandingPageWelcome } from "../components/LandingPageWelcome";

export const Landing = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LandingPageWelcome style={styles.welcome} />
      <LandingPageButton
        text="Sign In"
        onPress={() => navigation.navigate("SignIn")}
      />
      <LandingPageButton
        text="Create Accont"
        onPress={() => navigation.navigate("CreateAccount")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  welcome: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
