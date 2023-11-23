import React, { useState } from "react";
import { auth, firestore } from "./firebase"; // Import the Firestore database reference
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const getUserRole = async (userId) => {
    try {
      const usersRef = collection(firestore, "Users");
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Get the first document in the results
        return userDoc.data().userType; // Return the userType
      } else {
        console.error("No user found with UID:", userId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user role: ", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid; // Get user ID
      const userType = await getUserRole(userId); // Fetch user role

      if (userType === "admin") {
        navigate("/admin-dashboard");
      } else if (userType === "employee") {
        navigate("/employee-dashboard"); // Redirect to employee dashboard
      } else {
        navigate("/"); // Redirect to a default page if userType is not recognized
      }
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
      >
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input input-bordered"
            />
          </div>
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-neutral">
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
