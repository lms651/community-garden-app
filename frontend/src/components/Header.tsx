import Button from "./Button";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <header>
      <div className="left-section">
        {/* <Link to="/" className="logo-link">
            <img className="logo" src={ DO THIS } alt="Community Garden Logo" /> */}
        <span className="title">Community Garden</span>
        {/* </Link> */}
      </div>
      <div className="right-section">
        <Button text="Log in or Sign up!" onClick={handleLogIn} />
      </div>
    </header>
  );
}
