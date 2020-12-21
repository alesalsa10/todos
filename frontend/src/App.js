import styled from './App.module.css';
import React, { Fragment, useState, useCallback, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Register from './components/Register/Register';
import Login from './components/LogIn/Login';
import Todos from './components/Todos/Todos';
import { AuthContext } from './context/auth-context';

function App() {
  const [token, setToken] = useState(false);
  const [theme, setTheme] = useState('light');

  const login = useCallback((token) => {
    setToken(token);
    localStorage.setItem('token', JSON.stringify({ token: token }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    //auto login
    const token = JSON.parse(localStorage.getItem('token'));
    if (token && token.token) {
      login(token.token);
    }
  }, [login]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'light');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
      currentTheme === 'light' ? setTheme('dark') : setTheme('light');
    }
  }, []);

  let routes;

  if (token) {
    routes = (
      <Fragment>
        <NavBar theme={theme} />
        <Route exact path='/' render={ ()=> <Todos toggleTheme={toggleTheme} theme={theme} /> } />
        <Route exact path='/todos' render={ ()=> <Todos toggleTheme={toggleTheme} theme={theme} /> } />
        <Redirect to='/' />
      </Fragment>
    );
  } else {
    routes = (
      <Fragment>
        <Route exact path='/' component={Landing} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Redirect to='/' />
      </Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <Fragment>
          {/* <NavBar theme={theme} /> */}
          <Switch>{routes}</Switch>
        </Fragment>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
