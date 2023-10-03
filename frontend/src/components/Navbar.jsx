import "./Navbar.css";

//COMPONENTS
import { NavLink, Link } from "react-router-dom";
import {
  BsSearch,
  BsHouseDoorFill,
  BsFillPersonFill,
  BsFillCameraFill,
} from "react-icons/bs";

//HOOKS
import { useAuth } from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//REDUX
import { logout, reset } from "../slices/authSlice";

import Logo from "../assets/reactgram_logo.png";
import { useState } from "react";

const Navbar = () => {
  const { auth } = useAuth();
  const { user: userAuth } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <nav id="nav">
      <Link to="/" className="logo">
        <img src={Logo} /> ReactGram
      </Link>
      <form onSubmit={handleSearch} id="search-form">
        <BsSearch />
        <input
          type="text"
          placeholder="Pesquisar"
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <ul id="nav-links">
        {auth ? (
          <>
            <li>
              <NavLink to="/">
                <BsHouseDoorFill />
              </NavLink>
            </li>
            {userAuth && (
              <li>
                <NavLink to={`/users/${userAuth._id}`}>
                  <BsFillCameraFill />
                </NavLink>
              </li>
            )}
            {userAuth && (
              <li className="profile-container">
                <NavLink to="/profile">
                  <BsFillPersonFill />
                  {userAuth._id === user._id && <span>{user.name}</span>}
                </NavLink>
              </li>
            )}
            <li>
              <span onClick={handleLogout}>Sair</span>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login">Entrar</NavLink>
            </li>
            <li>
              <NavLink to="/register">Cadastrar</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
