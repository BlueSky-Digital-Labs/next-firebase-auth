import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { FirebaseProvider, useFirebase } from "../../src";

test("register an account", () => {
  const RegisterButton = () => {
    const { auth, loading, user } = useFirebase();

    if (loading) {
      return <span>Loading...</span>;
    }

    if (user) {
      return <span>{user.email}</span>;
    }

    const handleRegister = async () => {
      await auth.email.register({
        email: "email@test.com",
        password: "password",
        redirect: "/",
      });
    };

    return <button onClick={handleRegister}>Register</button>;
  };

  render(
    <FirebaseProvider useEmulator>
      <RegisterButton />
    </FirebaseProvider>
  );

  // wait to stop loading
  waitFor(() => {
    expect(screen.getByText("Loading...")).toBeNull();
  });

  // click the register button
  fireEvent.click(screen.getByText("Register"));

  // wait for users email
  waitFor(() => {
    expect(screen.getByText("email@test.com"));
  });
});
