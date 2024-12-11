import React from "react";
import { Box, Typography } from "@mui/material";

interface CatchphraseProps {
  fontSizeMobile?: string;
  fontSizeDesktop?: string;
}

const Catchphrase: React.FC = ({
  fontSizeMobile = "2.8rem",
  fontSizeDesktop = "3rem",
}: CatchphraseProps) => {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          marginBottom: 4,
          backgroundColor: "primary",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            top: "1.5px",
            left: "1.5px",
            wordWrap: "break-word",
            color: "white",
            fontSize: {
              xs: fontSizeMobile,
              sm: fontSizeMobile,
              md: fontSizeDesktop,
              lg: fontSizeDesktop,
              xl: fontSizeDesktop,
              filter:
                "drop-shadow(2px 0px 0px #FD3E3E) drop-shadow(-2px -2px 0px #4DE8F4)",
            },
          }}
        >
          Discover your perfect getaway.
        </Typography>
      </Box>
    </>
  );
};

export default Catchphrase;
