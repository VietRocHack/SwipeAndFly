import { Link, Box } from "@mui/material";
import swipeAndFlyIcon from "../../assets/logo-no-background.svg";

const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        py: 3,
        display: "flex",
        justifyContent: "center",
        zIndex: "1",
        width: "100%",
      }}
    >
      <Link href="/" sx={{ width: "50%", maxWidth: 250 }}>
        <Box
          component="img"
          src={swipeAndFlyIcon}
          alt="Icon"
          sx={{ width: "100%" }}
        />
      </Link>
    </Box>
  );
};

export default Header;
