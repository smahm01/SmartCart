import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { BackButton } from "../components/BackButton";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { styles } from "../styles/CreateAccountSignInStyles";

export const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);
  const [emailProvided, setEmailProvided] = useState(false);
  const [emailValidationText, setEmailValidationText] = useState("");
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [passwordProvided, setPasswordProvided] = useState(false);
  const [passwordValidationText, setPasswordValidationText] = useState("");
  const [focusedInput, setFocusedInput] = useState("");

  const validateInput = (input) => {
    if (input === "email") {
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
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response.user);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("No account associated with provided email");
      } else if (error.code === "auth/wrong-password") {
        alert("Password is incorrect");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateAllInputs = () => {
    if (emailProvided && passwordProvided) {
      if (emailValidated && passwordValidated) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large"
          color="#EF2A39"
        />
      ) : (
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.header}>
            <BackButton onPress={() => navigation.goBack()} />
            <View style={styles.headerText}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subTitle}>Please sign in to continue</Text>
            </View>
          </View>

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
              styles.registerButton,
              validateAllInputs() ? null : styles.disabledButton,
            ]}
            onPress={signIn}
            disabled={validateAllInputs() ? false : true}
          >
            <Text style={styles.registerButtonText}>Login</Text>
          </Pressable>

          <View style={styles.redirect}>
            <Text style={styles.redirectText}>Don't have an account?</Text>
            <Pressable onPress={() => navigation.navigate("CreateAccount")}>
              <Text style={styles.redirectButton}>Sign Up</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};
