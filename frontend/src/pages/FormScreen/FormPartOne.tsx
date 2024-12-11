// import React from "react";
import { Box } from "@mui/material";
import { TripInfo } from "../../utils/types";
import { Dispatch } from "react";
import TripCreator from "../../components/TripCreator/TripCreator";
interface FormPartOneProps {
  tripInfo: TripInfo;
  setTripInfo: Dispatch<React.SetStateAction<TripInfo>>;
}

export default function FormPartOne({
  tripInfo,
  setTripInfo,
}: FormPartOneProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <TripCreator tripInfo={tripInfo} setTripInfo={setTripInfo} />
    </Box>
  );
}
