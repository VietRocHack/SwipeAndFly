// import React from "react";
import { Box } from "@mui/material";
import { Dispatch } from "react";
import { TikTokVideoObject } from "../../utils/types";
import VideoSelector from "../../components/VideoSelector/VideoSelector";

interface FormPartTwoProps {
  videos: Map<string, TikTokVideoObject>;
  setVideos: Dispatch<React.SetStateAction<Map<string, TikTokVideoObject>>>;
}

export default function FormPartTwo({ videos, setVideos }: FormPartTwoProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <VideoSelector videos={videos} setVideos={setVideos} />
    </Box>
  );
}
