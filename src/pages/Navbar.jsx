import React from 'react';

const Navbar = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // The block: 'center' option often provides a better viewing experience
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Updated the links array to include the new section and use a targetId property
  const navLinks = [
    { label: 'SAR-A', targetId: 'section-1' }, // <-- Your new section link
    { label: 'Description', targetId: 'section-2' },
    { label: 'SAR Examples', targetId: 'sar-examples' },
    { label: 'Team Members', targetId: 'section-3' },
    { label: 'How to Operate?', targetId: 'section-4' },
    { label: 'Warm Up Game', targetId: 'section-5' },
    { label: 'Secret Door', targetId: 'section-6' },
  ];

  return (
    <nav className="navbar-container">
      {navLinks.map((link) => (
        <button 
          key={link.label} // Use a unique value like the label for the key
          className="nav-button" 
          // onClick now directly uses the targetId from the array
          onClick={() => scrollToSection(link.targetId)}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;