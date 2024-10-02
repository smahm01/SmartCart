import React, { useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";

export const CreateAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [focusedInput, setFocusedInput] = useState("false");
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Account created with response: ", response.user);
    } catch (error) {
      alert(error.message);
      console.log("Error creating account: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#EF2A39" />
      ) : (
        <KeyboardAvoidingView behavior="padding">
          <Text style={styles.createAccount}>Create Account</Text>
          <Text style={styles.createAccountInfo}>
            Please create an account to get started
          </Text>

          <View
            style={[
              styles.inputBox,
              focusedInput === "name" && styles.focusedInput,
            ]}
          >
            <Ionicons name="person-outline" size={24} color="black" />
            <TextInput
              style={styles.input}
              name="name"
              value={name}
              placeholder="Name"
              autoCapitalize="words"
              onChangeText={(name) => setName(name)}
              onFocus={() => setFocusedInput("name")}
            ></TextInput>
          </View>

          <View
            style={[
              styles.inputBox,
              focusedInput === "email" && styles.focusedInput,
            ]}
          >
            <Fontisto name="email" size={24} color="black" />
            <TextInput
              style={styles.input}
              name="email"
              value={email}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(email) => setEmail(email)}
              onFocus={() => setFocusedInput("email")}
            ></TextInput>
          </View>

          <View
            style={[
              styles.inputBox,
              focusedInput === "number" && styles.focusedInput,
            ]}
          >
            <Feather name="phone" size={24} color="black" />
            <TextInput
              style={styles.input}
              name="phoneNumber"
              value={phoneNumber}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={(number) => setPhoneNumber(number)}
              onFocus={() => setFocusedInput("number")}
            ></TextInput>
          </View>

          <View
            style={[
              styles.inputBox,
              focusedInput === "password" && styles.focusedInput,
            ]}
          >
            <AntDesign name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              name="password"
              value={password}
              placeholder="Password"
              autoCapitalize="none"
              secureTextEntry="true"
              onChangeText={(password) => setPassword(password)}
              onFocus={() => setFocusedInput("password")}
            ></TextInput>
          </View>

          <Pressable style={styles.createAccountButton} onPress={createAccount}>
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </Pressable>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "auto",
  },

  createAccount: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 4,
  },

  createAccountInfo: {
    color: "#A2A2A2",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },

  inputBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "auto",
    borderBottomColor: "#A2A2A2",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 1,
  },

  input: {
    marginVertical: 10,
    padding: 10,
    height: 40,
    borderRadius: 4,
    flex: 1,
    backgroundColor: "white",
    fontWeight: "700",
  },

  focusedInput: {
    transform: [{ scale: 1.05 }],
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#A2A2A2",
  },

  createAccountButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#EF2A39",
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 15,
    marginVertical: 60,
    width: 150,
    alignSelf: "flex-end",
    backgroundColor: "#EF2A39",
  },

  createAccountButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
});
