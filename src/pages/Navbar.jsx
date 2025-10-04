import React from 'react';

const Navbar = () => {
  // Helper function to handle the smooth scroll
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Create an array for the navigation links to keep it DRY
  const navLinks = [
    { id: 1, label: 'Intro' },
    { id: 2, label: 'About' },
    { id: 3, label: 'Team' },
    { id: 4, label: 'How it Works' },
    { id: 5, label: 'Game' },
    { id: 6, label: 'Enter' },
  ];

  return (
    <nav className="navbar-container">
      {navLinks.map((link) => (
        <button 
          key={link.id} 
          className="nav-button" 
          onClick={() => scrollToSection(`section-${link.id}`)}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;