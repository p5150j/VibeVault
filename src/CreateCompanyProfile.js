import React, { useState } from "react";
import { firestore } from "./firebase";
import { doc, updateDoc } from "firebase/firestore"; // Correct imports
import { useParams, useNavigate } from "react-router-dom";

function CreateCompanyProfile() {
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();
  const { companyId } = useParams(); // Retrieve the company ID from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the existing company document
      const companyDocRef = doc(firestore, "Companies", companyId);
      await updateDoc(companyDocRef, {
        name: companyName,
        // Add other company fields as necessary
      });

      navigate("/dashboard"); // Redirect to dashboard or another appropriate page
    } catch (error) {
      console.error("Error updating company: ", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company Name"
          className="input-field"
        />
        {/* Add other input fields for company details */}
        <button type="submit" className="submit-button">
          Update Company Profile
        </button>
      </form>
    </div>
  );
}

export default CreateCompanyProfile;
