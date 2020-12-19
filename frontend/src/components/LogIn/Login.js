import React, { Fragment, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import styled from './Login.module.css';

export default function Login() {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const responseData = await response.json(); //token
      if (!response.ok) {
        setError(responseData.errors[0].msg.toString());
        throw new Error(responseData.errors[0].msg.toString());
      }
      auth.login(responseData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Fragment>
      {error && <h3 className='error'>{error}</h3>}
      <form onSubmit={onSubmitHandler}>
        <div className={styled.boldLine}></div>
        <div className={styled.container}>
          <div className={styled.window}>
            <div className={styled.overlay}></div>
            <div className={styled.content}>
              <div className={styled.inputFields}>
                <input
                  type='email'
                  placeholder='Email'
                  className={`${styled.inputLine} ${styled.fullWidth}`}
                  value={email}
                  onChange={onChangeHandler}
                  required
                  name='email'
                ></input>
                <input
                  type='password'
                  placeholder='Password'
                  className={`${styled.inputLine} ${styled.fullWidth}`}
                  value={password}
                  minLength='8'
                  onChange={onChangeHandler}
                  name='password'
                ></input>
              </div>
              <div className={styled.spacing}>
                Not register? <span className={styled.highlight}><Link to='/register'>Register</Link></span>
              </div>
              <div>
                <button className={`${styled.ghostRound} ${styled.fullWidth}`}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
