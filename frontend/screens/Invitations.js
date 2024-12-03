import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { firestore, auth } from "../firebase/config";
import { Invitation } from "../firebase/models/Invitation";
import { Household } from "../firebase/models/Household";

export const Invitations = () => {
  const [invitations, setInvitations] = useState([]);

  const fetchInvitations = async () => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const invites = await Invitation.getInvitations(uid);
      setInvitations(invites);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (invitationId, householdId) => {
    console.log(`Accepted invitation: ${invitationId}`);
    console.log(`Household ID: ${householdId}`);

    const household = await Household.getHousehold(householdId);
    const invitation = await Invitation.getInvitation(invitationId);
    
    console.log(household);
    console.log(invitation);
    
    household.people.push(invitation.invitee);
    await Household.updateHousehold(householdId, household);

    await Invitation.updateInvitationStatus(invitationId, 'Accepted');
    fetchInvitations(); // Refresh invitations
  };

  const handleRefuse = async (invitationId) => {
    console.log(`Refused invitation: ${invitationId}`);

    await Invitation.updateInvitationStatus(invitationId, 'Refused');
    fetchInvitations(); // Refresh invitations
  };

  return (
    <View>
      <Text>Invitations to Households:</Text>
      {invitations.filter(invitation => invitation.status === "Pending").length > 0 ? (
        invitations
          .filter(invitation => invitation.status === "Pending")
          .map((invitation) => (
            <View key={invitation.id} style={styles.card}>
              <Text>Household ID: {invitation.household.id}</Text>
              <Text>Status: {invitation.status}</Text>
              <Text>Invited by: {invitation.inviterName}</Text>
              <Button
                title="Accept"
                onPress={() => handleAccept(invitation.id, invitation.household.id)}
              />
              <Button
                title="Refuse"
                onPress={() => handleRefuse(invitation.id)}
              />
            </View>
          ))
      ) : (
        <Text>No pending invitations found.</Text>
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