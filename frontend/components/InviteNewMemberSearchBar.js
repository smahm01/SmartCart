import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { User } from "../firebase/models/Users";
import { SearchBar } from "@rneui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const InviteNewMemberSearchBar = () => {
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchUsersByName = async () => {
      const usersByName = await User.getUsersByName(searchName);
      setSearchResults(usersByName);
    };

    if (searchName.length > 0) {
      fetchUsersByName();
    }
  }, [searchName]);

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  return (
    <View style={styles.container}>
      <SearchBar
        containerStyle={styles.searchBarContainerStyle}
        inputContainerStyle={styles.searchBarInputContainerStyle}
        inputStyle={styles.searchBarInputStyle}
        placeholder="Enter name of the person to invite"
        searchIcon={
          <MaterialIcons name="person-search" size={28} color="black" />
        }
        onChangeText={(inputName) => {
          setSearchName(inputName);
        }}
        value={searchName}
      ></SearchBar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  searchBarContainerStyle: {
    flexDirection: "row",
    padding: 0,
    marginVertical: 5,

    backgroundColor: "transparent",
  },

  searchBarInputContainerStyle: {
    backgroundColor: "transparent",
    padding: 0,
  },

  searchBarInputStyle: {
    backgroundColor: "transparent",
    color: "black",
  },
});
