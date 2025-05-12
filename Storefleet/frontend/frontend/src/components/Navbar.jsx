import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Navbar.css';

function UserProfile() {
  const [hover, setHover] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); //  track location changes

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/storefleet/user/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.userDetails);
        } else {
          console.error('Failed to fetch user:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [location]); //  re-fetch when route changes

  const handleClick = () => {
    navigate('/profile');
  };

  if (!user) {
    return <div className="user-profile-placeholder">Loading...</div>;
  }

  return (
    <div
      className="user-profile"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={user.profileImg?.url || 'https://i.pravatar.cc/40?img=3'}
        alt="User"
        className="user-image"
      />
      {hover && (
        <div className="user-hover-card">
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/users">Users</Link>
      </div>
      <UserProfile />
    </nav>
  );
}

export default Navbar;
