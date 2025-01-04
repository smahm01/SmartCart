import React, { useEffect, useState } from "react";
import axios from "axios";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";

export const ScannedItemDetails = ({ route }) => {
  const [itemDetails, setItemDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const { upc } = route.params;

  const getItemDetails = async () => {
    try {
      const response = await axios.get(
        `https://world.openfoodfacts.net/api/v2/product/${upc}?fields=product_name,nutriscore_data,nutriments,nutrition_grades,brands,categories,allergens, serving_size`
      );

      const data = response.data.product;
      console.log(response.data);

      if (data) {
        setItemDetails({
          product_name: data.product_name || "Unknown",
          product_brand: data.brands || "Unknown",
          categories: data.categories || "Unknown",
          allergens: data.allergens || "Unknown",
          protein_per_100g: data.nutriments.proteins_100g || "Unknown",
          fat_per_100g: data.nutriments.fat_100g || "Unknown",
          carb_per_100g: data.nutriments.carbohydrates_100g || "Unknown",
          cal_per_100g: data.nutriments?.["energy-kcal_100g"] || "Unknown",
        });
      } else {
        setError("Failed to fetch product details. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        getItemDetails();
      }, 750);
    };
    fetchData();
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
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanned Item Details</Text>
      {/* Product data including name, brand, upc, and categories*/}
      <Text style={styles.detailText}>UPC: {upc}</Text>
      <Text style={styles.detailText}>
        Product Name: {itemDetails.product_name}
      </Text>
      {itemDetails.categories !== "Unknown" && (
        <Text style={styles.detailText}>
          Categories: {itemDetails.categories}
        </Text>
      )}
      {itemDetails.allergens !== "Unknown" && (
        <Text style={styles.detailText}>
          Allergens: {itemDetails.allergens}
        </Text>
      )}

      {/* Product nutrition information*/}
      <Text style={styles.detailText}>Brand: {itemDetails.product_brand}</Text>
      {itemDetails.protein_per_100g !== "Unknown" && (
        <Text style={styles.detailText}>
          Protein per 100g: {itemDetails.protein_per_100g}
        </Text>
      )}
      {itemDetails.fat_per_100g !== "Unknown" && (
        <Text style={styles.detailText}>
          Fat per 100g: {itemDetails.fat_per_100g}
        </Text>
      )}
      {itemDetails.carb_per_100g !== "Unknown" && (
        <Text style={styles.detailText}>
          Carbohydrates per 100g: {itemDetails.carb_per_100g}
        </Text>
      )}
      {itemDetails.cal_per_100g !== "Unknown" && (
        <Text style={styles.detailText}>
          Calories per 100g: {itemDetails.cal_per_100g}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
