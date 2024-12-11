// import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { TikTokVideoObject, TripInfo } from "../../utils/types";
import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { preparePrompt, prepareTikTokUrls } from "../../utils/utils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { TaskAlt } from "@mui/icons-material";

const MAX_RETRIES = 5;

interface FormSubmitGenerateProps {
  tripInfo: TripInfo;
  videos: Map<string, TikTokVideoObject>;
}

enum SubmitState {
  awaiting,
  loading,
  finished,
}

export default function FormSubmitGenerate({
  videos,
  tripInfo,
}: FormSubmitGenerateProps) {
  const [curState, setCurState] = useState<SubmitState>(SubmitState.awaiting);
  const [progress, setProgress] = useState(0);
  const [statusList, setStatusList] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [tripId, setTripId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setStatusList([
      "processing your request",
      `wow, you're going to ${tripInfo.location!.description}`,
      "analyzing your tiktoks",
      "googlin- i mean doing some magic",
      "great choice of videos, btw",
      "crafting the best place for ya",
      "bored, yet? dw, almost there",
    ]);
  }, [tripInfo.location]);

  const handleSubmit = async () => {
    setErrorMsg("");
    setCurState(SubmitState.loading);
    let progressValue = 0;

    const interval = setInterval(() => {
      progressValue += 1;
      setProgress(progressValue);
      if (progressValue == 90) {
        clearInterval(interval);
      }
    }, 300); // 99% in 30 seconds = 300ms interval

    let requestedTripId = null;
    let retry = 0;

    while (!requestedTripId && retry < MAX_RETRIES) {
      // wait sometimes before requesting a new one
      retry += 1;
      await new Promise((f) => setTimeout(f, 5000));
      requestedTripId = await fetchData();
    }
    if (requestedTripId == null) {
      setCurState(SubmitState.awaiting);
      clearInterval(interval);
      setProgress(0);
      setErrorMsg("Oops, our server is down 💀 Please try again later!");
      return;
    }

    setTripId(requestedTripId);
    clearInterval(interval);
    setProgress(100);

    setTimeout(() => {
      setCurState(SubmitState.finished);
      setProgress(0);
      setTimeout(() => {
        handleProceed(requestedTripId);
      }, 6000);
    }, 2000);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://spvzn3tnm0.execute-api.us-east-1.amazonaws.com/generate_itinerary?` +
          `&prompt=${encodeURIComponent(preparePrompt(tripInfo))}` +
          `&location=${encodeURIComponent(tripInfo.location!.description)}` +
          `&startTime=${encodeURIComponent(tripInfo.startTime)}` +
          `&endTime=${encodeURIComponent(tripInfo.endTime)}` +
          `&activityTags=${encodeURIComponent(
            tripInfo.activityTags.join(",")
          )}` +
          `&comments=${encodeURIComponent(tripInfo.comments)}` +
          `&video_urls=${prepareTikTokUrls(videos)}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        const result = await response.text();
        return result;
      } else {
        alert("error");
        console.error(
          "Failed to fetch data. Response status:",
          response.status
        );
        console.log("An error has happened, retrying...");
        return null;
      }
    } catch (error) {
      console.log("ERROR: " + error);
      console.log("An error has happened, retrying...");
      return null;
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`https://swipeandfly.world/your-trip/${tripId}`)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  const handleProceed = (tripId: string) => {
    console.log(tripId);
    if (tripId) {
      navigate(`/your-trip/${tripId}`);
    } else {
      alert("No trip id is here yet!");
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
        backgroundColor: "rgba(40,40,43, 0.2) !important",
      }}
    >
      {errorMsg && (
        <Alert
          severity="error"
          variant="outlined"
          sx={{
            mx: 5,
            mt: 3,
            width: "80%",
            animation: "shake 0.5s",
          }}
        >
          {errorMsg}
        </Alert>
      )}

      {curState == SubmitState.awaiting && (
        <>
          <IconButton
            sx={{ fontSize: "3rem" }}
            color="primary"
            onClick={handleSubmit}
            disabled={curState != SubmitState.awaiting}
          >
            <SendIcon sx={{ width: 200, height: 200 }} />
          </IconButton>
          <Typography variant="h6" sx={{ marginTop: "10px" }}>
            Ready? Swipe And Fly!
          </Typography>
        </>
      )}
      {curState == SubmitState.loading && (
        <>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              maxWidth: 100,
              maxHeight: 100,
              fontSize: 60,
              mb: 3,
            }}
          >
            {progress === 100 ? (
              <TaskAlt color="secondary" fontSize="inherit" />
            ) : (
              <CircularProgress color="secondary" size={50} />
            )}
          </Box>
          <Box
            sx={{
              width: "80%",
              maxWidth: 700,
              height: 30,
              backgroundColor: "f3f3f3",
              borderRadius: "5px",
              overflow: "hidden",
              border: "solid 2px",
            }}
          >
            {progress === 100
              ? "done!"
              : statusList[Math.floor(progress / (100 / statusList.length))]}
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
      {curState == SubmitState.finished && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ width: "80%" }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Your Trip to{" "}
            {(tripInfo.location!.terms as { value: string }[])[0].value} is
            Ready!
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Wait a moment while we take you to your trip...
          </Typography>
          <Button variant="contained" sx={{ mb: 3 }}>
            See your trip
          </Button>
          <Typography
            variant="body1"
            color="textSecondary"
            mt={2}
            sx={{ textAlign: "center" }}
          >
            Share this link with your friends to let them view your trip
            details.
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            mt={2}
            sx={{ width: "100%", maxWidth: 450 }}
          >
            <TextField
              value={`swipeandfly.world/your-trip/${tripId}`}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
              <IconButton onClick={handleCopy} sx={{ marginLeft: 1 }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
