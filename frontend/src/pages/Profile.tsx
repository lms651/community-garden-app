import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";

interface ProfilePageProps {
  user: User | null;
}

export default function Profile({ user }: ProfilePageProps) {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome, {user?.userName}</h1>

      {!user?.address && (
        <div className="add-address-banner">
          <p>Add your address to see what's growing near you 🌱</p>
          <button onClick={() => navigate("/edit-profile")}>Add Address</button>
        </div>
      )}

      <h1>My Garden</h1>
    </div>
  );
}
