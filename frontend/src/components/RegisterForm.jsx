import React from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';

const RegisterForm = (props) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Card sx={{ minWidth: 275, maxWidth: 400, padding: 3 }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
              Register
            </Typography>
            <TextField
              label="Email"
              variant="outlined"
              type="text"
              name="email"
              value={props.email}
              onChange={e => props.setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={props.password}
              onChange={e => props.setPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              name="confirmPassword"
              value={props.confirmPassword}
              onChange={e => props.setConfirmPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Name"
              variant="outlined"
              type="text"
              name="name"
              value={props.name}
              onChange={e => props.setName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button name="register" variant="contained" color="primary" onClick={props.register} fullWidth>
              Register
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default RegisterForm;
