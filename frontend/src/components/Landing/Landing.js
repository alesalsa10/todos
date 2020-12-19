import React from 'react'; //racf
import styled from './Landing.module.css';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <section className={styled.landing}>
      <h1 className={styled.landingTitle}>
        Let us help you organize your day!
      </h1>
      <Link to='/register'>
        <button>Get Started</button>
      </Link>
    </section>
  );
};

export default Landing;
