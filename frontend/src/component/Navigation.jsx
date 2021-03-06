import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function Navigation({ user, logout }) {
  return (
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand href="/">
        <img
          alt=""
          src="/logo.png"
          width="45"
          height="35"
          className="d-inline-block align-top"
          />
          T-Planner
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link className="nav-link" to="/">
            Trips
          </Link>
          <Link className="nav-link" to="/trip/add">
            Add Trip
          </Link>
          <Link className="nav-link" to="/packingLists">
            Packing List
          </Link>
          <Link className="nav-link" to="/packingList/add">
            Add Packing List
          </Link>
        </Nav>
        <Nav>
          {user ? (
            <>
              <Link to={`/user/${user._id}`} className="nav-link">
                {user.firstname} {user.lastname}
              </Link>
              <Link to="/logout" onClick={logout} className="nav-link">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
