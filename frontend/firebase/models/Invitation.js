import { firestore } from "../config";
import {
  collection,
  query,
  where,
  doc,
  getFirestore,
  addDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

class Invitation {
  constructor(inviterId, inviteeId, householdId, status, id = "") {
    this.inviterId = inviterId;
    this.inviteeId = inviteeId;
    this.householdId = householdId;
    this.status = status;
    this.id = id;
  }

  static async createInvitation(
    inviterId,
    inviteeId,
    householdId,
    db = getFirestore()
  ) {
    try {
      // Create document references
      const inviterDocRef = doc(db, `users/${inviterId}`);
      const inviteeDocRef = doc(db, `users/${inviteeId}`);
      const householdDocRef = doc(db, `households/${householdId}`);

      // Ensure user is not already a member of the household
      const householdDoc = await getDoc(householdDocRef);
      if (householdDoc.exists()) {
        const people = householdDoc.data().people;

        // Check if the inviteeId matches any reference in the people array
        const personMatch = people.some((person) => person.id === inviteeId);

        if (personMatch) {
          return {
            success: false,
            message: "User already a member of the household",
          };
        }
      }

      // Ensure outstanding invitation are not duplicated
      const invitationsCollection = collection(db, "invitations");
      const q = query(
        invitationsCollection,
        where("inviter", "==", inviterDocRef),
        where("invitee", "==", inviteeDocRef),
        where("household", "==", householdDocRef),
        where("status", "==", "Pending")
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return {
          success: false,
          message: "User already invited",
        };
      }

      // Else create new invitation
      const newInvitationDocRef = await addDoc(collection(db, "invitations"), {
        inviter: inviterDocRef,
        invitee: inviteeDocRef,
        household: householdDocRef,
        status: "Pending",
      });

      return {
        success: true,
        id: newInvitationDocRef.id,
      };
    } catch (error) {
      console.error("Error creating household:", error);
      throw error;
    }
  }

  static async getInvitations(inviteeId, db = getFirestore()) {
    try {
      // Create document reference for invitee
      const inviteeDocRef = doc(db, `users/${inviteeId}`);

      // Query invitations collection for invitations sent to the invitee
      const invitationsCollection = collection(db, "invitations");
      const q = query(
        invitationsCollection,
        where("invitee", "==", inviteeDocRef)
      );

      const querySnapshot = await getDocs(q);
      const invitations = [];
      querySnapshot.forEach((doc) => {
        invitations.push({ id: doc.id, ...doc.data() });
      });

      return invitations;
    } catch (error) {
      console.error("Error getting invitations:", error);
      throw error;
    }
  }
  
}

export { Invitation };
