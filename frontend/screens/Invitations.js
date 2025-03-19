import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../firebase/config";
import { Invitation } from "../firebase/models/Invitation";
import { Household } from "../firebase/models/Household";
import { InvitationCard } from "../components/InvitationCard.js";
import { FontAwesome } from "@expo/vector-icons";

export const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const invites = await Invitation.getInvitations(uid);
      setInvitations(invites);
    }
    setLoading(false);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading invitations...</Text>
      </View>
    );
  }

  const pendingInvitations = invitations.filter((inv) => inv.status === "Pending");

  return (
    <View style={styles.container}>
      {pendingInvitations.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          {pendingInvitations.map((invitation) => (
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
        <View style={styles.emptyContainer}>
          <FontAwesome name="envelope-o" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Invitations</Text>
          <Text style={styles.emptyText}>You don't have any pending invitations at the moment.</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchInvitations}
          >
            <FontAwesome name="refresh" size={16} color="#EF2A39" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#EF2A39",
    fontWeight: "600",
  },
});
