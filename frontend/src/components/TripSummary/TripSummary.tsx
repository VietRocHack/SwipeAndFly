import { TikTokVideoObject, TripInfo } from "../../utils/types";
import { Grid, Paper, Typography, useMediaQuery } from "@mui/material";
import { convertTo12HourFormat } from "../../utils/utils";
import VideoDisplay from "../VideoSelector/VideoDisplay/VideoDisplay";
import { darkTheme } from "../../utils/themes";

interface TripSummaryProps {
  videos: Map<string, TikTokVideoObject>;
  tripInfo: TripInfo;
}

export default function TripSummary({ videos, tripInfo }: TripSummaryProps) {
  const isMobile = useMediaQuery(darkTheme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        borderRadius: 2,
        width: "100%",
        maxWidth: 1000,
        backgroundColor: "rgba(40,40,43, 0.2) !important",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Here's your trip summary
      </Typography>
      <Grid container>
        <Grid container item spacing={2} xs={12} md={6}>
          <Grid item xs={12}>
            <Typography variant="h6">I'll be going to</Typography>
            <Typography variant="h4" fontWeight="bold">
              {tripInfo.location ? tripInfo.location : "Anywhere, lol"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">My day starts at</Typography>
            <Typography variant="h4" fontWeight="bold">
              {convertTo12HourFormat(tripInfo.startTime)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">...and ends at</Typography>
            <Typography variant="h4" fontWeight="bold">
              {convertTo12HourFormat(tripInfo.endTime)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">My vibes are</Typography>
            <Typography variant="h5" fontWeight="bold">
              {tripInfo.activityTags.length > 0
                ? tripInfo.activityTags.join(", ")
                : "Anything!"}
            </Typography>
          </Grid>
          {tripInfo.comments !== "" && (
            <Grid item xs={12}>
              <Typography variant="h6">Special Notes</Typography>
              <Typography variant="h5">{tripInfo.comments}</Typography>
            </Grid>
          )}
          {isMobile && (
            <Grid item xs={12}>
              <Typography variant="h6">
                I want to do stuff in these TikToks
              </Typography>
              <Typography variant="body1">(swipe right to see more)</Typography>

              <VideoDisplay
                listVid={[...videos.values()]}
                videos={videos}
                orientation="horizontal"
                sx={{
                  padding: 3,
                  borderRadius: 2,
                  marginTop: 3,
                  width: "100%",
                  // background: "#131314",
                  marginBottom: 3,
                  backgroundColor: "rgba(19, 19, 20, 0.2) !important",
                }}
                videosPerRow={1}
                minimalSettings
              />
            </Grid>
          )}
        </Grid>
        <Grid container item spacing={2} xs={0} md={6}>
          {!isMobile && (
            <Grid item xs={12}>
              <Typography variant="h6">
                I want to do stuff in these TikToks
              </Typography>
              <Typography variant="body1">(scroll down to see more)</Typography>

              <VideoDisplay
                listVid={[...videos.values()]}
                videos={videos}
                orientation="vertical"
                sx={{
                  padding: 3,
                  borderRadius: 2,
                  marginTop: 3,
                  width: "100%",
                  // background: "#131314",
                  height: "30vh",
                  maxHeight: 400,
                  marginBottom: 2,
                  backgroundColor: "rgba(19, 19, 20, 0.2) !important",
                }}
                videosPerRow={2}
                minimalSettings
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
