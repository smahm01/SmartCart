import React from "react";
import {
  Canvas,
  Rect,
  RoundedRect,
  rect,
  rrect,
} from "@shopify/react-native-skia";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const innerDimensionWidth = 350;
const innerDimensionHeight = 250;

const outer = rect(0, 0, width, height);
const inner = rrect(
  rect(
    width / 2 - innerDimensionWidth / 2,
    height / 2.8 - innerDimensionHeight / 2.8,
    innerDimensionWidth,
    innerDimensionHeight
  ),
  50,
  50
);

export const BarcodeScannerOverlay = () => {
  return (
    <Canvas style={StyleSheet.absoluteFillObject}>
      <Rect rect={outer} color="rgba(0, 0, 0, 0.65)" />
      <RoundedRect rect={inner} color="black" blendMode="clear" />
    </Canvas>
  );
};
