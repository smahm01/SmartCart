import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export const InvitationCard = ({
  householdName,
  inviterName,
  status,
  onAccept,
  onRefuse,
  inviterPhotoURL,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <FontAwesome name="home" size={24} color="#EF2A39" style={styles.icon} />
        <View style={styles.headerText}>
          <Text style={styles.householdName}>{householdName}</Text>
          <View style={styles.inviterContainer}>
            {inviterPhotoURL ? (
              <Image 
                source={{ uri: inviterPhotoURL }} 
                style={styles.inviterPhoto}
              />
            ) : (
              <View style={styles.inviterPhotoPlaceholder}>
                <FontAwesome name="user" size={16} color="#666" />
              </View>
            )}
            <Text style={styles.inviterName}>Invited by {inviterName}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <FontAwesome 
          name={status === "Pending" ? "clock-o" : status === "Accepted" ? "check-circle" : "times-circle"} 
          size={16} 
          color={status === "Pending" ? "#FFA500" : status === "Accepted" ? "#28a745" : "#dc3545"} 
        />
        <Text style={[styles.status, { color: status === "Pending" ? "#FFA500" : status === "Accepted" ? "#28a745" : "#dc3545" }]}>
          {status}
        </Text>
      </View>

      {status === "Pending" && (
        <View style={styles.buttonsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.acceptButton,
              pressed && styles.buttonPressed
            ]}
            onPress={onAccept}
          >
            <FontAwesome name="check" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Accept</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.refuseButton,
              pressed && styles.buttonPressed
            ]}
            onPress={onRefuse}
          >
            <FontAwesome name="times" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Decline</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  householdName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  inviterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inviterPhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  inviterPhotoPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  inviterName: {
    fontSize: 14,
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#28a745",
  },
  refuseButton: {
    backgroundColor: "#dc3545",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
