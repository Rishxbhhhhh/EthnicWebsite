import React, { useState, useEffect } from "react";
import "./Header.css";
import Logo from "../../assets/images/logo.png";
import SearchBox from "./SearchBox/SearchBox";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { IoBagOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { Drawer } from "@mui/material";
import ClickAwayListener from "@mui/base/ClickAwayListener";

const Header = () => {
  const [accountDrop, setAccountDrop] = useState(false);
  const [loginInfo, setLoginInfo] = useState("Login");
  const [userName, setUserName] = useState(localStorage.getItem("user"));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUserName(localStorage.getItem("user"));
      setLoginInfo("Logout");
    } else {
      setLoginInfo("Login");
    }
  }, []);

  const openAccountDrop = () => {
    setAccountDrop((prevState) => !prevState);
  };

  const handleLog = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoginInfo("Login");
  };

  const handleAccountClickAway = () => {
    setAccountDrop(false);
  };

  const toggleCart = (state) => {
    setCartOpen(state);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="row d-flex">
            <div className="logoWrapper d-flex align-items-center col-sm-2">
              <Link to={"/"}>
                <img src={Logo} alt="Logo" />
              </Link>
            </div>

            <div className="col-sm-10 d-flex align-items-center justify-content-between part2">
              <SearchBox />
              <div className="part3 d-flex align-items-center ml-auto">
                <div className="ml-auto cartTab d-flex align-items-center">
                  <div className="position-relative mx-2">
                    <Button className="circle mx-1">
                      <IoMdHeartEmpty />
                    </Button>
                    <span className="count d-flex align-items-center justify-content-center">
                      1
                    </span>
                  </div>

                  <div className="position-relative mx-2">
                    <Button className="circle" onClick={() => toggleCart(true)}>
                      <IoBagOutline />
                    </Button>
                    <span className="count d-flex align-items-center justify-content-center">
                      1
                    </span>
                  </div>

                  <h5
                    className="mb-0"
                    style={{ fontSize: "17px", fontWeight: "600", color: "white" }}
                  >
                    Rs.10k
                  </h5>

                  <Button className="circle mx-3" onClick={openAccountDrop}>
                    <FiUser />
                  </Button>
                  {accountDrop && (
                    <div className="summary-container">
                      <ClickAwayListener onClickAway={handleAccountClickAway}>
                        <ul className="dropdown-container">
                          <Button>
                            <li>My Order</li>
                          </Button>
                          <Button>
                            <li>My Profile</li>
                          </Button>
                          <Button>
                            <li>My Wishlist</li>
                          </Button>
                          <Button>
                            <li>Edit Profile</li>
                          </Button>
                          <div className="separator"></div>
                          <Button onClick={handleLog}>
                            <Link to="/login">
                              <li>{loginInfo}</li>
                            </Link>
                          </Button>
                        </ul>
                      </ClickAwayListener>
                    </div>
                  )}
                  <div>
                    <p className="username">{userName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => toggleCart(false)}
        PaperProps={{
          sx: {
            width: "300px",
            padding: "16px",
            backgroundColor: "#f9f9f9",
          },
        }}
      >
        <h3 style={{ marginBottom: "16px", fontWeight: "600" }}>Your Cart</h3>
        <div>
          {/* Replace with actual cart items */}
          <p>No items in the cart yet.</p>
        </div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Go to Checkout
        </Button>
      </Drawer>
    </>
  );
};

export default Header;
