import React from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';

const LoginForm = (props) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh' }}> {/* Adjusted height */}
        <Card sx={{ minWidth: 275, maxWidth: 400, padding: 3 }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
              Login
            </Typography>
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              type="text"
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
            <Button variant="contained" color="primary" onClick={props.login} fullWidth>
              Login
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default LoginForm;
