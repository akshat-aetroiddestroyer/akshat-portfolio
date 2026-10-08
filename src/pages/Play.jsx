import React from 'react';
import { Link } from 'react-router-dom';
import { InteractiveChess } from '../components/InteractiveChess';
import '../styles/Play.css';

export const Play = () => {
  return (
    <div className="play-page">
      <div className="play-header">
        <Link to="/" className="back-button" data-cursor="disable">
          ← Back to Portfolio
        </Link>
      </div>

      <InteractiveChess />
    </div>
  );
};

export default Play;
