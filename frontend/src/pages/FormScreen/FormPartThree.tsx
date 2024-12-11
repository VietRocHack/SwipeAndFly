// import React from "react";
import { Box } from "@mui/material";
import { TikTokVideoObject, TripInfo } from "../../utils/types";
import TripSummary from "../../components/TripSummary/TripSummary";

interface FormPartThreeProps {
  videos: Map<string, TikTokVideoObject>;
  tripInfo: TripInfo;
}

export default function FormPartTwo({ videos, tripInfo }: FormPartThreeProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <TripSummary videos={videos} tripInfo={tripInfo} />
    </Box>
  );
}
