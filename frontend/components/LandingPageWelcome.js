import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text, Animated, Easing } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export const LandingPageWelcome = () => {
  const logoPosition = useRef(new Animated.Value(-250)).current; // Start far left
  const word1Opacity = useRef(new Animated.Value(0)).current; // Opacity for "The"
  const word2Opacity = useRef(new Animated.Value(0)).current; // Opacity for "smartest"
  const word3Opacity = useRef(new Animated.Value(0)).current; // Opacity for "way to shop"

  useEffect(() => {
    // Animate the logo across the screen
    Animated.timing(logoPosition, {
      toValue: 300, // Move the logo fully across the screen
      duration: 3000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Animate words unveiling progressively
    const wordTiming = 3000 / 4; // Split duration equally
    setTimeout(() => {
      Animated.timing(word1Opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, wordTiming * 1); // Start unveiling the first word immediately

    setTimeout(() => {
      Animated.timing(word2Opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, wordTiming * 2); // Start unveiling the second word

    setTimeout(() => {
      Animated.timing(word3Opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, wordTiming * 3); // Start unveiling the third word
  }, [logoPosition, word1Opacity, word2Opacity, word3Opacity]);

  return (
    <View style={styles.container}>
      {/* Logo Animation */}
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ translateX: logoPosition }] },
        ]}
      >
        <FontAwesome name="opencart" size={118} color="red" />
      </Animated.View>

      {/* Slogan Words */}
      <View style={styles.sloganContainer}>
        <Animated.Text style={[styles.word, { opacity: word1Opacity }]}>
          The
        </Animated.Text>
        <Animated.Text style={[styles.word, { opacity: word2Opacity }]}>
          smartest
        </Animated.Text>
        <Animated.Text style={[styles.word, { opacity: word3Opacity }]}>
          way to shop
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    top: "30%", // Adjust as needed
  },
  sloganContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  word: {
    fontSize: 24,
    fontWeight: "400",
    fontStyle: "italic",
    color: "gray",
    marginHorizontal: 5,
  },
});

