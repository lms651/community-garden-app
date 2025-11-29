import { useState, useEffect, useRef } from "react";
import type { User } from "../types/User";
import { FaFlag, FaTrash } from "react-icons/fa";

interface ProfilePageProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Profile({ user, setUser }: ProfilePageProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const fetchUserGarden = async () => {
      if (!user?._id) return;

      try {
        const res = await fetch(`/users/${user._id}/garden`);
        if (!res.ok) throw new Error("Failed to fetch user garden");
        const data = await res.json();
        setUser(data); // update state with populated garden
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserGarden();
  }, [user?._id]);

  // Click-away listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plantId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add plant");
      }

      const updatedUser = await res.json();

      setDropdownOpen(false);
      setSearch("");

      window.toastr.success("Plant added to garden!", "Success");
      console.log("Plant added to garden:", updatedUser);
      // TODO: refresh the garden grid here
    } catch (err) {
      console.error(err);
      window.toastr.error("Plant already in garden!", "Error");
    }
  };

  const handleToggleTrade = async (plantId: string) => {
    if (!user?._id) return;

    // Find current value in UI
    const plant = user.garden.find((p: any) => p.plantId === plantId);
    const newForTrade = !plant?.forTrade;

    try {
      const res = await fetch(`/users/${user._id}/garden/${plantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forTrade: newForTrade }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const updatedUser = await res.json();
      window.toastr.success("Trade status updated!", "Success");

      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      window.toastr.error("Could not update trade flag", "Error");
    }
  };

  const handleDeletePlant = async (plantId: string) => {
    if (!user?._id) return;

    try {
      const res = await fetch(`/users/${user._id}/garden/${plantId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const updatedUser = await res.json();
      window.toastr.success("Plant removed!", "Success");

      // Update local UI
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      window.toastr.error("Failed to remove plant", "Error");
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.userName}</h1>

      <h1>My Garden</h1>

      {/* Add Plant Button */}
      <div className="plant-dropdown-container" ref={dropdownRef}>
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
      {/* Garden Grid */}
      <div className="garden-grid">
        {user?.garden && user.garden.length > 0 ? (
          user.garden.map((item: any) => {
            if (!item.plantId) return null;

            console.log(item.plantId.image);

            return (
              <div className="plant-card" key={item._id}>
                <button
                  className={`trade-toggle ${item.forTrade ? "active" : ""}`}
                  onClick={() => handleToggleTrade(item._id)}
                >
                  <FaFlag />
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleDeletePlant(item._id)}
                >
                  <FaTrash />
                </button>

                <img
                  src={item.plantId.image}
                  alt={item.plantId.name}
                  className="plant-image"
                />

                <p className="plant-name">{item.plantId.name}</p>
              </div>
            );
          })
        ) : (
          <p>You have no plants in your garden yet.</p>
        )}
      </div>
    </div>
  );
}
