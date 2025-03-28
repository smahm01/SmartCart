import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Pressable,
  ActionSheetIOS,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { MembersPageNavigatioButtons } from "../components/MembersPageNavigatioButtons";
import { InviteNewMemberSearchBar } from "../components/InviteNewMemberSearchBar";
import { HouseholdContext } from "../context/HouseholdContext";
import { auth } from "../firebase/config";
import { User } from "../firebase/models/Users";
import { Household } from "../firebase/models/Household";
import { Invitation } from "../firebase/models/Invitation";
import {
  getDoc,
  getFirestore,
  doc,
  updateDoc,
  query,
  onSnapshot,
  collection,
  where,
  documentId,
} from "firebase/firestore";
import { UserCard } from "../components/UserCard.js";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";

export const Members = () => {
  const [activeTab, setActiveTab] = useState("members");
  const { householdId } = useContext(HouseholdContext);
  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchHouseholdData = async () => {
    try {
      const householdData = await Household.getHousehold(householdId);
      setHousehold(householdData);
      
      // Check if current user is an admin
      const currentUserId = auth.currentUser.uid;
      const isCurrentUserAdmin = householdData.admins.some(adminRef => adminRef.id === currentUserId);
      setIsAdmin(isCurrentUserAdmin);
      
      // Fetch all member details
      const allMemberDetails = await Promise.all(
        householdData.people.map(async (memberRef) => {
          const memberData = await getDoc(memberRef);
          const memberId = memberRef.id;
          // Check if the memberRef is in the admins array by comparing IDs
          const isAdmin = householdData.admins.some(adminRef => adminRef.id === memberRef.id);
          return {
            id: memberId,
            name: memberData.data().name,
            role: isAdmin ? "Admin" : "Member",
            avatar: memberData.data().profileImage || null
          };
        })
      );
      
      // Separate members and admins
      const adminMembers = allMemberDetails.filter(member => member.role === "Admin");
      const regularMembers = allMemberDetails.filter(member => member.role === "Member");
      
      setMembers(regularMembers);
      setAdmins(adminMembers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching household data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (householdId) {
      fetchHouseholdData();
    }
  }, [householdId]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await User.getUsersByName(query);
        setSearchResults(results.map(user => ({
          id: user.uid,
          name: user.name,
          avatar: user.profileImage || null
        })));
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleInvite = async (userId) => {
    try {
      const invitation = await Invitation.createInvitation(
        auth.currentUser.uid,
        userId,
        householdId
      );

      if (invitation.success) {
        Alert.alert("Success", "Invitation sent successfully");
        setSearchQuery("");
        setSearchResults([]);
      } else {
        Alert.alert("Error", invitation.message || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      Alert.alert("Error", "Failed to send invitation");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await Household.removeMember(householdId, memberId);
      await fetchHouseholdData();
      Alert.alert("Success", "Member removed successfully");
    } catch (error) {
      console.error("Error removing member:", error);
      Alert.alert("Error", "Failed to remove member");
    }
  };

  const handlePromoteToAdmin = async (memberId) => {
    try {
      await Household.promoteToAdmin(householdId, memberId);
      await fetchHouseholdData();
      Alert.alert("Success", "Member promoted to admin successfully");
    } catch (error) {
      console.error("Error promoting member:", error);
      Alert.alert("Error", "Failed to promote member");
    }
  };

  const handleDemoteFromAdmin = async (memberId) => {
    try {
      await Household.demoteFromAdmin(householdId, memberId);
      await fetchHouseholdData();
      Alert.alert("Success", "Admin demoted successfully");
    } catch (error) {
      console.error("Error demoting admin:", error);
      Alert.alert("Error", "Failed to demote admin");
    }
  };

  const TabButton = ({ active, onPress, icon, label }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabButton,
        active && styles.activeTabButton
      ]}
    >
      <FontAwesome name={icon} size={16} color={active ? "#EF2A39" : "#666"} style={styles.tabIcon} />
      <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
    </Pressable>
  );

  const MemberCard = ({ member, onOptionsPress }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <View style={styles.avatarContainer}>
          {member.avatar ? (
            <Image source={{ uri: member.avatar }} style={styles.avatar} />
          ) : (
            <FontAwesome name="user-circle" size={40} color="#666" />
          )}
        </View>
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberRole}>{member.role}</Text>
        </View>
      </View>
      {isAdmin && (
        <Pressable onPress={onOptionsPress} style={styles.optionsButton}>
          <FontAwesome name="ellipsis-v" size={20} color="#666" />
        </Pressable>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Household Members</Text>
      </View>

      <View style={styles.tabContainer}>
        <TabButton
          active={activeTab === "members"}
          onPress={() => setActiveTab("members")}
          icon="users"
          label="Members"
        />
        <TabButton
          active={activeTab === "admins"}
          onPress={() => setActiveTab("admins")}
          icon="user"
          label="Admins"
        />
        <TabButton
          active={activeTab === "invite"}
          onPress={() => setActiveTab("invite")}
          icon="user-plus"
          label="Invite"
        />
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "members" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Members ({members.length})</Text>
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onOptionsPress={() => {
                  if (!isAdmin) {
                    Alert.alert("Error", "Only administrators can perform this action");
                    return;
                  }
                  Alert.alert(
                    "Member Options",
                    "Choose an action",
                    [
                      {
                        text: "Promote to Admin",
                        onPress: () => handlePromoteToAdmin(member.id)
                      },
                      {
                        text: "Remove Member",
                        onPress: () => handleRemoveMember(member.id),
                        style: "destructive"
                      },
                      {
                        text: "Cancel",
                        style: "cancel"
                      }
                    ]
                  );
                }}
              />
            ))}
          </View>
        )}

        {activeTab === "admins" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administrators ({admins.length})</Text>
            {admins.map((admin) => (
              <MemberCard
                key={admin.id}
                member={admin}
                onOptionsPress={() => {
                  if (!isAdmin) {
                    Alert.alert("Error", "Only administrators can perform this action");
                    return;
                  }
                  Alert.alert(
                    "Admin Options",
                    "Choose an action",
                    [
                      {
                        text: "Demote from Admin",
                        onPress: () => handleDemoteFromAdmin(admin.id)
                      },
                      {
                        text: "Cancel",
                        style: "cancel"
                      }
                    ]
                  );
                }}
              />
            ))}
          </View>
        )}

        {activeTab === "invite" && (
          <View style={styles.section}>
            {!isAdmin ? (
              <Text style={styles.errorText}>Only administrators can invite new members.</Text>
            ) : (
              <>
                <View style={styles.searchContainer}>
                  <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search for users..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                  />
                </View>

                <View style={styles.searchResults}>
                  <Text style={styles.sectionTitle}>Search Results</Text>
                  {searchResults.map((user) => (
                    <View key={user.id} style={styles.searchResultCard}>
                      <View style={styles.memberInfo}>
                        <View style={styles.avatarContainer}>
                          {user.avatar ? (
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                          ) : (
                            <FontAwesome name="user-circle" size={40} color="#666" />
                          )}
                        </View>
                        <Text style={styles.memberName}>{user.name}</Text>
                      </View>
                      <Pressable
                        style={styles.inviteButton}
                        onPress={() => handleInvite(user.id)}
                      >
                        <FontAwesome name="user-plus" size={16} color="#EF2A39" />
                        <Text style={styles.inviteButtonText}>Invite</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#EF2A39',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#EF2A39',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabLabel: {
    fontSize: 14,
    color: '#666',
  },
  activeTabLabel: {
    color: '#EF2A39',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  memberRole: {
    fontSize: 12,
    color: '#666',
  },
  optionsButton: {
    padding: 8,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
  },
  searchResults: {
    marginTop: 20,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EF2A39',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  inviteButtonText: {
    color: '#EF2A39',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#EF2A39',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});
