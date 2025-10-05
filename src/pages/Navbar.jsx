import React from 'react';

const Navbar = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { id: 1, label: 'SAR-A' },
    { id: 2, label: 'Description' },
    { id: 3, label: 'Team Members' },
    { id: 4, label: 'How to Operate?' },
    { id: 5, label: 'Warm Up Game' },
    { id: 6, label: 'Secret Door' },
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