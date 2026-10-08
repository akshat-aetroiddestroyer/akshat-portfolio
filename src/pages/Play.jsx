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

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '36px', margin: '0 0 10px', color: '#fff' }}>Playground // Chess Engine</h2>
        <p style={{ color: '#adacac', margin: 0 }}>Challenge the AI chess engine directly</p>
      </div>

      <InteractiveChess />
    </div>
  );
};

export default Play;
