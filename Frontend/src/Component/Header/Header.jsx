import React, { useState, useEffect } from 'react';
import './Header.css';
import Logo from '../../assets/images/logo.png';
import SearchBox from './SearchBox/SearchBox';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { IoBagOutline } from 'react-icons/io5';
import { IoMdHeartEmpty } from "react-icons/io";
import { FiUser } from 'react-icons/fi';
import { Drawer } from "@mui/material"
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import RangeImg from "../../assets/images/PriceRangeImg.png";

const Header = () => {
  const [accountDrop, setAccountDrop] = useState(false);
  const [loginInfo, setLoginInfo] = useState("Login");
  const [userName, setUserName] = useState(localStorage.getItem("user"));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserName(localStorage.getItem("user"));
      setLoginInfo("Logout");
    } else {
      setLoginInfo("Login");
    }
  }, []);

  const openAccountDrop = () => {
    setAccountDrop(prevState => !prevState);
  }

  const handleLog = () => {
    // Clear user info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoginInfo("Login"); // Update the login state after logout
  }

  const handleAccountClickAway = () => {
    setAccountDrop(false);
  }

  const toggleCart = (state) => {
    setCartOpen(state);
  };

  return (
    <>
      <header className='header'>
        <div className='container'>
          <div className='row d-flex'>
            <div className='logoWrapper d-flex align-items-center col-sm-2'>
              <Link to={'/'}> <img src={Logo} alt='Logo' /> </Link>
            </div>

            <div className='col-sm-10 d-flex align-items-center justify-content-between part2'>
              <SearchBox />
              <div className='part3 d-flex align-items-center ml-auto'>
                <div className='ml-auto cartTab d-flex align-items-center'>
                  <div className='position-relative mx-2'>
                    <Button className='circle mx-1'><IoMdHeartEmpty /></Button>
                    <span className='count d-flex align-items-center justify-content-center'>1</span>
                  </div>

                  <div className='position-relative mx-2'>
                    <Button className='circle' onClick={() => toggleCart(true)}><IoBagOutline /></Button>
                    <span className='count d-flex align-items-center justify-content-center'>1</span>
                  </div>

                  <h5 className='mb-0' style={{ fontSize: '17px', fontWeight: '600', color: 'white' }}>Rs.10k</h5>

                  <Button className='circle mx-3' onClick={openAccountDrop}><FiUser /></Button>
                  {accountDrop && (
                    <div className='summary-conatiner'>
                      <ClickAwayListener onClickAway={handleAccountClickAway}>
                        <ul className='dropdown-container'>
                          <Button><li>My Order</li></Button>
                          <Button><li>My Profile</li></Button>
                          <Button><li>My Wishlist</li></Button>
                          <Button><li>Edit Profile</li></Button>
                          <div className='seprator'></div>
                          <Button onClick={handleLog}><Link to="/login"><li>{loginInfo}</li></Link></Button>
                        </ul>
                      </ClickAwayListener>
                    </div>
                  )}
                  <div><p className='username'>{userName}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav>
        <div className='container-nav'>
          <div className='row justify-content-center'>
            <ul className='col-sm-6 m-1 navPart justify-content-between' style={{ display: 'flex', listStyle: 'none' }}>
              <li><Button className='btn'> NEW ARRIVALS </Button></li>
              <li><Button className='btn'>SAREES</Button>
                <div className='dropdown_menu megaMart'>
                  <ul style={{ paddingLeft: '0px' }}>
                    <div className='row'>
                      <div className='col'>
                        <h3 className='text-g'>SHOP BY TYPE</h3>
                        <div className='sep-line'></div>
                        <ul>
                          <li><Link to="">Kanjivaran Sarees</Link></li>
                          <li><Link to="">Banarasi Sarees</Link></li>
                          <li><Link to="">Kashmiri Jamewar Sarees</Link></li>
                          <li><Link to="">Khaddi Georgette Sarees</Link></li>
                          <li><Link to="">Paithani Sarees</Link></li>
                          <li><Link to="">Patola Sarees</Link></li>
                          <li><Link to="">Digital Print Sarees</Link></li>
                          <li><Link to="">Embroidered Sarees</Link></li>
                        </ul>
                      </div>
                      <div className='col'>
                        <h3 className='text-g'>SHOP BY FABRIC</h3>
                        <div className='sep-line'></div>
                        <ul>
                          <li><Link to="">Satin Silk</Link></li>
                          <li><Link to="">Banarasi Silk</Link></li>
                          <li><Link to="">Cotton</Link></li>
                          <li><Link to="">Linen</Link></li>
                          <li><Link to="">Crepe </Link></li>
                          <li><Link to="">Dola Silk</Link></li>
                          <li><Link to="">Tissue </Link></li>

                        </ul>
                      </div>
                      <div className='col'>
                        <h3 className='text-g'>SPECIAL COLLECTIONS</h3>
                        <div className='sep-line'></div>
                        <ul>
                          <li><Link to=""> Best Sellers: Loved By All</Link></li>
                          <li><Link to=""> Luxe: Handloom Luxury Sarees</Link></li>
                          <li><Link to=""> Everyday Essentials</Link></li>
                          <li><Link to=""> Fresh Arrivals</Link></li>
                          <li><Link to=""> Summer Prints</Link></li>
                        </ul>
                      </div>

                      <div className='col'>
                        <img src={RangeImg} alt="priceRangeImg" style={{ width: '90%', border: '4px solid #09243c', margin: '10px' }} />
                        <h3 className='text-g'>SHOP BY PRICE RANGE</h3>
                        <div className='sep-line'></div>
                        <ul>
                          <li><Link to="">Under Rs. 2,999</Link></li>
                          <li><Link to="">Under Rs. 4,999</Link></li>
                          <li><Link to="">Under Rs. 6,999</Link></li>
                          <li><Link to="">Under Rs. 8,999</Link></li>
                          <li><Link to="">Under Rs. 16,999</Link></li>
                          <li><Link to="">Above Rs. 16,999</Link></li>
                        </ul>
                      </div>
                    </div>
                  </ul>
                </div>
              </li>
              <li><Button className='btn'> LEHENGAS </Button></li>
              <li><Button className='btn'> JEWELLERY </Button></li>
              <li><Button className='btn'> LUXE </Button></li>
              <li><Button className='btn'> BEST SELLERS </Button></li>
            </ul>
          </div>
        </div>
      </nav>
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
}

export default Header;
