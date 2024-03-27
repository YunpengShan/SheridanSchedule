import React, { useState } from 'react';
import { Box, IconButton, MenuItem, Select, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { db } from '../../../firebase/firebase'; // Adjust this import path to your firebase configuration file
import { collection, addDoc, where, getDocs, query } from 'firebase/firestore';
import { auth } from '../../../firebase/firebase'; // Ensure this is correctly imported
import './AddTimeBlock.css';

const AddTimeBlock = () => {
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [courseName, setCourseName] = useState('');
    const [showEmptyWarning, setShowEmptyWarning] = useState(false);
    const [showEndTimeWarning, setShowEndTimeWarning] = useState(false);
    const [showOverlapWarning, setShowOverlapWarning] = useState(false);

    const handleDayChange = (event) => setDay(event.target.value);
    const handleStartTimeChange = (event) => setStartTime(event.target.value);
    const handleEndTimeChange = (event) => setEndTime(event.target.value);
    const handleCourseNameChange = (event) => setCourseName(event.target.value);

    const handleCloseEmptyWarning = () => setShowEmptyWarning(false);
    const handleCloseEndTimeWarning = () => setShowEndTimeWarning(false);
    const handleCloseOverlapWarning = () => setShowOverlapWarning(false);

    const handleSave = async () => {
        if (!day || !startTime || !endTime || !courseName) {
            setShowEmptyWarning(true);
            return;
        }

        if (endTime <= startTime) {
            setShowEndTimeWarning(true);
            return;
        }

        const timeBlocksRef = collection(db, `userTimeBlocks/${auth.currentUser.uid}/blocks`);
        const snapshot = await getDocs(query(timeBlocksRef, where("day", "==", day)));

        let isOverlap = false;
        snapshot.forEach(doc => {
            const { startTime: existingStartTime, endTime: existingEndTime } = doc.data();
            if ((startTime < existingEndTime && endTime > existingStartTime) ||
                (startTime >= existingStartTime && startTime < existingEndTime) ||
                (endTime > existingStartTime && endTime <= existingEndTime)) {
                isOverlap = true;
            }
        });

        if (isOverlap) {
            setShowOverlapWarning(true);
            return;
        }

        if (!auth.currentUser) {
            console.error("No authenticated user found!");
            return;
        }

        const newTimeBlock = { day, startTime, endTime, courseName };
        try {
            await addDoc(collection(db, `userTimeBlocks/${auth.currentUser.uid}/blocks`), newTimeBlock);
            console.log("Time block added successfully");
            setDay('');
            setStartTime('');
            setEndTime('');
            setCourseName('');
        } catch (error) {
            console.error("Error adding time block: ", error);
        }
    };

    const generateTimeOptions = () => {
        const timeOptions = [];
        for (let hour = 1; hour <= 24; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            timeOptions.push(<MenuItem key={timeString} value={timeString}>{timeString}</MenuItem>);
        }
        return timeOptions;
    };

    return (
        <Box className="formcontrol" bgcolor={"#FFFFFF"} maxWidth={"75rem"} sx={{
            height: "auto",
            minHeight: "5.75rem",
            border: "3px solid black",
            borderRadius: 7,
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            margin: "2rem",
        }}>
            <Stack direction="row" spacing={5} className="addTimeBlockSection">
                <Select value={day} onChange={handleDayChange} style={{ minWidth: 200 }}>
                    <MenuItem value="Monday">Monday</MenuItem>
                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                    <MenuItem value="Thursday">Thursday</MenuItem>
                    <MenuItem value="Friday">Friday</MenuItem>
                </Select>
                <Select value={startTime} onChange={handleStartTimeChange} style={{ minWidth: 200 }}>
                    {generateTimeOptions()}
                </Select>
                <Select value={endTime} onChange={handleEndTimeChange} style={{ minWidth: 200 }}>
                    {generateTimeOptions()}
                </Select>
                <TextField value={courseName} onChange={handleCourseNameChange} />
                <IconButton onClick={handleSave}>
                    <AddIcon />
                </IconButton>
            </Stack>

            <Dialog open={showEmptyWarning} onClose={handleCloseEmptyWarning}>
                <DialogTitle>Empty Input</DialogTitle>
                <DialogContent>
                    <p>Please fill in all fields.</p>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseEmptyWarning}>OK</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showEndTimeWarning} onClose={handleCloseEndTimeWarning}>
                <DialogTitle>Invalid Time Range</DialogTitle>
                <DialogContent>
                    <p>The end time cannot be smaller than or equal to the start time.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEndTimeWarning}>OK</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showOverlapWarning} onClose={handleCloseOverlapWarning}>
                <DialogTitle>Time Block Overlap</DialogTitle>
                <DialogContent>
                    <p>The new time block overlaps with an existing block. Please choose a different time.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseOverlapWarning}>OK</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddTimeBlock;
