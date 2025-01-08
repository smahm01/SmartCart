import { AppRegistry } from "react-native";
import App from "../App";
import { name as appName } from "../../app.json";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { auth } from "../firebase/config";
import { Household } from "../firebase/models/Household";

const handleDynamicLink = async (link) => {
  if (link?.url) {
    const url = new URL(link.url);
    const householdId = url.searchParams.get("householdId");

    if (householdId) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const household = await Household.getHousehold(householdId);
        const updatedPeople = [...household.people, { id: currentUser.uid }];
        await Household.updateHousehold(householdId, {
          ...household,
          people: updatedPeople,
        });
      } else {
        console.warn("User not signed in. Redirecting to sign-in page.");
      }
    }
  }
};

dynamicLinks()
  .getInitialLink()
  .then(handleDynamicLink)
  .catch((err) => console.error("Error processing initial link:", err));

dynamicLinks().onLink(handleDynamicLink);

AppRegistry.registerComponent(appName, () => App);
