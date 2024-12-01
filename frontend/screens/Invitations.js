import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { firestore, auth } from "../firebase/config";
import { Invitation } from "../firebase/models/Invitation"; 

export const Invitations = () => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const invites = await Invitation.getInvitations(uid);
        setInvitations(invites);
      }
    };

    fetchInvitations();
  }, []);

  const handleAccept = (invitationId) => {
    // Handle accept invitation logic here
    console.log(`Accepted invitation: ${invitationId}`);
  };

  const handleRefuse = (invitationId) => {
    // Handle refuse invitation logic here
    console.log(`Refused invitation: ${invitationId}`);
  };

  return (
    <View>
      <Text>Invitations to Households:</Text>
      {invitations.length > 0 ? (
        invitations.map((invitation) => (
          <View key={invitation.id} style={styles.card}>
            <Text>Household ID: {invitation.household.id}</Text>
            <Text>Status: {invitation.status}</Text>
            <Button
              title="Accept"
              onPress={() => handleAccept(invitation.id)}
            />
            <Button
              title="Refuse"
              onPress={() => handleRefuse(invitation.id)}
            />
          </View>
        ))
      ) : (
        <Text>No invitations found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});