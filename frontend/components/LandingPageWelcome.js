import React from "react";
import { View, StyleSheet, Text } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';



export const LandingPageWelcome = ({ appName, appSlogan }) => {
  return (
    <View style={styles.backgroundWelcome}>
      <View style={styles.welcomeText}>
        <Text style={styles.appName}>SmartCart.</Text>
        <Text style={styles.slogan}>The <Text style={styles.punchLine}>smartest</Text> way to shop</Text>
      </View>
      <FontAwesome name="opencart" size={118} color="red"/>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundWelcome: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f4ed",
    width: "100%",
    height: '50%',
    padding: 30,
    marginBottom: 60,
    borderRadius: 12
  },

  welcomeText: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 15,
  },

  appName: {
    color: "red",
    fontSize: 64,
    fontWeight: "bold",
  },

  slogan: {
    color: "gray",
    fontSize: 24,
    fontWeight: '400',
    fontStyle: 'italic',
  },

  punchLine: {
    textDecorationLine: 'underline',
  },
});
