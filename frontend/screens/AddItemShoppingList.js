import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet, FlatList } from "react-native";
import axios from "axios";
import { ScannedItemDisplayCard } from "../components/ScannedItemDisplayCard";


export const AddItemShoppingList = ({ visible, onClose, onAddItem }) => {
    const [itemName, setItemName] = useState("");
    const [products, setProducts] = useState([]);

    const handleAddItem = () => {
        console.log('handleAddItem')
        onAddItem(itemName);
        setItemName("");
        onClose();
    };

    const handleSearch = () => {
        getItemDetails();
    }

    const getItemDetails = async () => {
        try {
            console.log('here')
            const response = await axios.get(
                `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${itemName}&search_simple=1&action=process&json=1&`,
                {
                    headers: {
                        "User-Agent":
                            "SmartCart/dev_version (sadek.mahmood@mail.mcgill.ca) ",
                    },
                }
            );

            const products = response.data.products.filter(product => product.lang === "en");
            
            // for (let i = 0; i < products.length; i++) {
            //     console.log(products[i].id);
            //     console.log(products[i].product_name);
            //     console.log(products[i].brands);
            //     console.log(products[i].categories);
            //     console.log(products[i].allergens);
            //     console.log(products[i].nutriments.proteins_100g);
            //     console.log(products[i].nutriments.fat_100g);
            //     console.log(products[i].nutriments.carbohydrates_100g);
            //     console.log(products[i].nutriments["energy-kcal_100g"]);
            //     console.log(products[i].image_url);
            // }

            setProducts(products);

        } catch (error) {
            console.error(error);
        }
    }

    return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Text style={styles.modalText}>Add Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item name, brand, or category..."
        value={itemName}
        onChangeText={setItemName}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ScannedItemDisplayCard
            key={item.id}
            productName={item.product_name}
            productBrand={item.brands}
            categories={item.categories || "Unknown"}
            allergens={item.allergens}
            protein={item.nutriments.proteins_100g}
            fat={item.nutriments.fat_100g}
            carbs={item.nutriments.carbohydrates_100g}
            calories={item.nutriments["energy-kcal_100g"]}
            productImageUrl={item.image_url}
          />
        )}
      />
    </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 15,
        width: 200,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 200,
    },
});

