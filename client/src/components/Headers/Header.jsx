import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlobalState } from '../../globalstate';
import { Close, Menu } from './icon';
import './Header.css';
import axios from 'axios';

const Header = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [menu, setMenu] = useState(false);

  const logoutUser = async () => {
    await axios.post('/user/logout');
    localStorage.removeItem('firstLogin');
    window.location.href = '/';
  };

  const adminRouter = () => (
    <>
      <li>
        <Link to='/create_product'>Create Product</Link>
      </li>
      <li>
        <Link to='/category'>Categories</Link>
      </li>
    </>
  );

  const loggedRouter = () => (
    <>
      <li>
        <Link to='/' onClick={logoutUser}>
          Logout
        </Link>
      </li>
    </>
  );

  const styleMenu = {
    left: menu ? -0 : '-100%',
  };

  return (
    <header>
      <div className='menu' onClick={() => setMenu(!menu)}>
        <img src={Menu} alt='menu icon' width='30' />
      </div>

      <div className='logo'>
        <h1>
          <Link to='/'>{isAdmin ? 'Admin' : 'Eae Pepegas'}</Link>
        </h1>
      </div>

      <ul style={styleMenu}>
        <li>
          <Link to='/'>{isAdmin && 'Products'}</Link>
        </li>

        {isAdmin && adminRouter()}
        {isLogged ? (
          loggedRouter()
        ) : (
          <li>
            <Link to='/login'>Login</Link>
          </li>
        )}

        <li onClick={() => setMenu(!menu)}>
          <img src={Close} alt='close icon' width='30' className='menu' />
        </li>
      </ul>
    </header>
  );
};

export default Header;
