import useValue from '#/hooks/useValue';
import { ArrowBack, Close } from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import {
  Button,
  Dialog,
  Divider,
  Fade,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import API from '#/api';
import * as React from 'react';
import TextInput, { ErrorTypeMap } from '#/components/inputs/TextInput';

const SigninComponent: React.FC<{ onClose: () => void; open?: boolean }> = ({
  open = true,
  onClose,
}) => {
  const tabValue = useValue('1');
  const email = useValue('');
  const username = useValue('');
  const password = useValue('');
  const password2 = useValue('');
  const signInErrors = useValue<ErrorTypeMap>({});
  const signUpErrors = useValue<ErrorTypeMap>({});
  const onSignin = () => {
    API.Auth.signin({ email: email.get, password: password.get })
      .then((e) => e.data)
      .then(console.log)
      .catch((e) => signInErrors.set(e.response.data));
  };
  const onSignup = () => {
    API.Auth.signup({
      email: email.get,
      username: username.get,
      password: password.get,
      password2: password2.get,
    })
      .then((e) => e.data)
      .then(console.log)
      .catch((e) => signUpErrors.set(e.response.data));
  };
  return (
    <Dialog
      open={open}
      sx={(theme) => ({ zIndex: theme.zIndex.drawer + 100 })}
      onClose={onClose}
    >
      <Paper
        sx={(theme) => ({
          p: 1,
          borderRadius: 2,
          width: theme.breakpoints.values.xs,
        })}
      >
        {tabValue.get === '1' && (
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        )}
        {tabValue.get === '2' && (
          <IconButton onClick={() => tabValue.set('1')}>
            <ArrowBack />
          </IconButton>
        )}
        <TabContext value={tabValue.get}>
          <TabPanel value='1'>
            <Fade in={tabValue.get === '1'} timeout={1000}>
              <Stack
                spacing={2}
                alignItems='center'
                component='form'
                onSubmit={(e) => {
                  e.preventDefault();
                  onSignin();
                }}
              >
                <Typography variant='h5'>Login</Typography>
                <Divider />
                <TextInput
                  type='email'
                  name='email'
                  label='Email'
                  value={email.get}
                  onChange={email.onTextChange}
                  size='small'
                  fullWidth
                  autoFocus
                  errors={signInErrors.get}
                />
                <TextInput
                  type='password'
                  name='password'
                  label='Password'
                  value={password.get}
                  onChange={password.onTextChange}
                  size='small'
                  fullWidth
                  errors={signInErrors.get}
                />
                <Button variant='contained' fullWidth type='submit'>
                  Login
                </Button>
                <Button fullWidth onClick={() => tabValue.set('2')}>
                  Sign up
                </Button>
                <Button fullWidth onClick={onClose} color='warning'>
                  Close
                </Button>
                <Divider />
              </Stack>
            </Fade>
          </TabPanel>
          <TabPanel value='2'>
            <Fade in={tabValue.get === '2'} timeout={1000}>
              <Stack
                spacing={2}
                alignItems='center'
                component='form'
                onSubmit={(e) => {
                  e.preventDefault();
                  onSignup();
                }}
              >
                <Typography variant='h5'>Sign Up</Typography>
                <Divider />
                <TextInput
                  type='email'
                  name='email'
                  label='Email'
                  value={email.get}
                  onChange={email.onTextChange}
                  size='small'
                  fullWidth
                  autoFocus
                  errors={signUpErrors.get}
                />
                <TextInput
                  type='text'
                  name='username'
                  label='Username'
                  value={username.get}
                  onChange={username.onTextChange}
                  size='small'
                  fullWidth
                  errors={signUpErrors.get}
                />
                <TextInput
                  type='password'
                  name='password'
                  label='Password'
                  value={password.get}
                  onChange={password.onTextChange}
                  size='small'
                  fullWidth
                  errors={signUpErrors.get}
                />
                <TextInput
                  type='password'
                  name='password2'
                  label='Check Password'
                  value={password2.get}
                  onChange={password2.onTextChange}
                  size='small'
                  fullWidth
                  errors={signUpErrors.get}
                />
                <Button fullWidth variant='contained' type='submit'>
                  Sign up
                </Button>
                <Divider />
              </Stack>
            </Fade>
          </TabPanel>
        </TabContext>
      </Paper>
    </Dialog>
  );
};

export default SigninComponent;
