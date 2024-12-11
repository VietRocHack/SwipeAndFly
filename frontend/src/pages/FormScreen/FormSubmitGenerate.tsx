// import React from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { TikTokVideoObject, TripInfo } from "../../utils/types";
import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { preparePrompt, prepareTikTokUrls } from "../../utils/utils";

interface FormSubmitGenerateProps {
  tripInfo: TripInfo;
  videos: Map<string, TikTokVideoObject>;
}

export default function FormSubmitGenerate({
  videos,
  tripInfo,
}: FormSubmitGenerateProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusList, setStatusList] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setStatusList([
      "processing your request",
      `wow, you're going to ${tripInfo.location}`,
      "analyzing your tiktoks",
      "googlin- i mean doing some magic",
      "great choice of videos, btw",
      "crafting the best place for ya",
      "bored, yet? dw, almost there",
    ]);
  }, [tripInfo.location]);

  const handleSubmit = async () => {
    setLoading(true);
    let progressValue = 0;

    const interval = setInterval(() => {
      progressValue += 1;
      setProgress(progressValue);
      if (progressValue == 90) {
        clearInterval(interval);
      }
    }, 300); // 99% in 30 seconds = 300ms interval

    try {
      const response = await fetch(
        `https://spvzn3tnm0.execute-api.us-east-1.amazonaws.com/generate_itinerary?` +
          `prompt=${encodeURIComponent(preparePrompt(tripInfo))}` +
          `&video_urls=${prepareTikTokUrls(videos)}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        const result = await response.text();
        navigate(`/your-trip/${result}`);
      } else {
        alert("error");
        console.error(
          "Failed to fetch data. Response status:",
          response.status
        );
      }
    } catch (error) {
      console.log("ERROR: " + error);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setProgress(0);
    }
  };
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 400,
        textAlign: "center",
      }}
    >
      {!loading && (
        <>
          <IconButton
            sx={{ fontSize: "3rem" }}
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            <SendIcon sx={{ width: 200, height: 200 }} />
          </IconButton>
          <Typography variant="h6" sx={{ marginTop: "10px" }}>
            Ready? Swipe And Fly!
          </Typography>
        </>
      )}
      {loading && (
        <>
          <CircularProgress color="secondary" sx={{ marginBottom: 6 }} />
          <Box
            sx={{
              width: "80%",
              height: 30,
              backgroundColor: "f3f3f3",
              borderRadius: "5px",
              overflow: "hidden",
              border: "solid 2px",
            }}
          >
            {statusList[Math.floor(progress / (100 / statusList.length))]}
            <Box
              sx={{
                height: "100%",
                marginTop: -3,
                backgroundColor: "#FE2858",
                width: `${progress}%`,
                transition: "width 0.3s ease-in-out",
              }}
            ></Box>
          </Box>
        </>
      )}
    </Paper>
  );
}
