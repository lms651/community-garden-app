// import type { User } from "../types/User";

// interface EditProfileProps {
//   user: User | null;
// }

// export default function EditProfile({ user }: EditProfileProps) {
//   return (
//     <div>
//       <h1>Edit your information here, {user?.userName}</h1>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";

interface EditProfileProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Profile({ user, setUser }: EditProfileProps) {
  const navigate = useNavigate();

  if (!user) {
    return <p>You must be logged in to view this page.</p>;
  }

  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [address, setAddress] = useState(user.address || "");
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ displayName, address }),
        }
      );

      if (!res.ok) {
        setError("Could not update profile.");
        return;
      }

      const updatedUser = await res.json();

      // Save updated user in state + localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.toastr.success("Profile updated!", "Success");

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="update-form">
      <h1>Edit Your Profile</h1>

      <form onSubmit={handleSave}>
        <label>Google Name (read-only)</label>
        <input type="text" value={user.userName} readOnly />

        <label>Display Name (optional)</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Choose a public display name"
        />

        <label>Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="save-btn">
          Save
        </button>
      </form>

      <button onClick={() => navigate("/")} className="cancel-btn">
        Cancel
      </button>
    </div>
  );
}
