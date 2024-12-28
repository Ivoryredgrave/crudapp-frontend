import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import PropTypes from 'prop-types';
import CustomAlert from "../../components/customAlert";
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { SignInContainer, Card } from '../../styles/loginStyles';
import { Fade } from '@mui/material';

const Footer = React.memo(function Footer(props) {
  return (
    <Typography color="text.secondary" align="center" {...props}>
      CRUDAPP - {new Date().getFullYear()}
    </Typography>
  );
});

const Login = () => {
  const navigate = useNavigate();
  const { isLogged, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (isLogged) {
      navigate('/home', { replace: true });
    } else {
      setLoading(false);
    }
  }, [isLogged, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (e.target.reportValidity()) {
      try {
        await login(username, password);
        navigate('/home', { replace: true });
      } catch (err) {
        setAlert({
          open: true,
          message: err.message,
          severity: 'error'
        });
        setUsername('');
        setPassword('');
      }
    }
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Log In | Crudapp</title>
        </Helmet>

        <CssBaseline enableColorScheme />

        <Fade in timeout={1000}>
          <SignInContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
              >
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleLogin}
                noValidate
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  gap: 2,
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <TextField
                    id="username"
                    type="text"
                    name="username"
                    placeholder="xxxxxx"
                    autoComplete="username"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    required
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Sign in
                </Button>

              </Box>

            </Card>
            <Footer sx={{ mt: 5 }} />
          </SignInContainer>
        </Fade>

        <CustomAlert
          open={alert.open}
          message={alert.message}
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
        />
      </HelmetProvider>
    </>
  );
};

export default Login;

Footer.propTypes = {
  sx: PropTypes.object,
};