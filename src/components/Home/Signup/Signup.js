import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../firebase/firebase'; // Adjust the path as needed
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReactGA from "react-ga4"; // Ensure ReactGA is imported

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false); // State to control dialog visibility
    const [success, setSuccess] = useState(false); // State to track signup success
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Account created successfully!");
            setSuccess(true); // Indicate signup success
            setOpen(true); // Open dialog on success

            // Track successful signup
            ReactGA.event({
                category: 'User',
                action: 'Signup',
                label: 'Success'
            });

        } catch (error) {
            console.error("Signup failed: ", error.message);
            setSuccess(false); // Indicate signup failure
            setOpen(true); // Open dialog on error

            // Track signup failure
            ReactGA.event({
                category: 'User',
                action: 'Signup',
                label: 'Failure',
                value: error.code // or 'Signup Failure'
            });
        }
    };

    const handleClose = () => {
        setOpen(false);
        if (success) {
            navigate('/');
        }
    };

    const handleCancel = () => {
        navigate('/');
    }

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
                Signup
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
            <Button variant="contained" onClick={handleSignup} sx={{ width: '80%' , mb: 1 }}>
                Signup
            </Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ width: '80%' }}>
                Cancel
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{success ? "Signup Successful" : "Signup Failed"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {success ? "Your account has been created successfully. You can now go back to the login page." : "An error occurred. Please try again."}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        {success ? "Go to Login" : "Close"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Signup;
