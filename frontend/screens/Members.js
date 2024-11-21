import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { MembersPageNavigatioButtons } from "../components/MembersPageNavigatioButtons";
import { InviteNewMemberSearchBar } from "../components/InviteNewMemberSearchBar";

export const Members = () => {
  const [selectedOption, setSelectedOption] = React.useState("Members");

  return (
    <View style={styles.container}>
      <Text style={styles.membersPageTitle}>Household Members</Text>
      <MembersPageNavigatioButtons
        onPress={setSelectedOption}
        selectedOption={selectedOption}
      ></MembersPageNavigatioButtons>

      {selectedOption == "Invite" ? (
        <View>
          <InviteNewMemberSearchBar />
        </View>
      ) : null}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  membersPageTitle: {
    fontSize: 28,
    fontWeight: "800",
    margin: 10,
  },
});
