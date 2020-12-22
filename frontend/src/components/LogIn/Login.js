import React, { Fragment, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import styled from './Login.module.css';
import Loader from 'react-loader-spinner';

export default function Login() {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;
  let history = useHistory();

  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
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

      const responseData = await response.json(); //token
      if (!response.ok) {
        setIsLoading(false);
        setError(responseData.errors[0].msg.toString());
        throw new Error(responseData.errors[0].msg.toString());
      }
      auth.login(responseData);
      history.push('/todos');
    } catch (err) {
      console.error(err);
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
                Not registered?{' '}
                <span className={styled.highlight}>
                  <Link to='/register'>Register</Link>
                </span>
              </div>
              <div className={styled.error}> {error} </div>
              <div>
                {isLoading ? (
                  <Loader className={styled.loader} type='TailSpin' />
                ) : (
                  <button
                    className={`${styled.ghostRound} ${styled.fullWidth}`}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
