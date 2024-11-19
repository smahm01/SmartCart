import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Home } from "../screens/Home";
import { Invitations } from "../screens/Invitations";
import { Profile } from "../screens/Profile";
import { CustomDrawer } from "../components/CustomDrawer";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SelectedHousehold } from "./SelectedHousehold";

const Drawer = createDrawerNavigator();

export const AuthenticatedStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="Home"
      screenOptions={{
        drawerLabelStyle: { marginLeft: -25 },
        drawerActiveBackgroundColor: "#ec7983",
        drawerActiveTintColor: "#ffffff",
        drawerInactiveTintColor: "#333",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: (color) => (
            <AntDesign name="home" size={24} color="black" />
          ),
        }}
      />
      <Drawer.Screen
        name="Invitations"
        component={Invitations}
        options={{
          drawerIcon: (color) => (
            <AntDesign name="mail" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: (color) => (
            <AntDesign name="profile" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SelectedHousehold"
        component={SelectedHousehold}
        options={{
          drawerLabel: () => null,
          drawerItemStyle: { display: "none" }, 
          headerTitle: "", 
        }}
      />
    </Drawer.Navigator>
  );
};
