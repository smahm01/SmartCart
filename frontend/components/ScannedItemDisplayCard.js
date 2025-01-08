import React from "react";
import { Text, View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export const ScannedItemDisplayCard = ({
  productName,
  productBrand,
  categories,
  allergens,
  protein,
  fat,
  carbs,
  calories,
}) => {
  const pastelColors = [
    "#9575CD", // Lavender (more vibrant)
    "#42A5F5", // Light Blue (brighter)
    "#FF7043", // Light Red (more vivid)
    "#66BB6A", // Light Green (stronger)
    "#FFA726", // Orange (more intense)
    "#AB47BC", // Purple (more saturated)
    "#F48FB1", // Pink (more vibrant)
    "#29B6F6", // Sky Blue (brighter)
  ];

  const renderAllergens = () => {
    if (allergens === "Unknown") {
      return <Text style={styles.highlightedText}>N/A</Text>;
    } else {
      return allergens.map((allergen, index) => {
        const allergenName = allergen.replace("en:", "");
        const randomColor = pastelColors[index % pastelColors.length];
        return (
          <Text
            key={index}
            style={[styles.allergenTag, { backgroundColor: randomColor }]}
          >
            {allergenName}
          </Text>
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scannedItemDetailsContainer}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.productBrand}>{productBrand}</Text>

        <View style={styles.nutritionContainer}>
          <Text style={styles.specialTitle}>Nutrition Facts (Per 100g):</Text>

          {protein !== "Unknown" && (
            <View style={styles.nutritionRow}>
              <MaterialCommunityIcons
                name="food-steak"
                size={24}
                color="black"
              />
              <Text style={styles.nutritionText}>Protein: {protein}g</Text>
            </View>
          )}

          {fat !== "Unknown" && (
            <View style={styles.nutritionRow}>
              <MaterialCommunityIcons
                name="french-fries"
                size={24}
                color="black"
              />
              <Text style={styles.nutritionText}>Fat: {fat}g</Text>
            </View>
          )}

          {carbs !== "Unknown" && (
            <View style={styles.nutritionRow}>
              <FontAwesome6 name="bread-slice" size={24} color="black" />
              <Text style={styles.nutritionText}>Carbs: {carbs}g</Text>
            </View>
          )}

          {calories !== "Unknown" && (
            <View style={styles.nutritionRow}>
              <SimpleLineIcons name="energy" size={24} color="black" />
              <Text style={styles.nutritionText}>
                Calories: {calories} kcal
              </Text>
            </View>
          )}
        </View>

        <View style={styles.specialInfoContainer}>
          <Text style={styles.specialTitle}>Categories:</Text>
          {categories !== "Unknown" ? (
            <Text style={styles.highlightedText}>{categories}</Text>
          ) : (
            <Text style={styles.highlightedText}>N/A</Text>
          )}

          <Text style={styles.specialTitle}>Allergens:</Text>
          <View style={styles.allergenContainer}>{renderAllergens()}</View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  scannedItemDetailsContainer: {
    flex: 7,
    flexDirection: "column",
  },

  productName: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
  },

  productBrand: {
    fontSize: 22,
    color: "grey",
    marginBottom: 10,
    fontWeight: 600,
  },

  nutritionText: {
    fontSize: 16,
    marginLeft: 5,
    color: "#333",
    fontWeight: "500",
  },

  nutritionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  specialInfoContainer: {
    marginTop: 10,
  },

  specialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },

  highlightedText: {
    fontSize: 16,
    color: "#d32f2f",
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 5,
  },

  allergenContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },

  allergenTag: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    padding: 5,
    borderRadius: 10,
    marginRight: 5,
  },
});
