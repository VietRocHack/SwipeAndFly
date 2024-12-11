//import React from 'react'
import { CircularProgress, LinearProgress, Typography, Box } from '@mui/material'

const LoadingScreen = () => {
  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress 
            sx={{
              color: 'red', // Set color to red
              thickness: 5, // Increase thickness (default is 4)
            }}
          />
          <LinearProgress sx={{ width: '100%', height: 2, backgroundColor: 'lightblue', marginTop: 2 }} />
          <Typography variant="h6" sx={{ marginTop: 2 }}>TURNING TIKTOK INTO YOUR DREAM VACATION...</Typography>
      </Box>
  )
}

export default LoadingScreen