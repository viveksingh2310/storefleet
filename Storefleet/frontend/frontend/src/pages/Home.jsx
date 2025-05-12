// Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [heroAnimation, setHeroAnimation] = useState(false);
  const [categoryHovered, setCategoryHovered] = useState(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Trigger hero animation on mount
    setTimeout(() => {
      setHeroAnimation(true);
    }, 500); // Adjust delay as needed

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const parallaxStyle = {
    transform: `translate(${mousePosition.x / 20}px, ${mousePosition.y / 20}px)`,
  };

  return (
    <div className="home-container">
      {/* Hero Section with Gradient Background */}
      <section className={`hero hero-gradient ${heroAnimation ? 'hero-animate' : ''}`}>
     
        <div className="hero-content">
         <h1 style={{ textAlign: 'center',fontSize:58,color:'#027910'}}>Storefleet Shopping App</h1>
          <h1 className="hero-title">Discover Amazing Products</h1>
          <p className="hero-subtitle">Your one-stop shop for quality goods.</p>
          <Link to="/products" className="hero-button">
            Explore Products <span className="arrow">→</span>
          </Link>
        </div>
        <div className="hero-image-container" style={parallaxStyle}>
          <img src="https://png.pngtree.com/png-clipart/20231029/original/pngtree-shopping-cart-cartoon-three-dimensional-png-image_13453452.png" alt="Product Showcase" className="hero-image" />
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="featured-categories">
        <h2>Featured Categories</h2>
        <div className="categories-grid">
          <Link
            to="/products?category=electronics"
            className={`category-card ${categoryHovered === 'electronics' ? 'category-hovered' : ''}`}
            onMouseEnter={() => setCategoryHovered('electronics')}
            onMouseLeave={() => setCategoryHovered(null)}
          >
            <div className="category-image-container">
              <img src="https://img.freepik.com/premium-photo/futuristic-gadgets-showcase-lineup-sleek-modern-technological-devices_977107-683.jpg?w=2000" alt="Electronics" />
            </div>
            <h3>Electronics</h3>
          </Link>
          <Link
            to="/products?category=clothing"
            className={`category-card ${categoryHovered === 'clothing' ? 'category-hovered' : ''}`}
            onMouseEnter={() => setCategoryHovered('clothing')}
            onMouseLeave={() => setCategoryHovered(null)}
          >
            <div className="category-image-container">
              <img src="https://c1.peakpx.com/wallpaper/573/909/315/store-clothes-clothing-line-fashion-wallpaper.jpg" alt="Clothing" />
            </div>
            <h3>Clothing</h3>
          </Link>
          <Link
            to="/products?category=books"
            className={`category-card ${categoryHovered === 'books' ? 'category-hovered' : ''}`}
            onMouseEnter={() => setCategoryHovered('books')}
            onMouseLeave={() => setCategoryHovered(null)}
          >
            <div className="category-image-container">
              <img src="https://wallpapers.com/images/file/book-pictures-5m0cu37baos2nf63.jpg" alt="Books" />
            </div>
            <h3>Books</h3>
          </Link>
          <Link
            to="/products?category=home"
            className={`category-card ${categoryHovered === 'home' ? 'category-hovered' : ''}`}
            onMouseEnter={() => setCategoryHovered('home')}
            onMouseLeave={() => setCategoryHovered(null)}
          >
            <div className="category-image-container">
              <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZSUyMGRlY29yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="Home & Decor" />
            </div>
            <h3>Home & Decor</h3>
          </Link>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="call-to-action">
        <div className="cta-content">
          <h2>Ready to Start Shopping?</h2>
          <p>Explore our wide selection of products and find exactly what you need.</p>
          <Link to="/products" className="cta-button">
            Browse All Products <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Navigation Links (for demonstration - you might have a separate Navbar) */}
      <nav className="home-navigation">
        <ul>
          <li>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
          <li>
            <Link to="/orders" className="nav-link">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/users" className="nav-link">
              Users
            </Link>
          </li>
          <li>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;