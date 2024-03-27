import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../firebase/firebase'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import ReactGA from "react-ga4";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false); // State to control dialog visibility
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in successfully!");

            // Track successful login
            ReactGA.event({
                category: 'User',
                action: 'Login',
                label: 'Success'
            });

            navigate('/updateSchedule'); // Navigate on successful login
        } catch (error) {
            console.error("Login failed: ", error.message);
            setOpen(true); // Open dialog on error

            // Track login failure
            ReactGA.event({
                category: 'User',
                action: 'Login',
                label: 'Failure',
                value: error.code // or 'Login Failure'
            });
        }
    };

    const handleGoToSignup = () => {
        // Track navigation to Signup
        ReactGA.event({
            category: 'Navigation',
            action: 'Go to Signup'
        });

        navigate('/signup');
    };

    return (
        <Box
            sx={{
                bgcolor: "#FFFFFF",
                maxWidth: "75rem",
                border: "3px solid black",
                borderRadius: 7,
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "2rem",
                margin: "2rem",
            }}
        >
            <Typography variant="h4" fontFamily={"Orelega One"} sx={{ mb: 2 }}>
                Login
            </Typography>
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2, width: '80%' }}
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2, width: '80%' }}
            />
            <Button variant="contained" onClick={handleLogin} sx={{ width: '80%', mb: 1 }}>
                Login
            </Button>
            <Button variant="outlined" onClick={handleGoToSignup} sx={{ width: '80%' }}>
                Signup
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{"Login Failed"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Wrong credentials. Please try again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Login;