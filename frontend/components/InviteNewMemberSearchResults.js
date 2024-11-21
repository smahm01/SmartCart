import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ListItem } from "@rneui/themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Invitation } from "../firebase/models/Invitation";
import { useContext } from "react";
import { HouseholdContext } from "../context/HouseholdContext";
import { auth } from "../firebase/config";
import ToastManager, { Toast } from "toastify-react-native";

export const InviteNewMemberSearchResults = ({ usersToDisplay }) => {
  const { householdId, householdName } = useContext(HouseholdContext);
  const [toastState, setToastState] = React.useState("");
  const user = auth.currentUser;

  const showSuccessToast = (message) => {
    Toast.success(message);
  };

  const showErrorToast = (message) => {
    Toast.error(message);
  };

  const inviteUser = async (userIdToInvite) => {
    try {
      const invitation = await Invitation.createInvitation(
        user.uid,
        userIdToInvite,
        householdId
      );

      if (invitation.success) {
        console.log("Invitation sent successfully");
        setToastState("success");
        showSuccessToast("Invitation sent successfully");
      } else {
        console.log("Invitation failed:", invitation.message);
        setToastState("error");
        showErrorToast(invitation.message);
      }
    } catch (error) {
      console.log("Error sending invitation:", error);
    }
  };

  return (
    <View style={styles.container}>
      {usersToDisplay.length != 0
        ? usersToDisplay.map((user, i) => (
            <ListItem containerStyle={styles.resultsContainerStyle} key={i}>
              <FontAwesome name="user-circle-o" size={28} color="black" />
              <ListItem.Content style={styles.listItemContent}>
                <View style={styles.userInfoContainer}>
                  <ListItem.Title
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#000000",
                    }}
                  >
                    {user.name}
                  </ListItem.Title>
                  <ListItem.Subtitle
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#969696",
                    }}
                  >
                    {user.email}
                  </ListItem.Subtitle>
                </View>
                <Pressable
                  style={styles.inviteButton}
                  onPress={() => inviteUser(user.uid)}
                >
                  <FontAwesome6 name="add" size={24} color="white" />
                </Pressable>
              </ListItem.Content>
            </ListItem>
          ))
        : null}
      <ToastManager
        position={"top"}
        positionValue={-160}
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
          backgroundColor: toastState === "error" ? "#ec7983" : "#46A24A",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    flexDirection: "column",
    marginTop: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  resultsContainerStyle: {
    width: "100%",
    marginVertical: 0,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ef2a39",
  },

  listItemContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  inviteButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    paddingHorizontal: 8,
    borderRadius: 1000,
    backgroundColor: "#46A24A",
  },
});
