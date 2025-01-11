import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { BarcodeScannerOverlay } from "../components/BarcodeScannerOverlay";

export const ScanItem = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  const onBarcodeScanned = (upc) => {
    navigation.navigate("ScannedItemDetails", { upc: upc });
  };

  // Camera permissions are still loading
  if (!permission) {
    return <View />;
  }

  // Camera permissions are not granted yet
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission}>
          <Text>Request Permissions</Text>
        </Pressable>
      </View>
    );
  }

  // Succesfully unmount camera if screen is not focused. Otherwise, if permission is granted show camera view
  if (isFocused) {
    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "upc_a", "upc_e"],
          }}
          onBarcodeScanned={(data) => {
            onBarcodeScanned(data.data);
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
