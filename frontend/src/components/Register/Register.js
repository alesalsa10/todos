import React, { Fragment, useState, useContext } from 'react';
import Loader from 'react-loader-spinner';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import styled from './Register.module.css';

export const Register = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');

  const { name, email, password, password2 } = formData;

  let history = useHistory();

  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (password !== password2) {
      setIsLoading(false);
      setError('Passwords do not match, try again');
    } else {
      try {
        const response = await fetch(
          'https://damp-castle-11411.herokuapp.com/api/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

        const responseData = await response.json();
        if (!response.ok) {
          setIsLoading(false);
          setError(responseData.errors[0].msg.toString());
          throw new Error(responseData.errors[0].msg.toString());
        }

        const response2 = await fetch(
          'https://damp-castle-11411.herokuapp.com/api/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );
        const response2Data = await response2.json();
        auth.login(response2Data);
        history.push('/todos')
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Fragment>
      <form onSubmit={onSubmitHandler}>
        <div className={styled.boldLine}></div>
        <div className={styled.container}>
          <div className={styled.window}>
            <div className={styled.overlay}></div>
            <div className={styled.content}>
              <div className={styled.inputFields}>
                <input
                  type='text'
                  placeholder='Name'
                  className={`${styled.inputLine} ${styled.fullWidth}`}
                  value={name}
                  onChange={onChangeHandler}
                  required
                  name='name'
                ></input>
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
                <input
                  type='password'
                  placeholder='Confirm Password'
                  className={`${styled.inputLine} ${styled.fullWidth}`}
                  name='password2'
                  value={password2}
                  onChange={onChangeHandler}
                  minLength='8'
                ></input>
              </div>
              <div className={styled.spacing}>
                Have an account?{' '}
                <span className={styled.highlight}>
                  {' '}
                  <Link to='/login'>Login</Link>{' '}
                </span>
              </div>
              <div className={styled.error}>{error}</div>
              <div>
                {isLoading ? (
                  <Loader type='TailSpin' className={styled.loader} />
                ) : (
                  <button
                    className={`${styled.ghostRound} ${styled.fullWidth}`}
                  >
                    Create Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default Register;
