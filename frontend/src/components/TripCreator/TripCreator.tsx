import { ActivityTag, PlaceType, TripInfo } from "../../utils/types";
import {
  Box,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { Dispatch } from "react";
import GoogleMapsCitySearch from "./GoogleMapsCitySearch/GoogleMapsCitySearch";

interface TripCreatorProps {
  tripInfo: TripInfo;
  setTripInfo: Dispatch<React.SetStateAction<TripInfo>>;
}

export default function TripCreator({
  tripInfo,
  setTripInfo,
}: TripCreatorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLocationChange = (location: PlaceType | null) => {
    setTripInfo((prev) => {
      return { ...prev, location: location };
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleActivityChange = (event: any) => {
    setTripInfo((prev) => {
      return {
        ...prev,
        activityTags: event.target.value,
      };
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStartTimeChange = (event: any) => {
    setTripInfo((prev) => {
      return {
        ...prev,
        startTime: event.target.value,
      };
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEndTimeChange = (event: any) => {
    setTripInfo((prev) => {
      return {
        ...prev,
        endTime: event.target.value,
      };
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCommentsChange = (event: any) => {
    setTripInfo((prev) => {
      return {
        ...prev,
        comments: event.target.value,
      };
    });
  };

  return (
    <Paper
      sx={{
        flexGrow: 1,
        padding: 2,
        maxWidth: 1000,
        backgroundColor: "rgba(40,40,43, 0.2) !important",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ marginBottom: 3 }}
        fontWeight={"bold"}
      >
        Where are your next destination?
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <GoogleMapsCitySearch
            handleLocationChange={handleLocationChange}
            location={tripInfo.location}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            id="start-time"
            label="Start Time"
            type="time"
            value={tripInfo.startTime}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }} // 5 min
            fullWidth
            onChange={handleStartTimeChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            id="end-time"
            label="End Time"
            type="time"
            value={tripInfo.endTime}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }} // 5 min
            fullWidth
            onChange={handleEndTimeChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="activity-label">Activity</InputLabel>
            <Select
              labelId="activity-label"
              id="activity"
              multiple
              value={tripInfo.activityTags}
              onChange={handleActivityChange}
              renderValue={(selected) => (
                <Box sx={{ textOverflow: "ellipsis", width: 50 }}>
                  {selected.join(", ")}
                </Box>
              )}
              label="Activity"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "30%", // Adjust the max height of the dropdown
                  },
                },
              }}
            >
              {Object.values(ActivityTag)
                .sort()
                .map((activity) => (
                  <MenuItem key={activity} value={activity}>
                    <Checkbox
                      checked={tripInfo.activityTags.includes(activity)}
                    />
                    <ListItemText primary={activity} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="special-notes"
            label="Special Notes"
            variant="outlined"
            placeholder="E.g., Allergies, accessibility needs, travelling with children, or other preferences"
            multiline
            rows={4}
            fullWidth
            onChange={handleCommentsChange}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
