import { Typography, Link, Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        textAlign: "center",
        borderTop: "1px solid #ddd",
        width: "100vw",
        zIndex: "1",
      }}
    >
      <Typography variant="body1">
        <Link href="/privacy-policy" color="inherit" underline="hover">
          Privacy Policy
        </Link>
        {" | "}
        <Link href="/terms-and-conditions" color="inherit" underline="hover">
          Terms and Conditions
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        &copy; {new Date().getFullYear()} VietRocHack. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
