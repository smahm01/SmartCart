import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { ScannedItemDisplayCard } from "../components/ScannedItemDisplayCard";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";


export const AddItemShoppingList = ({ route }) => {
    const { shoppingListName, shoppingListId, shoppingListCategory } = route.params;
    const [itemName, setItemName] = useState("");
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();


    const handleSearch = () => {
        getItemDetails();
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
                console.log('product name: ' + products[i].product_name);
                console.log('brand name: ' + products[i].brands);
                console.log('categories: ' + products[i].categories);
                //categories is a string of words separated by commas, turn it into a array
                products[i].categories = products[i].categories.split(',');
                console.log('allergens: ' + products[i].allergens);
                //allergens is a string of words separated by commas, turn it into a array
                products[i].allergens = products[i].allergens.split(',');
                console.log('protein: ' + products[i].nutriments.proteins_100g);
                console.log('fat: ' + products[i].nutriments.fat_100g);
                console.log('carbs: ' + products[i].nutriments.carbohydrates_100g);
                console.log('cal: ' + products[i].nutriments["energy-kcal_100g"]);
                console.log('img_url: ' + products[i].image_url);
            }

            setProducts(products);

        } catch (error) {
            console.error(error);
        }
    }

    const handleAddToList = (product) => {
        
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
          {products.length > 0 ? (
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
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToList(item)}
                  >
                    <Text style={styles.addButtonText}>Add to List</Text>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={styles.flatListContent}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No products found.</Text>
            </View>
          )}
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
});

