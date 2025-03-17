import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { auth } from "../firebase/config";
import { User } from "../firebase/models/Users";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";

const DIETARY_OPTIONS = [
  "Gluten-Free", "Lactose-Free", "Low-Sodium", "Low-FODMAP", "Diabetic-Friendly",
  "Dairy-Free", "Nut-Free", "Soy-Free", "Egg-Free", "Shellfish-Free",
  "Fish-Free", "Nightshade-Free", "Low-Carb", "Low-Fat", "Low-Cholesterol",
  "High-Fiber", "Anti-Inflammatory", "Histamine-Free", "MSG-Free", "Alcohol-Free",
  "Sugar-Free", "Caffeine-Free", "Oxalate-Free", "G6PD Deficiency Diet", "PKU Diet",
  "Halal", "Kosher", "Hindu Vegetarian", "Buddhist Vegetarian", "Jain Vegetarian",
  "Seventh-Day Adventist Diet", "Rastafarian Ital Diet", "Eastern Orthodox Christian Fasting", "Sikh Vegetarian",
  "Vegan", "Vegetarian", "Pescatarian", "Lacto-Vegetarian", "Ovo-Vegetarian",
  "Flexitarian", "Raw Vegan", "Fruitarian", "Whole-Food Plant-Based",
  "Paleo", "Carnivore", "Mediterranean Diet", "Macrobiotic Diet", "Intermittent Fasting",
  "Food Combining Diet", "Organic-Only Diet"
];

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRestriction, setNewRestriction] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = await User.getUser(auth.currentUser.uid);
      setUser(currentUser);
      setDietaryRestrictions(currentUser.dietaryRestrictions || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addDietaryRestriction = async () => {
    if (newRestriction.trim() && !dietaryRestrictions.includes(newRestriction.trim())) {
      const updatedRestrictions = [...dietaryRestrictions, newRestriction.trim()];
      setDietaryRestrictions(updatedRestrictions);
      setNewRestriction("");
      
      try {
        const updatedUser = {
          ...user,
          dietaryRestrictions: updatedRestrictions
        };
        await User.updateUser(user.uid, updatedUser);
      } catch (error) {
        console.error("Error updating dietary restrictions:", error);
      }
    }
  };

  const removeDietaryRestriction = async (restriction) => {
    const updatedRestrictions = dietaryRestrictions.filter(r => r !== restriction);
    setDietaryRestrictions(updatedRestrictions);
    
    try {
      const updatedUser = {
        ...user,
        dietaryRestrictions: updatedRestrictions
      };
      await User.updateUser(user.uid, updatedUser);
    } catch (error) {
      console.error("Error updating dietary restrictions:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user-circle" size={100} color="#EF2A39" />
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <FontAwesome name="envelope" size={20} color="#666" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="phone" size={20} color="#666" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phoneNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add dietary restriction"
            value={newRestriction}
            onChangeText={setNewRestriction}
            onSubmitEditing={addDietaryRestriction}
          />
        </View>
        
        <View style={styles.restrictionsContainer}>
          {dietaryRestrictions.map((restriction, index) => (
            <Pressable
              key={index}
              style={styles.restrictionTag}
              onPress={() => removeDietaryRestriction(restriction)}
            >
              <Text style={styles.restrictionText}>{restriction}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.suggestionText}>Common dietary restrictions:</Text>
        <View style={styles.suggestionsContainer}>
          {DIETARY_OPTIONS.map((option, index) => (
            <Pressable
              key={index}
              style={styles.suggestionTag}
              onPress={() => {
                if (!dietaryRestrictions.includes(option)) {
                  const updatedRestrictions = [...dietaryRestrictions, option];
                  setDietaryRestrictions(updatedRestrictions);
                  
                  try {
                    const updatedUser = {
                      ...user,
                      dietaryRestrictions: updatedRestrictions
                    };
                    User.updateUser(user.uid, updatedUser);
                  } catch (error) {
                    console.error("Error updating dietary restrictions:", error);
                  }
                }
              }}
            >
              <Text style={styles.suggestionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoIcon: {
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  restrictionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  restrictionTag: {
    backgroundColor: '#EF2A39',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  restrictionText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  suggestionTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  suggestionText: {
    color: '#333',
    fontSize: 14,
  },
});
