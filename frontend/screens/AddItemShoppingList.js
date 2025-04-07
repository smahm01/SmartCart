import React, { useState, useContext } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { ScannedItemDisplayCard } from "../components/ScannedItemDisplayCard";
import { useNavigation } from "@react-navigation/native";
import { HouseholdContext } from "../context/HouseholdContext";
import { BackButton } from "../components/BackButton";
import { RequestedItem } from "../firebase/models/RequestedItem";
import { auth } from "../firebase/config";

export const AddItemShoppingList = ({ route }) => {
    const { shoppingListName, shoppingListId, shoppingListCategory } = route.params;
    const { householdId } = useContext(HouseholdContext);
    const [itemName, setItemName] = useState("");
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [itemAlreadyInList, setItemAlreadyInList] = useState(false);
    const navigation = useNavigation();


    const handleSearch = () => {
        setIsSearching(true);
        getItemDetails();
    }

    const handleQuantityChange = (productId, value) => {
        setQuantities({
          ...quantities,
          [productId]: parseInt(value) || ""
        });
    };

    const handleBlur = (productId) => {
        setQuantities((quantities) => ({
          ...quantities,
          [productId]: quantities[productId] === "" ? 1 : quantities[productId]
        }));
    }

    const getItemDetails = async () => {
        try {
            console.log('ShoppingListName: ' + shoppingListName);
            console.log('ShoppingListId: ' + shoppingListId);
            console.log('ShoppingListCategory: ' + shoppingListCategory);
            
            const response = await axios.get(
                `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${itemName}&search_simple=1&action=process&json=1&`,
                {
                    headers: {
                        "User-Agent":
                            "SmartCart/dev_version (sadek.mahmood@mail.mcgill.ca) ",
                    },
                }
            );

            let products = response.data.products.filter(product => product.lang === "en" && product.categories_lc === "en");            //let products = products.filter(product => product.categories_lc === "en");

            //include only the first 10 products
            products = products.slice(0, 10);
            
            for (let i = 0; i < products.length; i++) {
                console.log('id: ' + products[i].id);
                
                //if product_name is empty, set to generic name or "Unknown"
                if (products[i].product_name === "") {
                    products[i].product_name = products[i].generic_name === "" ? "Unknown" : products[i].generic_name;
                }
                console.log('product name: ' + products[i].product_name);
                
                console.log('brand name: ' + products[i].brands);
                //brands is a string of words separated by commas
                //if brands is not undefined or empty, take the first word, otherwise set to "Unknown"
                if (products[i].brands !== undefined && products[i].brands !== "") {
                    products[i].brands = products[i].brands.split(',')[0];
                } else {
                    products[i].brands = "Unknown";
                }

                //categories is a string of words separated by commas, turn it into a array or set to "Unknown" if empty
                products[i].categories === "" 
                  ? products[i].categories = "Unknown" 
                  : products[i].categories = products[i].categories.replaceAll("en:", "")
                      .split(',')
                      .map((a) => a.trim());
                console.log('categories: ' + products[i].categories);
                
                //allergens is a string of words separated by commas, turn it into a array or set to "Unknown" if empty
                products[i].allergens === "" 
                  ? products[i].allergens = "Unknown" 
                  : products[i].allergens = products[i].allergens.replaceAll("en:", "")
                      .split(',')
                      .map((a) => a.trim());
                console.log('allergens: ' + products[i].allergens);
                
                // if any nutrition value is undefined, set to "Unknown"
                if (products[i].nutriments.proteins_100g === undefined) {
                    products[i].nutriments.proteins_100g = "Unknown";
                }
                if (products[i].nutriments.fat_100g === undefined) {
                    products[i].nutriments.fat_100g = "Unknown";
                }
                if (products[i].nutriments.carbohydrates_100g === undefined) {
                    products[i].nutriments.carbohydrates_100g = "Unknown";
                }
                if (products[i].nutriments["energy-kcal_100g"] === undefined) {
                    products[i].nutriments["energy-kcal_100g"] = "Unknown";
                }
                console.log('protein: ' + products[i].nutriments.proteins_100g);
                console.log('fat: ' + products[i].nutriments.fat_100g);
                console.log('carbs: ' + products[i].nutriments.carbohydrates_100g);
                console.log('cal: ' + products[i].nutriments["energy-kcal_100g"]);
                console.log('img_url: ' + products[i].image_url);
            }

            setProducts(products);

        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    }

    const handleAddToList = async (product) => {
        const quantity = quantities[product.id] || 1;

        // Check if the item is already in the list
        const itemsAlreadyInList = await RequestedItem.getRequestedItems(
          householdId,
          shoppingListId
        );

        if (itemsAlreadyInList.length !== 0 && itemsAlreadyInList.some((item) => item.productUpc === product.id)) {
          setItemAlreadyInList(true);
          setTimeout(() => {
            setItemAlreadyInList(false);
        }, 2000);
          return;
        }

        const requestedItem = new RequestedItem(
            householdId, 
            shoppingListId,
            auth.currentUser.uid, 
            product.product_name, 
            product.brands,
            product.categories,
            product.allergens,
            quantity,
            false,
            new Date(),
            product.id
        );

        RequestedItem.createRequestedItem(householdId, shoppingListId, requestedItem).then(() => {
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000)
        })

    };
    
      return (
        <View style={styles.container}>
          {/* Back Button */}
          <View style={styles.backContainer}>
            <BackButton onPress={() => navigation.goBack()} backText={shoppingListName} />
          </View>
      
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a product..."
              placeholderTextColor="#999"
              value={itemName}
              onChangeText={setItemName}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
      
          {/* Product List */}
          {isSearching ? ( // Show "Searching..." while loading
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={styles.loadingText}>Searching...</Text>
                </View>
            ) : products.length > 0 ? (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.productCard}>
                  <ScannedItemDisplayCard
                    productName={item.product_name}
                    productBrand={item.brands}
                    categories={item.categories || []}
                    allergens={item.allergens}
                    protein={item.nutriments.proteins_100g}
                    fat={item.nutriments.fat_100g}
                    carbs={item.nutriments.carbohydrates_100g}
                    calories={item.nutriments["energy-kcal_100g"]}
                    productImageUrl={item.image_url}
                  />
                   <View style={styles.quantityContainer}>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  placeholder="Qty"
                  value={quantities[item.id] !== undefined ? quantities[item.id].toString() : '1'}
                  onChangeText={(value) => handleQuantityChange(item.id, value)}
                  onBlur={() => handleBlur(item.id)}
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddToList(item)}
                >
                  <Text style={styles.addButtonText}>Add to List</Text>
                </TouchableOpacity>
              </View>
                </View>
              )}
              contentContainerStyle={styles.flatListContent}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No products found.</Text>
            </View>
          )}

          {/* Success Modal */}
          <Modal
            transparent={true}
            visible={showSuccessModal}
            onRequestClose={() => setShowSuccessModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Item added successfully!</Text>
              </View>
            </View>
          </Modal>

          {/* Error Modal */}
          <Modal
            transparent={true}
            visible={itemAlreadyInList}
            onRequestClose={() => setItemAlreadyInList(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.errorModalText}>Item already in list!</Text>
              </View>
              </View>
          </Modal>
        </View>
      );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
      },
      backContainer: {
        alignSelf: 'flex-start',
        marginBottom: 20,
      },
      searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      searchInput: {
        flex: 1,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        marginRight: 10,
      },
      searchButton: {
        backgroundColor: '#EF2A39',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      productCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      addButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        width: 150,
        height: 40,
      },
      addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      noResultsText: {
        fontSize: 18,
        color: '#666',
      },
      flatListContent: {
        paddingBottom: 20,
      },
      quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      quantityInput: {
        width: 50,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 10,
        textAlign: 'center',
        
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        color: '#28a745',
    },
    errorModalText: {
        fontSize: 18,
        color: "#dc3545",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#007bff",
        marginTop: 10,
    },
});

