import React from 'react';
import './home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="navbar">
        <h1 className="logo">KLance</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/explore">Explore</a>
          <a href="/login">Sign In</a>
          <a href="/signup" className="join-btn">Join</a>
        </nav>
      </header>

      <section className="hero-section">
        <h2>Find the perfect full-stack web developer for your project</h2>
        <input type="text" placeholder="Search for full-stack developers..." />
      </section>

      <section className="categories">
        <h3>Popular Full-Stack Development Categories</h3>
        <div className="category-list">
          <div className="category-card">React & Node.js</div>
          <div className="category-card">MERN Stack</div>
          <div className="category-card">LAMP Stack</div>
          <div className="category-card">JavaScript Frameworks</div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 freelance. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
