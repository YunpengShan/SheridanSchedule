import React, { useEffect, useState } from 'react';
import { Box, Button } from "@mui/material";
import { collection, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebase'; // Adjust the path as needed
import './SaveTimeBlocks.css';

const SavedTimeBlocks = () => {
    const [timeBlocks, setTimeBlocks] = useState([]);

    useEffect(() => {
        if (!auth.currentUser) {
            console.error("No authenticated user found!");
            return;
        }

        const unsubscribe = onSnapshot(query(collection(db, `userTimeBlocks/${auth.currentUser.uid}/blocks`)), (querySnapshot) => {
            const blocks = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                blocks.push({
                    ...data,
                    id: doc.id // Include the document ID for deletion
                });
            });

            // Sort blocks by day of the week
            const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; // Add more days if necessary
            blocks.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

            setTimeBlocks(blocks);
        });

        // Clean up the subscription on component unmount
        return () => unsubscribe();
    }, []);


    const handleDelete = async (blockId) => {
        if (!auth.currentUser) {
            console.error("No authenticated user found!");
            return;
        }

        const docRef = doc(db, `userTimeBlocks/${auth.currentUser.uid}/blocks`, blockId);
        try {
            await deleteDoc(docRef);
            console.log("Time block deleted successfully");
        } catch (error) {
            console.error("Error deleting time block: ", error);
        }
    };

    function getColor(day) {
        switch (day) {
            case 'Monday':
                return '#9ed1a9'; // Light green
            case 'Tuesday':
                return '#7ac5cd'; // Light blue
            case 'Wednesday':
                return '#b19cd9'; // Light purple
            case 'Thursday':
                return '#f3e5ab'; // Light yellow
            case 'Friday':
                return '#f9b6a0'; // Light orange
            default:
                return '#FFFFFF'; // White
        }
    }

    return (
        <Box className="savedTimeBlocksContainer"
             bgcolor="#FFFFFF"
             maxWidth="75rem"
             sx={{
                 border: "3px solid black",
                 borderBottomLeftRadius: "0",
                 borderBottomRightRadius: "0",
                 alignItems: "center",
                 display: "flex",
                 justifyContent: "center",
                 margin: "2rem",
             }}
             style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
            <table className="savedTimeBlocksTable">
                <thead>
                <tr>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Course Name</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {timeBlocks.map((block, index) => (
                    <tr key={index}>
                        <td style={{backgroundColor: getColor(block.day)}}>{block.day}</td>
                        <td style={{backgroundColor: getColor(block.day)}}>{block.startTime}</td>
                        <td style={{backgroundColor: getColor(block.day)}}>{block.endTime}</td>
                        <td style={{backgroundColor: getColor(block.day)}}>{block.courseName}</td>
                        <td>
                            <Button variant="contained" color="error" onClick={() => handleDelete(block.id)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Box>
    );
};

export default SavedTimeBlocks;
