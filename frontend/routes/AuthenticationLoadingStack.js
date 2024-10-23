import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Landing } from "../screens/Landing";
import { CreateAccount } from "../screens/CreateAccount";
import { SignIn } from "../screens/SignIn";

const Stack = createStackNavigator();

export const AuthenticationLoadingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
};
