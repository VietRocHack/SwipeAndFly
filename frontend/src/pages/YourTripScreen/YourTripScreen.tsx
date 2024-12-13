import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Itinerary } from "../../utils/types";
import ItineraryTimeline from "../../components/Timeline/ItineraryTimeline";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import { useTheme } from "@mui/material/styles";
// import PrintIcon from "@mui/icons-material/Print";
import ActionButtons from "./ActionButtons";
import LoadingComponent from "../../components/Loading/LoadingComponent";

// TRUE IN PRODUCTION!!!
const USE_API = true;

interface FetchResult {
  itinerary: string;
  prompt: string;
}

export default function YourTripScreen() {
  const { uuid } = useParams();
  let itinerary: Itinerary | null = null;
  const [data, setData] = useState<FetchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // useEffect for API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (USE_API) {
          const response = await axios.get<FetchResult>(
            `/api/itinerary/get_itinerary?uuid=${uuid}&fields=itinerary,prompt`
            // `http://127.0.0.1:8080/get_itinerary?uuid=${uuid}&fields=itinerary`
            // `http://127.0.0.1:8080`
          );
          console.log(response.data)
          // await setTimeout()
          setData(response.data);
        }
      } catch (err: unknown) {
        const error = err as AxiosError;
        console.log(error.response?.data as string);
        setError("something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  // TODO: add loading screen and error screen
  if (loading) {
    return (
      <Box sx={{ alignSelf: "center", pt: "35vh" }}>
        <LoadingComponent caption="Getting your Trip Information..." />
      </Box>
    );
  }

  if (error) {
    return <>Error: {error}</>;
  }

  itinerary = JSON.parse(data?.itinerary as string);

  // i hate nullables but they are a necessary evil
  const itineraryNotNull = itinerary as Itinerary;

  // add an id to each itinerary for React
  for (let i = 0; i < itineraryNotNull.activities.length; ++i) {
    itineraryNotNull.activities[i].id = i + 1;
  }

  const activityCount = itineraryNotNull.activities.length;
  return (
    <>
      <Grid container spacing={1} sx={{ mt: 2, p: 2 }}>
        <Grid item xs={0} md={1} />
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ fontWeight: "600" }}>
            Here's what we've planned.
          </Typography>

          <Typography variant="h3" sx={{ fontWeight: "500" }}>
            <ExploreIcon fontSize="large" />
            {` ${itineraryNotNull.trip_location ?? ""}`}
          </Typography>

          <Typography sx={{ color: "text.secondary" }}>
            {`${itineraryNotNull.activities[0].startTime} - ${
              itineraryNotNull.activities[activityCount - 1].endTime
            }, ${activityCount} activities`}
          </Typography>
        </Grid>
        {!isMobile && <ActionButtons />}
        <Grid item xs={0} md={1} />
        {isMobile && <ActionButtons />}
        <Grid item xs={0} md={1} />
        <Grid item xs={12} md={10}>
          <hr style={{ alignSelf: "left", color: "white" }} />
        </Grid>
        <Grid item xs={0} md={1} />
      </Grid>
      <ItineraryTimeline itinerary={itinerary as Itinerary} />
    </>
  );
}
