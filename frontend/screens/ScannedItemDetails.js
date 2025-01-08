import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { ScannedItemDisplayCard } from "../components/ScannedItemDisplayCard";
import { useNavigation } from "@react-navigation/native";
export const ScannedItemDetails = ({ route }) => {
  const [itemDetails, setItemDetails] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const { upc } = route.params;
  const navigation = useNavigation();

  const getItemDetails = async () => {
    try {
      const response = await axios.get(
        `https://world.openfoodfacts.net/api/v2/product/${upc}?fields=product_name,nutriscore_data,nutriments,nutrition_grades,brands,categories,allergens`
      );

      const data = response.data.product;
      console.log(response.data);

      if (data) {
        setItemDetails({
          product_name: data.product_name || "Unknown",
          product_brand: data.brands || "Unknown",
          categories: data.categories || "Unknown",
          allergens:
            data.allergens !== ""
              ? data.allergens.split(",").map((a) => a.trim())
              : "Unknown",
          protein_per_100g: data.nutriments.proteins_100g || "Unknown",
          fat_per_100g: data.nutriments.fat_100g || "Unknown",
          carb_per_100g: data.nutriments.carbohydrates_100g || "Unknown",
          cal_per_100g: data.nutriments?.["energy-kcal_100g"] || "Unknown",
        });
      }
    } catch (err) {
      setError(true);
      console.log("Error fetching product details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItemDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#EF2A39" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {"Product could not be found. Please try scanning another product."}
        </Text>
        <Pressable
          onPress={() => navigation.navigate("ScanItem")}
          style={({ pressed }) => [
            styles.scanAnotherItemButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.scanAnotherItemButtonText}>
            Scan Another Product
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScannedItemDisplayCard
        productName={itemDetails.product_name}
        productBrand={itemDetails.product_brand}
        categories={itemDetails.categories}
        allergens={itemDetails.allergens}
        protein={itemDetails.protein_per_100g}
        fat={itemDetails.fat_per_100g}
        carbs={itemDetails.carb_per_100g}
        calories={itemDetails.cal_per_100g}
        productImageUrl={itemDetails}
      />
      <View style={styles.availableLists}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 230,
    borderColor: "#EF2A39",
    borderWidth: 2,
    shadowColor: "#EF2A39",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  errorText: {
    fontSize: 16,
    color: "#EF2A39",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
  },

  scanAnotherItemButton: {
    backgroundColor: "#EF2A39",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 15,
  },

  scanAnotherItemButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  availableLists: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: "red", 
  },
});
