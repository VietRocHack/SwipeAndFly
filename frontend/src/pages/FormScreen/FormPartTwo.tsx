// import React from "react";
import { Box } from "@mui/material";
import { Dispatch } from "react";
import { TikTokVideoObject } from "../../utils/types";
import VideoSelector from "../../components/VideoSelector/VideoSelector";

interface FormPartTwoProps {
  location: string;
  videos: Map<string, TikTokVideoObject>;
  setVideos: Dispatch<React.SetStateAction<Map<string, TikTokVideoObject>>>;
}

export default function FormPartTwo({
  location,
  videos,
  setVideos,
}: FormPartTwoProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <VideoSelector
        location={location}
        videos={videos}
        setVideos={setVideos}
      />
    </Box>
  );
}
