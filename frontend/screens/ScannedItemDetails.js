import React, { useContext, useEffect, useState } from "react";
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
import { SelectList } from "react-native-dropdown-select-list";
import { HouseholdContext } from "../context/HouseholdContext";
import { ShoppingList } from "../firebase/models/ShoppingList";
import { RequestedItem } from "../firebase/models/RequestedItem";
import { auth } from "../firebase/config";
import ToastManager, { Toast } from "toastify-react-native";

export const ScannedItemDetails = ({ route }) => {
  const [itemDetails, setItemDetails] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [selectedList, setSelectedList] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [householdShoppingLists, setHouseholdShoppingLists] = useState([]);
  const [itemAlreadyInList, setItemAlreadyInList] = useState(false);
  const { upc } = route.params;
  const { householdId } = useContext(HouseholdContext);

  const showSuccessToast = (message) => {
    Toast.success(message);
  };

  const showErrorToast = (message) => {
    Toast.error(message);
  };

  const fetchHouseholdShoppingLists = async () => {
    try {
      const fetchedShoppingLists = await ShoppingList.getShoppingLists(
        householdId
      );
      setHouseholdShoppingLists(fetchedShoppingLists);
    } catch (error) {
      console.error("Error fetching household shopping lists:", error);
    }
  };

  const getItemDetails = async () => {
    try {
      console.log("Fetching product details for UPC:", upc);
      const response = await axios.get(
        `https://world.openfoodfacts.net/api/v2/product/${upc}?fields=product_name,nutriscore_data,nutriments,nutrition_grades,brands,categories,allergens`,
        {
          headers: {
            "User-Agent":
              "SmartCart/dev_version (sadek.mahmood@mail.mcgill.ca) ",
          },
        }
      );

      const data = response.data.product;
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.data);

      if (data) {
        setItemDetails({
          product_name: data.product_name || "Unknown",
          product_brand: data.brands || "Unknown",
          categories:
            data.categories && data.categories !== ""
              ? data.categories
                  .split(",")
                  .map((a) => a.trim())
                  .slice(0, 3)
              : "Unknown",
          allergens:
            data.allergens && data.allergens !== ""
              ? data.allergens
                  .replaceAll("en:", "")
                  .split(",")
                  .map((a) => a.trim())
              : "Unknown",
          protein_per_100g:
            data.nutriments && data.nutriments.proteins_100g
              ? data.nutriments.proteins_100g
              : "Unknown",
          fat_per_100g:
            data.nutriments && data.nutriments.fat_100g
              ? data.nutriments.fat_100g
              : "Unknown",
          carb_per_100g:
            data.nutriments && data.nutriments.carbohydrates_100g
              ? data.nutriments.carbohydrates_100g
              : "Unknown",
          cal_per_100g:
            data.nutriments && data.nutriments?.["energy-kcal_100g"]
              ? data.nutriments?.["energy-kcal_100g"]
              : "Unknown",
        });
      }
    } catch (err) {
      setError(true);
      console.log("Error fetching product details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItemToList = async () => {
    try {
      // Check if item is already in the list
      const itemsAlreadyInList = await RequestedItem.getRequestedItems(
        householdId,
        selectedList
      );

      if (itemsAlreadyInList.length === 0) {
        setItemAlreadyInList(false);
      } else if (itemsAlreadyInList.some((item) => item.productUpc === upc)) {
        setItemAlreadyInList(true);
        showErrorToast("Item already in list");
        return;
      }

      // Create requested item object
      const requestedItem = new RequestedItem(
        householdId,
        selectedList,
        auth.currentUser.uid,
        itemDetails.product_name,
        itemDetails.product_brand,
        itemDetails.categories,
        itemDetails.allergens,
        selectedQuantity,
        false,
        new Date().toISOString().substring(0, 10),
        upc
      );

      // Add requested item to shopping list
      const response = await RequestedItem.createRequestedItem(
        householdId,
        selectedList,
        requestedItem
      );
      showSuccessToast("Item added to shopping list");
    } catch (error) {
      console.error("Error adding item to list:", error);
    } finally {
    }
  };

  // useEffect hook below will acquire scanned product information and retrieve a list of all shopping lists associated with the household
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getItemDetails();
        await fetchHouseholdShoppingLists();
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [householdId, upc]);

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

  const formattedShoppingLists = householdShoppingLists.map((list) => ({
    key: list.id,
    value: list.name,
  }));

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

      <Text style={styles.selectListTitle}>
        Select Shopping List and Quantity
      </Text>
      {formattedShoppingLists.length != 0 ? (
        <View style={styles.selectListContainer}>
          <SelectList
            setSelected={setSelectedList}
            data={formattedShoppingLists}
            save="key"
            placeholder={
              selectedList !== "" ? selectedList : "Select a Shopping List"
            }
            search={false}
            searchPlaceholder="Search Shopping Lists"
            selectedText="items selected"
            style={styles.selectList}
            boxStyles={{
              ...styles.selectBoxList,
              backgroundColor:
                selectedList !== ""
                  ? "rgba(0, 255, 0, 0.3)"
                  : "rgba(255, 0, 0, 0.3)",
              borderColor: selectedList !== "" ? "green" : "red",
              borderWidth: 2,
            }}
            dropdownStyles={styles.dropdownOverlayLists}
          />
          <SelectList
            setSelected={setSelectedQuantity}
            data={["1", "2", "3", "4+"]}
            save="value"
            placeholder={selectedQuantity !== "" ? selectedQuantity : "Qty"}
            search={false}
            searchPlaceholder="Search Shopping Lists"
            selectedText="items selected"
            style={styles.selectList}
            boxStyles={{
              ...styles.selectBoxQty,
              backgroundColor:
                selectedQuantity !== ""
                  ? "rgba(0, 255, 0, 0.3)"
                  : "rgba(255, 0, 0, 0.3)",
              borderColor: selectedQuantity !== "" ? "green" : "red",
              borderWidth: 2,
            }}
            dropdownStyles={styles.dropdownOverlayQty}
          />
          {selectedList !== "" && selectedQuantity !== "" && (
            <View style={styles.confirmationContainer}>
              <Pressable
                onPress={handleAddItemToList}
                style={({ pressed }) => [
                  styles.confirmButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.confirmButtonText}>Add</Text>
              </Pressable>
            </View>
          )}
          <ToastManager
            position={"top"}
            positionValue={-400}
            animationStyle={"upInUpOut"}
            showProgressBar={false}
            showCloseIcon={false}
            textStyle={{
              fontSize: 14,
              color: "#ffffff",
              fontWeight: "bold",
            }}
            style={{
              borderRadius: 20,
              backgroundColor: itemAlreadyInList ? "#EF2A39" : "#4CAF50",
            }}
          />
        </View>
      ) : (
        <View style={styles.noShoppingListContainer}>
          <Text
            style={{ fontSize: "16", fontWeight: "bold", textAlign: "center" }}
          >
            No Shopping lists exist. Please create one in order to begin adding
            items!
          </Text>
        </View>
      )}
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

  selectListTitle: {
    fontSize: 18,
    marginHorizontal: 8,
    marginVertical: 10,
    fontWeight: "bold",
  },

  selectList: {
    marginBottom: 10,
  },

  selectBoxList: {
    borderRadius: 8,
    marginHorizontal: 5,
    width: 225,
  },

  selectBoxQty: {
    borderRadius: 8,
    marginHorizontal: 5,
    width: 75,
  },

  dropdownOverlayLists: {
    position: "absolute",
    top: 38,
    right: 5,
    zIndex: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    width: 225,
  },

  dropdownOverlayQty: {
    position: "absolute",
    top: 38,
    right: 5,
    zIndex: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    width: 75,
  },

  confirmationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 20,
  },

  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  selectListContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  noShoppingListContainer: {
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 5,
    borderColor: "#EF2A39",
    borderWidth: 2,
    shadowColor: "#EF2A39",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
