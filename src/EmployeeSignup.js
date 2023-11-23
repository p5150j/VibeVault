import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { firestore, auth } from "./firebase"; // Adjust this import based on your project structure

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

function EmployeeSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // Extract token from URL
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      const invitationsRef = collection(firestore, "invitations");
      const q = query(invitationsRef, where("token", "==", token));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setEmail(doc.data().email);
          setCompanyId(doc.data().companyId);
          setIsTokenValid(true);
        });
      } else {
        setError("Invalid or expired token.");
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const handleSignup = async () => {
    if (!isTokenValid) {
      setError("Invalid or expired token.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(firestore, "Users", user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: email,
          userType: "employee",
          companyId: companyId,
        },
        { merge: true }
      );

      navigate("/employee-dashboard");
    } catch (signupError) {
      setError(signupError.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSignup();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 p-5"
      >
        <div className="card-body">
          <h2 className="card-title">Employee Signup</h2>
          <p className="mb-4">
            You're just one step away from joining our team. Please set your
            password to activate your employee account.
          </p>
          {error && <p className="text-red-500">{error}</p>}
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
              disabled
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

export default EmployeeSignup;
