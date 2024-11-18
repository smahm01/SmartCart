import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { User } from "../firebase/models/Users";
import { SidebarUserInfo } from "./SidebarUserInfo";
import { SidebarFooter } from "./SidebarFooter";

export const CustomDrawer = (props) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getUsername = async () => {
    const user = await User.getUser(auth.currentUser.uid);
    if (user !== null) {
      setUsername(user.name);
    } else {
      setUsername("");
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#EF2A39" />
      ) : (
        <View style={styles.container}>
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.contentContainerStyle}
          >
            <SidebarUserInfo
              username={username}
              email={auth.currentUser.email}
            ></SidebarUserInfo>

            <View style={styles.drawerItemList}>
              <DrawerItemList {...props} />
            </View>
          </DrawerContentScrollView>
          <SidebarFooter logOut={logOut} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainerStyle: {
    backgroundColor: "#EF2A39",
  },

  drawerItemList: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
});
