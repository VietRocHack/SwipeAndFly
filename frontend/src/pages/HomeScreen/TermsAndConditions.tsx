import React from "react";
import { Link, Typography } from "@mui/material";

const TermsAndConditionsTextLine: React.FC = () => {
  return (
    <Typography
      variant="body2"
      paragraph
      sx={{
        bottom: 0,
        left: 0,
        width: "100%",
        textAlign: "left",
        marginBottom: 2,
        color: "white",
      }}
    >
      By using our website, you agree to our{" "}
      <Link href="/privacy-policy" color="primary" underline="hover">
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link href="/terms-and-conditions" color="primary" underline="hover">
        Terms and Conditions
      </Link>
      .
    </Typography>
  );
};

export default TermsAndConditionsTextLine;
