import React, { useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
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
import { BackButton } from "../components/BackButton";
import { styles } from "../styles/CreateAccountSignInStyles";
import { User } from "../firebase/models/Users";

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
        const numberRegex = /^\d{10}$/;
        if (numberRegex.test(phoneNumber)) {
          setPhoneNumberValidated(true);
          setPhoneNumberValidationText("");
        } else {
          setPhoneNumberValidated(false);
          setPhoneNumberValidationText("Number must be 10 digits long");
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
        const newUser = new User(name, email, phoneNumber, user.uid);
        const docRef = await User.createUser(newUser);
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email");
      } else {
        alert(error.message);
      }
      console.log("Error creating account: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          testID="loading-indicator"
          style={styles.activityIndicator}
          size="large"
          color="#EF2A39"
        />
      ) : (
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.header}>
            <BackButton onPress={() => navigation.goBack()} />
            <View style={styles.headerText}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subTitle}>
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
            <Ionicons
              name="person-outline"
              size={24}
              color={!nameValidated && nameProvided ? "#000000" : "#EF2A39"}
            />
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
            <Fontisto
              name="email"
              size={24}
              color={!emailValidated && emailProvided ? "#000000" : "#EF2A39"}
            />
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
            <Feather
              name="phone"
              size={24}
              color={
                !phoneNumberValidated && phoneNumberProvided
                  ? "#000000"
                  : "#EF2A39"
              }
            />
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
            <AntDesign
              name="lock"
              size={24}
              color={
                !passwordValidated && passwordProvided ? "#000000" : "#EF2A39"
              }
            />
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
              secureTextEntry={true}
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
              styles.registerButton,
              validateAllInputs() ? null : styles.disabledButton,
            ]}
            onPress={createAccount}
            disabled={validateAllInputs() ? false : true}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </Pressable>

          <View style={styles.redirect}>
            <Text style={styles.redirectText}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.redirectButton}>Sign In</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default CreateAccount;
