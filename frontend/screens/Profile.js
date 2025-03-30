import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable, Image, Alert } from "react-native";
import { auth, storage } from "../firebase/config";
import { User } from "../firebase/models/Users";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { updateEmail } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchUserData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted' || cameraStatus !== 'granted') {
      Alert.alert('Sorry, we need camera and photo library permissions to make this work!');
      return;
    }
  };

  const pickImage = async (useCamera = false) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const uploadImage = async (uri) => {
    try {
      console.log("Starting image upload process...");
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Image blob created successfully");
      
      // Create a unique filename
      const filename = `profile_${user.uid}_${Date.now()}.jpg`;
      console.log("Creating storage reference for:", filename);
      const storageRef = ref(storage, `profile_images/${user.uid}/${filename}`);
      
      // Upload the image
      console.log("Starting upload to Firebase Storage...");
      await uploadBytes(storageRef, blob);
      console.log("Upload completed successfully");
      
      // Get the download URL
      console.log("Getting download URL...");
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL obtained:", downloadURL);
      
      // Update user profile with new image URL
      console.log("Updating user profile with new image URL...");
      const updatedUser = {
        ...user,
        profileImage: downloadURL
      };
      await User.updateUser(user.uid, updatedUser);
      
      setUser(updatedUser);
      setProfileImage(downloadURL);
      Alert.alert("Success", "Profile picture updated successfully");
    } catch (error) {
      console.error("Detailed error uploading image:", error);
      if (error.code === 'storage/unauthorized') {
        Alert.alert("Error", "You don't have permission to upload images. Please try signing in again.");
      } else if (error.code === 'storage/canceled') {
        Alert.alert("Error", "Upload was canceled. Please try again.");
      } else if (error.code === 'storage/unknown') {
        Alert.alert("Error", "An unknown error occurred. Please check your internet connection and try again.");
      } else {
        Alert.alert("Error", "Failed to upload image. Please try again.");
      }
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Update Profile Picture",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: takePhoto
        },
        {
          text: "Choose from Library",
          onPress: () => pickImage()
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const fetchUserData = async () => {
    try {
      const currentUser = await User.getUser(auth.currentUser.uid);
      setUser(currentUser);
      setDietaryRestrictions(currentUser.dietaryRestrictions || []);
      setNewEmail(currentUser.email || "");
      setNewPhone(currentUser.phoneNumber || "");
      setProfileImage(currentUser.profileImage || null);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (newEmail === user.email) {
      setIsEditingEmail(false);
      return;
    }

    try {
      // First update the email in Firestore
      const updatedUser = {
        ...user,
        email: newEmail
      };
      await User.updateUser(user.uid, updatedUser);
      
      // Then update email in Firebase Auth
      await updateEmail(auth.currentUser, newEmail);
      
      setUser(updatedUser);
      setIsEditingEmail(false);
      Alert.alert("Success", "Email updated successfully");
    } catch (error) {
      console.error("Error updating email:", error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert(
          "Security Check Required",
          "For security reasons, please sign in again to update your email.",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setIsEditingEmail(false);
                setNewEmail(user.email);
              }
            },
            {
              text: "Sign In Again",
              onPress: () => {
                // You might want to implement a reauthentication flow here
                // For now, we'll just show a message
                Alert.alert("Info", "Please sign out and sign in again to update your email.");
              }
            }
          ]
        );
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Error", "This email is already in use by another account.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "Please enter a valid email address.");
      } else {
        Alert.alert("Error", "Failed to update email. Please try again.");
      }
      
      // Reset the email field to the current value
      setNewEmail(user.email);
    }
  };

  const handleUpdatePhone = async () => {
    if (newPhone === user.phoneNumber) {
      setIsEditingPhone(false);
      return;
    }

    try {
      const updatedUser = {
        ...user,
        phoneNumber: newPhone
      };
      await User.updateUser(user.uid, updatedUser);
      
      setUser(updatedUser);
      setIsEditingPhone(false);
      Alert.alert("Success", "Phone number updated successfully");
    } catch (error) {
      console.error("Error updating phone number:", error);
      Alert.alert("Error", "Failed to update phone number. Please try again.");
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
        <Pressable onPress={showImagePickerOptions} style={styles.avatarContainer}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <FontAwesome name="user-circle" size={100} color="#EF2A39" />
          )}
        </Pressable>
        <Text style={styles.userName}>{user?.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <FontAwesome name="envelope" size={20} color="#666" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              {isEditingEmail ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={newEmail}
                    onChangeText={setNewEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View style={styles.editButtons}>
                    <Pressable
                      style={[styles.editButton, styles.cancelButton]}
                      onPress={() => {
                        setIsEditingEmail(false);
                        setNewEmail(user.email);
                      }}
                    >
                      <Text style={styles.editButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.editButton, styles.saveButton]}
                      onPress={handleUpdateEmail}
                    >
                      <Text style={[styles.editButtonText, styles.saveButtonText]}>Save</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={styles.infoValueContainer}
                  onPress={() => setIsEditingEmail(true)}
                >
                  <Text style={styles.infoValue}>{user?.email}</Text>
                  <FontAwesome name="pencil" size={16} color="#666" style={styles.editIcon} />
                </Pressable>
              )}
            </View>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="phone" size={20} color="#666" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              {isEditingPhone ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={newPhone}
                    onChangeText={setNewPhone}
                    keyboardType="phone-pad"
                  />
                  <View style={styles.editButtons}>
                    <Pressable
                      style={[styles.editButton, styles.cancelButton]}
                      onPress={() => {
                        setIsEditingPhone(false);
                        setNewPhone(user.phoneNumber);
                      }}
                    >
                      <Text style={styles.editButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.editButton, styles.saveButton]}
                      onPress={handleUpdatePhone}
                    >
                      <Text style={[styles.editButtonText, styles.saveButtonText]}>Save</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={styles.infoValueContainer}
                  onPress={() => setIsEditingPhone(true)}
                >
                  <Text style={styles.infoValue}>{user?.phoneNumber}</Text>
                  <FontAwesome name="pencil" size={16} color="#666" style={styles.editIcon} />
                </Pressable>
              )}
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
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
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
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    marginLeft: 8,
  },
  editContainer: {
    flex: 1,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#EF2A39',
  },
  editButtonText: {
    fontSize: 14,
    color: '#666',
  },
  saveButtonText: {
    color: '#fff',
  },
});
