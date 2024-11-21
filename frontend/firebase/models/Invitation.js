import { firestore } from "../config";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getFirestore,
  addDoc,
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
      const inviterDocRef = doc(db, `users/${inviterId}`);
      const inviteeDocRef = doc(db, `users/${inviteeId}`);
      const householdDocRef = doc(db, `households/${householdId}`);
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
}

export { Invitation };
