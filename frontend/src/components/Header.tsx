// import Button from "./Button";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import type { User } from "../types/User";
// import logo from "../public/images/logo5.png";

// interface HeaderProps {
//   user: User | null;
//   setUser: React.Dispatch<React.SetStateAction<User | null>>;
// }

// export default function Header({ user, setUser }: HeaderProps) {
//   const navigate = useNavigate();

//   const handleLogIn = () => {
//     navigate("/login");
//   };

//   return (
//     <header>
//       <div className="left-section">
//         <Link to="/" className="logo-link">
//           <img className="logo" src={logo} alt="Community Garden Logo" />
//           <span className="title">Community Garden</span>
//         </Link>
//       </div>
//       <div className="right-section">
//         <Button text="Log in or Sign up!" onClick={handleLogIn} />
//       </div>
//     </header>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItems, MenuItem, MenuButton } from "@headlessui/react";
import { FaUserCircle } from "react-icons/fa";
import type { User } from "../types/User";
import logo from "../../public/images/logo5.jpg";
import Button from "./Button";

interface HeaderProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Header({ user, setUser }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <header>
      <div className="left-section">
        <Link to="/" className="logo-link">
          <img className="logo" src={logo} alt="Community Garden Logo" />
          <span className="title">Community Garden</span>
        </Link>
      </div>

      <div className="right-section">
        {user ? (
          // Logged-in avatar dropdown
          <Menu as="div" className="relative-avatar-container">
            <MenuButton>
              {user.image ? (
                <img
                  src={user.image}
                  className="avatar-img"
                  alt="User Avatar"
                />
              ) : (
                <FaUserCircle size={35} className="avatar-icon" />
              )}
            </MenuButton>

            <MenuItems className="dropdown-menu">
              <MenuItem
                as="button"
                className={({ active }) =>
                  `menu-item ${active ? "active" : ""}`
                }
                onClick={handleProfile}
              >
                View / Edit Profile
              </MenuItem>

              <MenuItem
                as="button"
                className={({ active }) =>
                  `menu-item ${active ? "active" : ""}`
                }
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </MenuItems>
          </Menu>
        ) : (
          // Not logged in → show login button
          <Button text="Log in or Sign up!" onClick={handleLogin} />
        )}
      </div>
    </header>
  );
}
