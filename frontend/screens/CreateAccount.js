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
import { firestore } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { BackButton } from "../components/BackButton";

export const CreateAccount = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [focusedInput, setFocusedInput] = useState("false");
  const [loading, setLoading] = useState(false);
  const [nameValidated, setNameValidated] = useState(false);
  const [nameProvided, setNameProvided] = useState(false);
  const [nameValidationText, setNameValidationText] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);
  const [emailProvided, setEmailProvided] = useState(false);
  const [emailValidationText, setEmailValidationText] = useState("");
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [passwordProvided, setPasswordProvided] = useState(false);
  const [passwordValidationText, setPasswordValidationText] = useState("");
  const [phoneNumberValidated, setPhoneNumberValidated] = useState(false);
  const [phoneNumberProvided, setPhoneNumberProvided] = useState(false);
  const [phoneNumberValidationText, setPhoneNumberValidationText] =
    useState("");

  const validateInput = (input) => {
    if (input === "name") {
      if (name === "") {
        setNameProvided(false);
      } else {
        setNameProvided(true);
        if (name.length >= 5) {
          setNameValidated(true);
          setNameValidationText("");
        } else {
          setNameValidated(false);
          setNameValidationText("Name must be at least 5 characters long");
        }
      }
    } else if (input === "email") {
      if (email === "") {
        setEmailProvided(false);
      } else {
        setEmailProvided(true);
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (emailRegex.test(email)) {
          setEmailValidated(true);
          setEmailValidationText("");
        } else {
          setEmailValidated(false);
          setEmailValidationText("Please prove a valid email");
        }
      }
    } else if (input === "password") {
      if (password === "") {
        setPasswordProvided(false);
      } else {
        setPasswordProvided(true);
        if (password.length >= 8) {
          setPasswordValidated(true);
          setPasswordValidationText("");
        } else {
          setPasswordValidated(false);
          setPasswordValidationText(
            "Password must be at least 8 characters long"
          );
        }
      }
    } else if (input === "phoneNumber") {
      if (phoneNumber === "") {
        setPhoneNumberProvided(false);
      } else {
        setPhoneNumberProvided(true);
        const numberRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (numberRegex.test(phoneNumber)) {
          setPhoneNumberValidated(true);
          setPhoneNumberValidationText("");
        } else {
          setPhoneNumberValidated(false);
          setPhoneNumberValidationText("Format XXX-XXX-XXXX expected");
        }
      }
    }
  };

  const validateAllInputs = () => {
    if (
      nameProvided &&
      emailProvided &&
      passwordProvided &&
      phoneNumberProvided
    ) {
      if (
        nameValidated &&
        emailValidated &&
        passwordValidated &&
        phoneNumberValidated
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const createAccount = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Account created with response: ", response);

      // Fetch user data from response
      const user = response.user;

      // Add user data to the database
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          name: name,
          email: user.email,
          phoneNumber: phoneNumber,
        });
      }
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
          <View style={styles.header}>
            <BackButton onPress={() => navigation.goBack()} />
            <View style={styles.headerText}>
              <Text style={styles.createAccount}>Create Account</Text>
              <Text style={styles.createAccountInfo}>
                Please create an account to get started
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.inputBox,
              focusedInput === "name" && styles.focusedInput,
              !nameValidated && nameProvided ? styles.invalidInput : null,
            ]}
          >
            <Ionicons name="person-outline" size={24} color="#EF2A39" />
            <TextInput
              style={[
                styles.input,
                !nameValidated && nameProvided
                  ? styles.invalidInputTextBox
                  : null,
              ]}
              name="name"
              value={name}
              placeholder="Name"
              autoCapitalize="words"
              onChangeText={(name) => setName(name)}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => validateInput("name")}
            ></TextInput>
          </View>
          {!nameValidated && nameProvided ? (
            <Text style={styles.invalidInputText}>{nameValidationText}</Text>
          ) : null}

          <View
            style={[
              styles.inputBox,
              focusedInput === "email" && styles.focusedInput,
              !emailValidated && emailProvided ? styles.invalidInput : null,
            ]}
          >
            <Fontisto name="email" size={24} color="#EF2A39" />
            <TextInput
              style={[
                styles.input,
                !emailValidated && emailProvided
                  ? styles.invalidInputTextBox
                  : null,
              ]}
              name="email"
              value={email}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(email) => setEmail(email)}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => validateInput("email")}
            ></TextInput>
          </View>
          {!emailValidated && emailProvided ? (
            <Text style={styles.invalidInputText}>{emailValidationText}</Text>
          ) : null}

          <View
            style={[
              styles.inputBox,
              focusedInput === "number" && styles.focusedInput,
              !phoneNumberValidated && phoneNumberProvided
                ? styles.invalidInput
                : null,
            ]}
          >
            <Feather name="phone" size={24} color="#EF2A39" />
            <TextInput
              style={[
                styles.input,
                !phoneNumberValidated && phoneNumberProvided
                  ? styles.invalidInputTextBox
                  : null,
              ]}
              name="phoneNumber"
              value={phoneNumber}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={(number) => setPhoneNumber(number)}
              onFocus={() => setFocusedInput("number")}
              onBlur={() => validateInput("phoneNumber")}
            ></TextInput>
          </View>
          {!phoneNumberValidated && phoneNumberProvided ? (
            <Text style={styles.invalidInputText}>
              {phoneNumberValidationText}
            </Text>
          ) : null}

          <View
            style={[
              styles.inputBox,
              focusedInput === "password" && styles.focusedInput,
              !passwordValidated && passwordProvided
                ? styles.invalidInput
                : null,
            ]}
          >
            <AntDesign name="lock" size={24} color="#EF2A39" />
            <TextInput
              style={[
                styles.input,
                !passwordValidated && passwordProvided
                  ? styles.invalidInputTextBox
                  : null,
              ]}
              name="password"
              value={password}
              placeholder="Password"
              autoCapitalize="none"
              secureTextEntry="true"
              onChangeText={(password) => setPassword(password)}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => validateInput("password")}
            ></TextInput>
          </View>
          {!passwordValidated && passwordProvided ? (
            <Text style={styles.invalidInputText}>
              {passwordValidationText}
            </Text>
          ) : null}

          <Pressable
            style={[
              styles.createAccountButton,
              validateAllInputs() ? null : styles.disabledButton,
            ]}
            onPress={createAccount}
            disabled={validateAllInputs() ? false : true}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </Pressable>

          <View style={styles.redirectToSignIn}>
            <Text style={styles.redirectToSignInText}>
              Already have an account?
            </Text>
            <Pressable onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.redirectToSignInButton}>Sign In</Text>
            </Pressable>
          </View>
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

  headerText: {
    marginTop: 90
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
    marginTop: 7,
  },

  input: {
    marginVertical: 10,
    padding: 10,
    height: 40,
    borderRadius: 4,
    flex: 1,
    backgroundColor: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  focusedInput: {
    transform: [{ scale: 1.05 }],
  },

  invalidInputText: {
    color: "#EF2A39",
    marginTop: 1,
    fontWeight: "bold",
  },

  invalidInputTextBox: {
    backgroundColor: "#EF2A39",
  },

  invalidInput: {
    borderColor: "#7a151d",
    borderWidth: 2,
    backgroundColor: "#EF2A39",
    borderRadius: 15,
    opacity: 0.65,
  },

  createAccountButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#EF2A39",
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 18,
    marginVertical: 60,
    width: 160,
    alignSelf: "flex-end",
    backgroundColor: "#EF2A39",
  },

  createAccountButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  disabledButton: {
    backgroundColor: "gray",
    borderColor: "gray",
    opacity: 0.6,
  },

  redirectToSignIn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  redirectToSignInText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },

  redirectToSignInButton: {
    color: "#EF2A39",
    fontSize: 16,
    fontWeight: "700",
    paddingLeft: 4,
  },
});
