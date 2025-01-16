import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { auth } from "../firebase/config";
import { Invitation } from "../firebase/models/Invitation";
import { Household } from "../firebase/models/Household";
import {InvitationCard} from "../components/InvitationCard.js";

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

  const getHouseholdName = async (householdId) => {
    const household = await Household.getHousehold(householdId);
    return household.name;
  }

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (invitationId, householdId) => {
    const household = await Household.getHousehold(householdId);
    const invitation = await Invitation.getInvitation(invitationId);
    household.people.push(invitation.invitee);
    await Household.updateHousehold(householdId, household);
    await Invitation.updateInvitationStatus(invitationId, "Accepted");
    fetchInvitations();
  };

  const handleRefuse = async (invitationId) => {
    await Invitation.updateInvitationStatus(invitationId, "Refused");
    fetchInvitations();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitations</Text>
      {invitations.filter((inv) => inv.status === "Pending").length > 0 ? (
        <ScrollView>
          {invitations
            .filter((invitation) => invitation.status === "Pending")
            .map((invitation) => (
              <InvitationCard
                key={invitation.id}
                householdName={getHouseholdName(invitation.household.id)}
                inviterName={invitation.inviterName}
                status={invitation.status}
                onAccept={() => handleAccept(invitation.id, invitation.household.id)}
                onRefuse={() => handleRefuse(invitation.id)}
              />
            ))}
        </ScrollView>
      ) : (
        <Text style={styles.noInvitationsText}>No pending invitations found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#EF2A39",
  },
  noInvitationsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
