import React, { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { BarcodeScannerOverlay } from "../components/BarcodeScannerOverlay";

export const ScanItem = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission}>
          <Text>Request Permissions</Text>
        </Pressable>
      </View>
    );
  }

  if (isFocused) {
    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "upc_a", "upc_e"],
          }}
          onBarcodeScanned={(data) => {
            console.log("data", data.data);
          }}
        />
        <View style={styles.buttonContainer}></View>
        <BarcodeScannerOverlay />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
});
