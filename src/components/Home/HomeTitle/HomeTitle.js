import React from 'react';
import { Box, Typography } from '@mui/material';
import './HomeTitle.css'

function HomeTitle() {
    return (
        <Box
            className={"scheduleTitle"}
            bgcolor={"#FFFFFF"}
            maxWidth={"75rem"}

            sx={{
                border:"3px solid black",
                borderRadius: 7,
                alignItems:"center",
                display:"flex",
                justifyContent:"center",
                margin:"2rem",
            }}
        >

            <Typography variant="h2" fontFamily={"Orelega One"} className="HomeTitle">Home Page</Typography>

        </Box>
    );
}

export default HomeTitle;
