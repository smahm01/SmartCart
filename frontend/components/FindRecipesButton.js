import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


export const FindRecipesButton = ({
    shoppingListName,
    shoppingListId,
    shoppingListCategory,
    shoppingListItems
}) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Your shopping list content goes here */}

            {/* Floating Action Button */}
            <FAB
                style={styles.fab}
                icon="chef-hat" // Use an appropriate icon
                onPress={() => navigation.navigate('RecipeSuggestions', {
                    shoppingListName,
                    shoppingListId,
                    shoppingListCategory,
                    shoppingListItems
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 90,
      backgroundColor: '#EF2A39',
      zIndex: 999,
    },
});

export default FindRecipesButton