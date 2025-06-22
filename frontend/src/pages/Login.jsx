import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { Box, Typography } from '@mui/material';

const Login = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const login = async () => {
    const response = await fetch('http://localhost:5005/user/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email, password
      }),
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else if (data.token) {
      // store the token and email in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', email);
      // set the token and email props
      props.setToken(data.token);
      props.setUser(email);
      // navigate to landing page
      navigate('/landing');
    }
  };

  return (
    <>
      <Box sx={{ textAlign: 'center', mt: 2, mb: 1 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{
            fontFamily: 'apple-system',
            color: '#3f51b5',
            fontWeight: 'bold'
          }}
        >
          Airbrb
        </Typography>
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontFamily: 'apple-system',
            color: '#3f51b5',
          }}
        >
          where you can always find your home
        </Typography>
      </Box>

      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        login={login}/>
    </>
  )
}

export default Login;
