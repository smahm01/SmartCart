import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const InvitationCard = ({
  householdName,
  inviterName,
  status,
  onAccept,
  onRefuse,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.householdName}>Household: {householdName}</Text>
      <Text style={styles.inviterName}>Invited by: {inviterName}</Text>
      <Text style={styles.status}>
        Status: <Text style={styles.statusValue}>{status}</Text>
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.refuseButton} onPress={onRefuse}>
          <Text style={styles.buttonText}>Refuse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  householdName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  inviterName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  statusValue: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  refuseButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
