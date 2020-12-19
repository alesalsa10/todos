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

  let routes;

  if (token) {
    routes = (
      <Fragment>
        <Route exact path='/' component={Todos} />
        <Route exact path='/todos' component={Todos} />
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
          <NavBar />
          <Switch>{routes}</Switch>
        </Fragment>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
