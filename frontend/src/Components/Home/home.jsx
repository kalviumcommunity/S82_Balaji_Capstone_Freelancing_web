import React from 'react';
import './home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="navbar">
        <h1 className="logo">freelance<span>.</span></h1>
        <nav>
          <a href="/">Home</a>
          <a href="/explore">Explore</a>
          <a href="/login">Sign In</a>
          <a href="/signup" className="join-btn">Join</a>
        </nav>
      </header>

      <section className="hero-section">
        <h2>Find the perfect freelancer for your project</h2>
        <input type="text" placeholder="Search for services..." />
      </section>

      <section className="categories">
        <h3>Popular Categories</h3>
        <div className="category-list">
          <div className="category-card">Web Development</div>
          <div className="category-card">Graphic Design</div>
          <div className="category-card">Marketing</div>
          <div className="category-card">Video Editing</div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 freelance. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
