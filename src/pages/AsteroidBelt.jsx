
import React, { useMemo } from 'react';
import AsteroidImage from '../assets/asteroid.png';

const AsteroidBelt = ({ count = 60 }) => {
  const asteroids = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const verticalSpread = 30; 
      const top = 50 + (Math.random() * verticalSpread - verticalSpread / 2); 
      const left = Math.random() * 100; 

      return {
        id: i,
        style: {
          top: `${top}%`,
          left: `${left}%`,
          transform: `
            rotate(${Math.random() * 360}deg)
            scale(${Math.random() * 0.8 + 0.4})
          `,
          opacity: Math.random() * 0.7 + 0.3,
        },
        animationDuration: `${Math.random() * 10 + 8}s`,
      };
    });
  }, [count]);

  return (
    <div className="asteroid-belt-container">
      {asteroids.map(({ id, style, animationDuration }) => (
        <div key={id} className="asteroid-wrapper" style={style}>
          <img
            src={AsteroidImage}
            className="asteroid"
            alt="Asteroid"
            style={{ animationDuration }}
          />
        </div>
      ))}
    </div>
  );
};

export default AsteroidBelt;