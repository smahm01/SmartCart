import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ShoppingListStack } from "./ShoppingListStack";
import { Ionicons } from "@expo/vector-icons";
import { Text, StyleSheet } from "react-native";
import { Pantry } from "../screens/Pantry";
import { Fridge } from "../screens/Fridge";
import { Members } from "../screens/Members";
import { ScanItemStack } from "./ScanItemStack";
import { HouseholdContext } from "../context/HouseholdContext";

const Tab = createBottomTabNavigator();

export const SelectedHousehold = ({ route }) => {
  const { householdName, householdId } = route.params;

  return (
    <HouseholdContext.Provider
      value={{ householdId: householdId, householdName: householdName }}
    >
      <Tab.Navigator
        key={householdId}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;

            switch (route.name) {
              case "Lists":
                iconName = focused ? "cart" : "cart-outline";
                break;
              case "Pantry":
                iconName = focused ? "file-tray" : "file-tray-outline";
                break;
              case "Scan":
                iconName = focused ? "scan" : "scan-outline";
                break;
              case "Fridge":
                iconName = focused ? "snow" : "snow-outline";
                break;
              case "Manage":
                iconName = focused ? "people" : "people-outline";
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabel: ({ color, focused }) => (
            <Text
              style={{
                fontSize: 10,
                fontWeight: focused ? "bold" : "normal",
                color,
              }}
            >
              {route.name}
            </Text>
          ),
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarActiveBackgroundColor: "#ef2a39",
          tabBarActiveTintColor: "#ffffff",
          tabBarInactiveTintColor: "#0007",
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Lists"
          component={ShoppingListStack}
          initialParams={{
            householdId: householdId,
            householdName: householdName,
          }}
        />
        <Tab.Screen
          name="Pantry"
          component={Pantry}
          initialParams={{
            householdId: householdId,
            householdName: householdName,
          }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanItemStack}
          initialParams={{
            householdId: householdId,
            householdName: householdName,
          }}
        />
        <Tab.Screen
          name="Fridge"
          component={Fridge}
          initialParams={{
            householdId: householdId,
            householdName: householdName,
          }}
        />
        <Tab.Screen
          name="Manage"
          component={Members}
          initialParams={{
            householdId: householdId,
            householdName: householdName,
          }}
        />
      </Tab.Navigator>
    </HouseholdContext.Provider>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 75,
    backgroundColor: "#FAFAFA",
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
    borderRadius: 35,
    borderTopWidth: 0,
    shadowColor: "#000000",
    shadowOffset: {
      width: -2,
      height: 10,
    },
    shadowOpacity: 0.75,
    shadowRadius: 5,
    elevation: 5,
    paddingBottom: 5,
  },

  tabBarItemStyle: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 3,
    padding: 10,
    borderRadius: 40,
  },
});
