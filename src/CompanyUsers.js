import React, { useState, useEffect } from "react";
import { auth, firestore } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

function CompanyUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const adminUser = auth.currentUser;
      if (adminUser) {
        // Get the admin's company ID from their user document
        const adminDocRef = doc(firestore, "Users", adminUser.uid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists()) {
          const adminCompanyId = adminDocSnap.data().companyId;

          // Query for all users with the same companyId
          const usersRef = collection(firestore, "Users");
          const q = query(usersRef, where("companyId", "==", adminCompanyId));
          const querySnapshot = await getDocs(q);

          const userList = [];
          querySnapshot.forEach((doc) => {
            userList.push(doc.data());
          });

          setUsers(userList);
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Company Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.email} - {user.userType}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyUsers;
