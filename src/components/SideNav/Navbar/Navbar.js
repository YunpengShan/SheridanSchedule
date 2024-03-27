import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack } from "@mui/material";
import AppTitle from "../AppTitle/AppTitle";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../firebase/firebase';
import AppIntro from "../AppIntro/AppIntro";

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Signed out successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <Stack direction="column" className="navbar">
            <AppTitle></AppTitle>
            <br/>
            <br/>
            <br/>
            <AppIntro></AppIntro>
            <Box height={150}></Box>
            <Button style={{
                borderRadius: '40px',
                width: '15rem',
                height: '4rem',
                alignSelf: 'center',
                backgroundColor: isLoggedIn ? '#C0D7D8' : '#D3D3D3', // Use a shade of grey when disabled
                fontWeight: 'bold',
                fontFamily: 'Orelega One, sans-serif',
                fontSize: '2rem',
                color: isLoggedIn ? '#1D3557' : '#A9A9A9', // Optionally change the text color too
            }} onClick={handleLogout} disabled={!isLoggedIn}>
                Signout
            </Button>
        </Stack>
    );
}

export default Navbar;
