import React, { useContext } from 'react'; //racf
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import styled from './NavBar.module.css';

export const NavBar = ({ theme }) => {
  //listening to whenever the auth context changes on app wide level instead of component level
  const auth = useContext(AuthContext);
  const history = useHistory();

  const handleLogOut = () => {
    auth.logout();
    history.push('/login');
  };

  return (
    <nav
      className={`${styled.navigation} ${
        theme === 'light' ? styled.light : styled.dark
      } `}
    >
      <ul className={styled.links}>
        {auth.isLoggedIn && (
          <li>
            <p onClick={handleLogOut}>Logout</p>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
