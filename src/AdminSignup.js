import React, { useState } from "react";
import { auth, firestore } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create a blank company
      const companyRef = await addDoc(collection(firestore, "Companies"), {
        name: "",
      });

      // Add the admin user data to Firestore with the company ID
      await addDoc(collection(firestore, "Users"), {
        uid: user.uid,
        email,
        userType: "admin",
        companyId: companyRef.id,
      });

      navigate("/create-company-profile/" + companyRef.id);
    } catch (error) {
      console.error("Error signing up: ", error);
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
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminSignup;
