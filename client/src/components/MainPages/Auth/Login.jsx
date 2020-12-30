import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    localStorage.setItem('firstLogin', true);
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/user/login', { ...user });
      window.location.href = '/';
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  return (
    <div className='login-page'>
      <h2>Login</h2>
      <form onSubmit={loginSubmit}>
        <input
          type='email'
          name='email'
          required
          placeholder='Email'
          value={user.email}
          onChange={onChangeInput}
        />
        <input
          type='password'
          name='password'
          required
          autoComplete='on'
          placeholder='Password'
          value={user.password}
          onChange={onChangeInput}
        />

        <div className='row'>
          <button type='submit'>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
