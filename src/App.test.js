import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import AdminSignup from "./AdminSignup";
import * as firebaseAuth from "firebase/auth";
import * as firebaseFirestore from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Mock Firebase services and navigation
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("AdminSignup Component", () => {
  beforeEach(() => {
    firebaseAuth.createUserWithEmailAndPassword.mockReset();
    firebaseFirestore.addDoc.mockReset();
    useNavigate.mockReset().mockImplementation(() => jest.fn());
  });

  test("renders the signup form with email and password fields and a submit button", () => {
    const { getByPlaceholderText, getByText } = render(<AdminSignup />);
    expect(getByPlaceholderText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("Password")).toBeInTheDocument();
    expect(getByText("Sign Up")).toBeInTheDocument();
  });

  test("submits the form with correct data", async () => {
    const mockUser = { uid: "user123" };
    const mockCompanyRef = { id: "company123" };
    firebaseAuth.createUserWithEmailAndPassword.mockResolvedValue({
      user: mockUser,
    });
    firebaseFirestore.addDoc.mockResolvedValue(mockCompanyRef);
    const navigate = useNavigate();

    const { getByPlaceholderText, getByText } = render(<AdminSignup />);

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(getByText("Sign Up"));

    await waitFor(() => {
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), // Actual auth object if available
        "test@example.com",
        "password123"
      );
      expect(firebaseFirestore.addDoc).toHaveBeenCalledTimes(2); // Two calls: one for company and one for user
      expect(navigate).toHaveBeenCalledWith(
        "/create-company-profile/company123"
      );
    });
  });

  test("handles errors during form submission", async () => {
    firebaseAuth.createUserWithEmailAndPassword.mockRejectedValue(
      new Error("Signup failed")
    );

    const { getByPlaceholderText, getByText, findByText } = render(
      <AdminSignup />
    );

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(getByText("Sign Up"));

    const errorMessage = await findByText("Signup failed");
    expect(errorMessage).toBeInTheDocument();
  });

  // Additional tests as needed
});
