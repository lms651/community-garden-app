import { useNavigate } from "react-router-dom";

export default function Home({ user }) {
  return (
    <div>
      <h1>Welcome, {user.userName}</h1>

      {!user.address && (
        <div className="add-address-banner">
          <p>Add your address to see what's growing near you 🌱</p>
          <button onClick={() => navigate("/complete-profile")}>
            Add Address
          </button>
        </div>
      )}
    </div>
  );
}
