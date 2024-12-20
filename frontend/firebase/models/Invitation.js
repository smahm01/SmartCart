import { firestore } from "../config";
import { updateDoc, collection, query, where, doc, getFirestore, addDoc, getDocs, getDoc} from 'firebase/firestore';
  

class Invitation {
  constructor(inviterId, inviteeId, householdId, status, id = "") {
    this.inviterId = inviterId;
    this.inviteeId = inviteeId;
    this.inviterName = inviterName;
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

      const inviterDoc = await getDoc(inviterDocRef);

      // Add checks to ensure document exists and has data
      if (!inviterDoc.exists()) {
        throw new Error('Inviter document does not exist');
      }

      const inviterData = inviterDoc.data();
      if (!inviterData || !inviterData.name) {
        throw new Error('Inviter name is missing');
      }

      const inviterName = inviterData.name;

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
        inviterName: inviterName,
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

  //get invitation from id
  static async getInvitation(invitationId, db = getFirestore()) {
    try {
      const invitationDocRef = doc(db, `invitations/${invitationId}`);
      const invitationDoc = await getDoc(invitationDocRef);

      if (invitationDoc.exists()) {
        return { id: invitationDoc.id, ...invitationDoc.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting invitation:", error);
      throw error;
    }
  }

  //update invitation
  static async updateInvitationStatus(invitationId, status, db = getFirestore()) {
    try {
      const invitationDocRef = doc(db, `invitations/${invitationId}`);
      await updateDoc(invitationDocRef, { status: status });
      return {
        success: true,
        invitationId: invitationId,
      };
    } catch (error) {
      console.error("Error updating invitation:", error);
      throw error;
    }
  }

}

export { Invitation };
