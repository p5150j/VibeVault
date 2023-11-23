import React, { useState, useEffect, useCallback } from "react";
import { firestore, auth } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

function SettingsPage() {
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");

  const handleCompanyNameChange = (e) => setCompanyName(e.target.value);
  const handleBillingAddressChange = (e) => setBillingAddress(e.target.value);
  const handleContactPhoneChange = (e) => setContactPhone(e.target.value);
  const handleContactNameChange = (e) => setContactName(e.target.value);
  const handleContactTitleChange = (e) => setContactTitle(e.target.value);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (companyId) {
        const companyRef = doc(firestore, "Companies", companyId);
        const companyDoc = await getDoc(companyRef);
        if (companyDoc.exists()) {
          setCompanyName(companyDoc.data().name);
          setBillingAddress(companyDoc.data().billingAddress || "");
          setContactPhone(companyDoc.data().contactPhone || "");
          setContactName(companyDoc.data().contactName || "");
          setContactTitle(companyDoc.data().contactTitle || "");
        }
      }
    };

    fetchCompanyData();
  }, [companyId]);

  //   const handleCompanyNameChange = (e) => {
  //     setCompanyName(e.target.value);
  //   };

  const updateCompanyInfo = async () => {
    const companyRef = doc(firestore, "Companies", companyId);
    try {
      await updateDoc(companyRef, {
        name: companyName,
        billingAddress,
        contactPhone,
        contactName,
        contactTitle,
      });
      console.log("Company information updated");
    } catch (error) {
      console.error("Error updating company information:", error);
    }
  };

  const fetchUserData = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      const usersRef = collection(firestore, "Users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setCompanyId(userData.companyId);
      }
    }
  }, []);

  const fetchInvitations = useCallback(async () => {
    const invitationsRef = collection(firestore, "invitations");
    const q = query(invitationsRef, where("companyId", "==", companyId));
    const querySnapshot = await getDocs(q);
    setInvitations(querySnapshot.docs.map((doc) => doc.data()));
  }, [companyId]);

  const fetchUsers = useCallback(async () => {
    const usersRef = collection(firestore, "Users");
    const q = query(usersRef, where("companyId", "==", companyId));
    const querySnapshot = await getDocs(q);
    setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  }, [companyId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (companyId) {
      setLoading(true);
      fetchInvitations();
      fetchUsers();
    }
  }, [companyId, fetchInvitations, fetchUsers]);

  const removeUser = async (userId) => {
    await deleteDoc(doc(firestore, "Users", userId));
    setLoading(true);
    await fetchUsers();
    setLoading(false);
  };

  const sendInvitation = async () => {
    const response = await fetch(
      "https://us-central1-vibevault-27c44.cloudfunctions.net/sendInviteEmail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, companyId }),
      }
    );

    if (response.ok) {
      console.log("Invitation sent successfully");
      setEmail("");
    } else {
      console.error("Failed to send invitation");
    }
  };

  return (
    <div className="p-6">
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-5">Admin Dashboard</h1>

        <h2 className="text-2xl font-bold mt-5">Company Information</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Company Name</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={handleCompanyNameChange}
            placeholder={companyName || "Company Name"}
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Billing Address</span>
          </label>
          <input
            type="text"
            value={billingAddress}
            onChange={handleBillingAddressChange}
            placeholder={billingAddress || "Billing Address"}
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Contact Phone</span>
          </label>
          <input
            type="text"
            value={contactPhone}
            onChange={handleContactPhoneChange}
            placeholder={contactPhone || "Contact Phone"}
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Contact Name</span>
          </label>
          <input
            type="text"
            value={contactName}
            onChange={handleContactNameChange}
            placeholder={contactName || "Contact Name"}
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Contact Title</span>
          </label>
          <input
            type="text"
            value={contactTitle}
            onChange={handleContactTitleChange}
            placeholder={contactTitle || "Contact Title"}
            className="input input-bordered"
          />
        </div>

        <button onClick={updateCompanyInfo} className="btn btn-neutral mt-2">
          Update Company Info
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-5">Company users</h2>
      <div>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <table className="table  table-zebra w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation, index) => (
                <tr key={index}>
                  <td>{invitation.email}</td>
                  <td>Invited</td>
                  <td></td>
                </tr>
              ))}
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>Signed Up</td>
                  <td>
                    <button
                      onClick={() => removeUser(user.id)}
                      className="btn btn-primary btn-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h2 className="text-2xl font-bold mt-5">Invite users</h2>
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Employee Email"
            className="input input-bordered input-neutral w-full max-w-xs"
          />
          <button onClick={sendInvitation} className="btn btn-neutral ml-2">
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
