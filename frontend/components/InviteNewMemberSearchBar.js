import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { User } from "../firebase/models/Users";
import { SearchBar } from "@rneui/themed";
import Feather from "@expo/vector-icons/Feather";
import { InviteNewMemberSearchResults } from "./InviteNewMemberSearchResults";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export const InviteNewMemberSearchBar = () => {
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchUsersByName = async () => {
      const usersByName = await User.getUsersByName(searchName);
      setSearchResults(usersByName);
    };

    fetchUsersByName();
  }, [searchName]);

  return (
    <View
      style={[
        searchName.length > 0 ? styles.container : styles.containerNoInput,
      ]}
    >
      <SearchBar
        containerStyle={styles.searchBarContainerStyle}
        inputContainerStyle={styles.searchBarInputContainerStyle}
        inputStyle={styles.searchBarInputStyle}
        placeholder="Enter name of the person to invite"
        searchIcon={<Feather name="search" size={26} color="#ef2a39" />}
        onChangeText={(inputName) => {
          setSearchName(inputName);
        }}
        value={searchName}
      ></SearchBar>
      {searchName.length > 0 ? (
        <InviteNewMemberSearchResults usersToDisplay={searchResults} />
      ) : (
        <View style={styles.noInputInstructionsContainer}>
          <FontAwesome5 name="user-friends" size={68} color="#969696" />
          <Text style={{ textAlign: "center", fontSize: 18, color: "#969696" }}>
            Search for a user to invite
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerNoInput: {
    flexShrink: 1,
    marginHorizontal: 5,
    borderRadius: 20,
    marginTop: 5,
  },

  container: {
    flexShrink: 1,
    marginHorizontal: 5,
    marginTop: 5,
  },

  searchBarContainerStyle: {
    flexDirection: "row",
    padding: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#969696",
    borderRadius: 20,
  },

  searchBarInputContainerStyle: {
    backgroundColor: "white",
    padding: 0,
    borderWidth: 1,
    borderColor: "#969696",
    borderRadius: 20,
  },

  searchBarInputStyle: {
    color: "black",
  },

  noInputInstructionsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 150,
  },
});
