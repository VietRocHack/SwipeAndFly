import { Button, Grid } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { useNavigate } from "react-router-dom";

export default function ActionButtons() {
  const navigate = useNavigate();

  return (
    <Grid
      item
      md={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <Button
        variant="outlined"
        size="small"
        sx={{ alignSelf: "flex-start", my: 1 }}
        onClick={() => {
          window.print();
        }}
      >
        <PrintIcon sx={{ mr: "0.25rem" }} /> {" Print itinerary"}
      </Button>
      <Button
        variant="outlined"
        size="small"
        color="secondary"
        sx={{ alignSelf: "flex-start", my: 1 }}
        onClick={() => {
          navigate("../create-trip")
        }}
      >
        <TravelExploreIcon sx={{ mr: "0.25rem" }} /> {" Generate another trip"}
      </Button>
    </Grid>
  );
}
