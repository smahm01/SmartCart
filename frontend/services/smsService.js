import { getDynamicLinks } from "@react-native-firebase/dynamic-links";
import { Linking } from "react-native";

export const generateInviteLink = async (householdId) => {
  const link = `https://smartcart.page.link/?link=https://smartcart.com/invite?householdId=${householdId}&apn=com.smartcart.app`;

  try {
    return await getDynamicLinks().buildShortLink({
      link,
      domainUriPrefix: "https://smartcart.page.link",
      android: {
        packageName: "com.smartcart.app",
      },
      ios: {
        bundleId: "com.smartcart.app",
      },
      social: {
        title: "Join My Household!",
        descriptionText: "Join my household in the SmartCart app.",
      },
    });
  } catch (error) {
    console.error("Error generating dynamic link:", error);
    return null;
  }
};

export const sendInviteViaSMS = async (householdId) => {
  const inviteLink = await generateInviteLink(householdId);
  if (inviteLink) {
    const message = `Hi! Join my household in the SmartCart app using this link: ${inviteLink}`;
    const url = `sms:?body=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch((err) =>
      console.error("Failed to open SMS app:", err)
    );
  } else {
    alert("Failed to generate the invite link. Please try again.");
  }
};
