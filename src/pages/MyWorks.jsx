import React from 'react';
import { Link } from 'react-router-dom';
import { config } from '../config/config';

export const MyWorks = () => {
  return (
    <div className="myworks-page">
      <div className="myworks-header">
        <Link to="/" className="back-button" data-cursor="disable">
          ← Back to Home
        </Link>
        <h1>
          All <span>Works</span>
        </h1>
        <p>A collection of all my projects, systems and creations</p>
      </div>

      <div className="myworks-grid">
        {config.projects.map((proj, idx) => (
          <a
            key={proj.id}
            className="myworks-card"
            data-cursor="disable"
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="myworks-card-number">0{idx + 1}</div>
            <div className="myworks-card-image">
              <img src={proj.image} alt={proj.title} loading="lazy" />
            </div>
            <div className="myworks-card-info">
              <h3>{proj.title}</h3>
              <p className="myworks-card-category">{proj.category}</p>
              <p className="myworks-card-description">{proj.description}</p>
              <p className="myworks-card-tech">{proj.technologies}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MyWorks;
