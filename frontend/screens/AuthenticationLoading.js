import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { Landing } from "./Landing";
import { CreateAccount } from "./CreateAccount";
import { SignIn } from "./SignIn";

const Stack = createStackNavigator();

export const AuthenticationLoading = () => {
    return (
        <Stack.Navigator initialRouteName="Landing" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
            <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Navigator>
    );
}