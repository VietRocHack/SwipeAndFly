//import React from 'react'
import {
  CircularProgress,
  LinearProgress,
  Typography,
  Box,
} from "@mui/material";

interface LoadingComponentProps {
  caption: string;
}

const LoadingComponent = ({ caption }: LoadingComponentProps) => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <CircularProgress
        sx={{
          color: "primary", // Set color to red
          thickness: 5, // Increase thickness (default is 4)
        }}
      />
      <LinearProgress
        sx={{
          width: "100%",
          height: 2,
          backgroundColor: "secondary",
          marginTop: 2,
        }}
      />
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        {caption}
      </Typography>
    </Box>
  );
};

export default LoadingComponent;
