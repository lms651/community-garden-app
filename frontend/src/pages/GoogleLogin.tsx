import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";

interface GoogleLoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function GoogleLogin({ setUser }: GoogleLoginProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google) {
      console.error("Google script not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCallback,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
        width: 300,
      }
    );
  }, []);

  async function handleCallback(response: any) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (data.token && data.user) {
        // Save to local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Update global state
        setUser(data.user);

        // Toast message BEFORE redirect
        if (data.isNewUser) {
          window.toastr.success("Account created successfully!", "Welcome!");
        } else {
          window.toastr.success("Logged in successfully!", "Welcome back!");
        }

        // Go home
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      window.toastr.error("Google login failed. Try again.", "Error");
    }
  }

  return (
    <div className="login-container">
      <h1>Welcome to Community Garden 🌱</h1>
      <div id="googleBtn"></div>
    </div>
  );
}
