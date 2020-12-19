import React, { useContext } from 'react'; //racf
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import styled from './NavBar.module.css';

export const NavBar = () => {
  //listening to whenever the auth context changes on app wide level instead of component level
  const auth = useContext(AuthContext);
  const history = useHistory();

  const handleLogOut = () => {
    auth.logout();
    history.push('/login')
  }

  return (
    <nav className={`${styled.navigation} ${styled.light} `}>
      {/* {auth.isLoggedIn && (
      <h1 className={styled.header}>
        <Link to='/todos'>
          <i className='fas fa-list-ul'></i>Todos
        </Link>
      </h1>
      )} */}
      {/* {!auth.isLoggedIn && (
      <h1 className={styled.header}>
        <Link to='/'>
          <i className='fas fa-list-ul'></i>Todos
        </Link>
      </h1>
      )} */}
      <ul className={styled.links}>
        {!auth.isLoggedIn && (
          <li>
            <Link to='/register'>Register</Link>
          </li>
        )}
        {!auth.isLoggedIn && (
          <li>
            <Link to='/login'>Login</Link>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <p onClick={handleLogOut} >Logout</p>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
