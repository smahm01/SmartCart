import React, { useEffect, useState, useContext } from "react";
import {Text, View, StyleSheet, Button, Pressable, ActionSheetIOS} from "react-native";
import { MembersPageNavigatioButtons } from "../components/MembersPageNavigatioButtons";
import { InviteNewMemberSearchBar } from "../components/InviteNewMemberSearchBar";
import { HouseholdContext } from '../context/HouseholdContext';
import { auth } from "../firebase/config";
import { User } from '../firebase/models/Users'; // Adjust the import based on your project structure
import { Household } from '../firebase/models/Household';
import {getDoc, getFirestore, doc, updateDoc} from 'firebase/firestore';
import {UserCard} from "../components/UserCard.js";


export const Members = () => {
  const [selectedOption, setSelectedOption] = useState("Members");
  const { householdId } = useContext(HouseholdContext);
  const [household, setHousehold] = useState(null);
  const [people, setPeople] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchData = async () => {
    try {
      const uid = auth.currentUser.uid;
      const user = await User.getUser(uid);
      const household = await Household.getHousehold(householdId);

      const adminsPromises = household.admins.map(async (userRef) => {
        const user = await getDoc(userRef);
        return user.data();
      });
      const adminsData = await Promise.all(adminsPromises);

      setHousehold(household);
      setAdmins(adminsData);

      // Check if the current user is an admin
      const isAdmin = adminsData.some(admin => admin.uid === uid);
      setIsAdmin(isAdmin);

      const peoplePromises = household.people.map(async (userRef) => {
        const user = await getDoc(userRef);
        return user.data();
      });

      const peopleData = await Promise.all(peoplePromises);

      // Filter out admin users based on users inside of peopleData but not in adminsData
      const nonAdminPeople = peopleData.filter(person => !adminsData.some(admin => admin.uid === person.uid));
      
      setPeople(nonAdminPeople);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [householdId]);

  const handleMakeAdmin = async (person) => {
    try {
      // Logic to make the person an admin
      console.log(`Making ${person.name} an admin`);
      // Add your logic here to update the person's admin status in your database
      const db = getFirestore();
      const userRef = doc(db, `users/${person.uid}`);
      household.admins.push(userRef);
      await Household.updateHousehold(householdId, household);

      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error making admin: ", error);
    }
  };

   const handleKickFromHousehold = async (person) => {
    try {
      const db = getFirestore();
      const householdDocRef = doc(db, `households/${householdId}`);
      const household = await Household.getHousehold(householdId);

      // Remove the person from the household's people array
      const updatedPeople = household.people.filter(
        (memberRef) => memberRef.id !== person.uid
      );
      household.people = updatedPeople;

      // Update the household in Firestore
      await updateDoc(householdDocRef, {
        people: updatedPeople,
      });
      console.log(`${person.name} has been removed from the household.`);
    } catch (error) {
      console.error("Error removing member from household:", error);
    }
  };

   const handlePress = (person) => {
     if (!isAdmin) {
       console.log("Only admins can perform actions on members");
       return;
     }
     setSelectedMember(person.uid);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Make Admin", "Kick from Household"],
        destructiveButtonIndex: 2, // "Kick from Household" appears in red
        cancelButtonIndex: 0, // "Cancel" option
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          await handleMakeAdmin(person); // Call the make admin function
        } else if (buttonIndex === 2) {
          await handleKickFromHousehold(person); // Call the kick function
        }
        setSelectedMember(null);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.membersPageTitle}>Household Members</Text>
      <MembersPageNavigatioButtons
        onPress={setSelectedOption}
        selectedOption={selectedOption}
      />

      {selectedOption === "Invite" ? (
        <View>
          <InviteNewMemberSearchBar />
        </View>
      ) : selectedOption === "Admins" ? (
        <View>
          {admins.map((admin, index) => (
              <UserCard key={index} name={admin.name} />
          ))}
        </View>
      ) : (
          <View>
            {people.map((person, index) => (
                <UserCard key={index}
                          name={person.name}
                          onPress={()=> handlePress(person)}
                >
                </UserCard>
            ))}
          </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "white",
  },
  membersPageTitle: {
    fontSize: 28,
    fontWeight: "800",
    margin: 10,
  },
});