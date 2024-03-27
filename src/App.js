import './App.css';
import React, { useEffect, useState } from 'react';
import Navbar from "./components/SideNav/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UpdateSchedule from "./pages/UpdateSchedule";
import Login from "./components/Home/Login/Login";
import Signup from "./components/Home/Signup/Signup";
import { Typography } from "@mui/material";
import { auth } from './firebase/firebase';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import ReactGA from 'react-ga4'

ReactGA.initialize("G-25EBLBV3VW")


export default function App() {
    const [user, setUser] = useState(null); // State to hold the authenticated user

    useEffect(() => {
        // Set the persistence to Local to keep the user logged in across refreshes
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                // Listen for authentication state changes
                const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                    setUser(currentUser); // Update the user state based on the authentication state
                });

                // Cleanup subscription on unmount
                return () => unsubscribe();
            })
            .catch((error) => {
                console.error("Error setting the auth persistence:", error);
            });
    }, []);

    return (
        <div className="app-container">
            <div className="content-wrapper">
                <div className="left-panel">
                    <Navbar/>
                </div>
                <div className="right-panel">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        { <Route path="/login" element={<Login/>}/>}
                        { <Route path="/signup" element={<Signup/>}/>}
                        {user && <Route path="/updateSchedule" element={<UpdateSchedule/>}/>}
                    </Routes>
                </div>
            </div>

            <footer className="sticky-footer">
                <Typography variant="body2" align="center" style={{marginTop: '1rem'}}>
                    &copy; {new Date().getFullYear()} Yunpeng Shan
                </Typography>
            </footer>
        </div>
    );
}
