import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  collection,
  // doc,
  // getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { database } from 'config/direabse.config';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">Kibina</Link> {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
  const [telValue, setTelValue] = React.useState('');
  const handleChange = (event) => {
    const newValue = event.target.value.replace(/\D/g, '').slice(0, 10); // Remove non-numeric characters and limit to 10 digits
    setTelValue(newValue);
  };
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const membersDb = collection(database, 'members');

    const querySnapshot = await getDocs(query(membersDb, where('telephone', '==', parseInt(telValue))));
    if (!querySnapshot.empty) {
      console.log('querySnapshot?.docs[0].data()', querySnapshot?.docs[0].data());
      localStorage.setItem('userm', JSON.stringify(querySnapshot?.docs[0].data()));
      navigate('/app/gutura');
      window.location.reload()
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyCOntent: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="usernames"
              label="Amazina"
              type="text"
              id="usernames"
              variant="outlined"
              InputLabelProps={{ shrink: true, style: { fontSize: '1.2rem' } }}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="telephone"
              name="telephone"
              value={telValue}
              onChange={handleChange}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 10
              }}
              label="Telephone"
              sx={{ my: 2 }}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true, style: { fontSize: '1.2rem' } }}
            />
            {/* <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="emailtelephone"
              autoFocus
            /> */}
            {/* <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            /> */}
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              {/* <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
