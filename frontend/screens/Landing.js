import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LandingPageButton } from "../components/LandingPageButton";
import { LandingPageWelcome } from "../components/LandingPageWelcome";

export const Landing = ({ navigation }) => {
  const buttonsOpacity = useRef(new Animated.Value(0)).current; // Opacity for buttons

  useEffect(() => {
    // Fade in buttons simultaneously with title and logo
    Animated.timing(buttonsOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 3000, // Start after the slogan animation
      useNativeDriver: true,
    }).start();
  }, [buttonsOpacity]);

  return (
    <View style={styles.container}>
      <LandingPageWelcome />

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <LandingPageButton
          text="Login"
          onPress={() => navigation.navigate("SignIn")}
          fadeInStyle={{ opacity: buttonsOpacity }}
        />
        <LandingPageButton
          text="Create Account"
          onPress={() => navigation.navigate("CreateAccount")}
          fadeInStyle={{ opacity: buttonsOpacity }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: "15%", // Place buttons slightly above the bottom
    width: "100%",
    alignItems: "center",
  },
});

