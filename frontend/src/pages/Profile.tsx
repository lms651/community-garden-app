// import { useNavigate } from "react-router-dom";
// import type { User } from "../types/User";
// import Button from "../components/Button";

// interface ProfilePageProps {
//   user: User | null;
// }

// export default function Profile({ user }: ProfilePageProps) {
//   const navigate = useNavigate();

//   const handleAddPlant = () => {
//     console.log("this will be a dropdown populated by all plants in db!");
//   };

//   return (
//     <div>
//       <h1>Welcome, {user?.userName}</h1>

//       {!user?.address && (
//         <div className="add-address-banner">
//           <p>Add your address to see what's growing near you 🌱</p>
//           <button onClick={() => navigate("/edit-profile")}>Add Address</button>
//         </div>
//       )}

//       <h1>My Garden</h1>
//       <Button text="Add Plant!" onClick={handleAddPlant} />
//     </div>
//   );
// }

// import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { User } from "../types/User";
// import Button from "../components/Button";
import { Menu } from "@headlessui/react";

interface ProfilePageProps {
  user: User | null;
}

export default function Profile({ user }: ProfilePageProps) {
  // const navigate = useNavigate();

  const [plants, setPlants] = useState([]); // all plants
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch all plants on mount
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch("/plants");
        const data = await res.json();
        setPlants(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlants();
  }, []);

  const handleAddPlantClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const filteredPlants = plants.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectPlant = async (plantId: string) => {
    try {
      const res = await fetch(`/users/${user?._id}/garden`, {
        // <-- userId in URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plantId }), // <-- plantId in body
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add plant");
      }

      const updatedUser = await res.json();

      // Close dropdown and clear search
      setDropdownOpen(false);
      setSearch("");

      window.toastr.success("Plant added to garden!", "Success");
      console.log("Plant added to garden:", updatedUser);
      // TODO: refresh the garden grid here
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.userName}</h1>

      <h1>My Garden</h1>

      {/* Add Plant Button */}
      <div className="plant-dropdown-container">
        <button onClick={handleAddPlantClick}>Add Plant!</button>

        {dropdownOpen && (
          <div className="plant-dropdown-menu">
            <input
              type="text"
              placeholder="Search plants..."
              className="plant-dropdown-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="plant-dropdown-items">
              {filteredPlants.length === 0 ? (
                <p className="no-matches">No matches</p>
              ) : (
                filteredPlants.map((plant: any) => (
                  <button
                    key={plant._id}
                    className="plant-dropdown-item"
                    onClick={() => handleSelectPlant(plant._id)}
                  >
                    {plant.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
