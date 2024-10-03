import React, { useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet, Button } from "react-native";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

export const Home = () => {
    const [loading, setLoading] = useState(false);
    const currentUser = auth.currentUser;
      
    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    function Greeting() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Welcome, {currentUser.email}</Text>
                <Button title="Sign out" onPress={logOut}></Button>
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
        {loading ? <ActivityIndicator size="large" color="#EF2A39" /> :
            <Greeting />
        }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "red",
        fontWeight: "bold",
        fontSize: 24,
    },
});