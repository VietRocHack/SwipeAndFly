import {
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ChangeEvent, Dispatch, FormEvent, useEffect, useState } from "react";
import { checkTikTokUrl, cleanTikTokVideoURL } from "../../utils/utils";
import { TikTokVideoObject } from "../../utils/types";
import { Send } from "@mui/icons-material"; // Import icon for button
import VideoDisplay from "./VideoDisplay/VideoDisplay";
import { darkTheme } from "../../utils/themes";
interface VideoSelectorProps {
  videos: Map<string, TikTokVideoObject>;
  setVideos: Dispatch<React.SetStateAction<Map<string, TikTokVideoObject>>>;
}

/**
 * Return a Stepper with multiple different ReactNodes as its steps
 */
export default function VideoSelector({
  videos,
  setVideos,
}: VideoSelectorProps) {
  const isMobile = useMediaQuery(darkTheme.breakpoints.down("sm"));
  const [vid, setVid] = useState<string>("");
  const [listVid, setListVid] = useState<TikTokVideoObject[]>(
    JSON.parse(localStorage.getItem("listVid") ?? "[]")
  );
  const [vidIds, setVidIds] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem("vidIds") ?? "[]"))
  );
  const [addingVid, setAddingVid] = useState<boolean>(false);
  const [urlErrorMsg, setUrlErrorMsg] = useState<string>("");
  const [justAddedVid, setJustAddedVid] = useState<string>("");
  const [shake, setShake] = useState<boolean>(false);

  const handleShake = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 500); // Reset shake after animation duration
  };

  useEffect(() => {
    // update videos here too
    setVideos((prev) => {
      const newVideos = new Map<string, TikTokVideoObject>();
      prev.forEach((videoObj) => {
        if (vidIds.has(videoObj.id)) {
          newVideos.set(videoObj.id, videoObj);
        }
      });
      return newVideos;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("listVid", JSON.stringify(listVid));
  }, [listVid]);

  useEffect(() => {
    localStorage.setItem("vidIds", JSON.stringify([...vidIds]));
  }, [vidIds]);

  const handleVid = (event: ChangeEvent<HTMLInputElement>) => {
    setVid(event.target.value);
  };

  const alertError = (errorMsg: string) => {
    handleShake();
    setUrlErrorMsg(errorMsg);
  };

  /**
   * Chạy khi click upload button
   */
  const handleAddVid = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUrlErrorMsg("");
    setAddingVid(true);
    if (vid.length === 0) {
      alert("Empty");
      setAddingVid(false);
      return;
    }
    const input = vid;
    console.log("cleaning vid");

    const extractedVid = cleanTikTokVideoURL(input);
    console.log("cleaning vid done");

    if (typeof extractedVid === "string") {
      setAddingVid(false);
      alertError("The given URL is not valid");
    } else if (vidIds.has(extractedVid.id)) {
      setAddingVid(false);
      alertError("You already have this video in your library");
    } else {
      const isExist = await checkTikTokUrl(extractedVid.url);

      if (!isExist) {
        setAddingVid(false);
        alertError("This TikTok video does not exist");
        return;
      }

      setListVid([...listVid, extractedVid]);
      setVidIds((prev) => {
        const newVidIds = new Set(prev);
        newVidIds.add(extractedVid.id);
        return newVidIds;
      });
      setJustAddedVid(extractedVid.url);
      setVid("");
    }
    setAddingVid(false);
  };

  const handleDeleteVid = (index: number, video: TikTokVideoObject) => {
    setListVid((prevListVid) => prevListVid.filter((_, i) => i !== index));
    setVidIds((prev) => {
      const newVidIds = new Set(prev);
      newVidIds.delete(video.id);
      return newVidIds;
    });
    setVideos((prev) => {
      const newVideos = new Map(prev);
      newVideos.delete(video.id);
      return newVideos;
    });
  };

  const handleChangeVid = (video: TikTokVideoObject) => {
    if (videos.has(video.id)) {
      setVideos((prev) => {
        const newVideos = new Map(prev);
        newVideos.delete(video.id);
        return newVideos;
      });
    } else {
      setVideos((prev) => {
        const newVideos = new Map(prev);
        newVideos.set(video.id, video);
        return newVideos;
      });
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        borderRadius: 2,
        width: "100%",
        // background: "#28282B",
        maxWidth: 1000,
        backgroundColor: "rgba(40,40,43, 0.2) !important",
      }}
    >
      <Typography variant="h4" fontWeight={"bold"} gutterBottom>
        Customize your trip with your TikTok videos
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Here you can add your TikTok videos and choose them to be put into your
        trip.
      </Typography>

      <Grid
        container
        spacing={2}
        component="form"
        onSubmit={handleAddVid}
        sx={{ mb: 3 }}
      >
        <Grid item xs={11}>
          <TextField
            id="video_url"
            placeholder="https://www.tiktok.com/@drinklinknyc/video/7374836750948076846"
            label="Your favorite TikTok review video URL"
            variant="outlined"
            fullWidth
            required
            value={vid}
            onChange={handleVid}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            size={isMobile ? "medium" : "large"}
            // sx={{ ...(isMobile && { display: "inline-block" }) }}
            disabled={addingVid}
            color="primary"
            type="submit"
          >
            {addingVid ? <CircularProgress /> : <Send />}
          </IconButton>
        </Grid>
        {urlErrorMsg && (
          <Grid item xs={12}>
            <Alert
              severity="error"
              variant="outlined"
              sx={{ animation: shake ? "shake 0.5s" : "none" }}
            >
              {urlErrorMsg}
            </Alert>
          </Grid>
        )}
        {justAddedVid && (
          <Grid item xs={12}>
            <Alert severity="success" variant="outlined">
              Successfully added: {justAddedVid}
            </Alert>
          </Grid>
        )}
      </Grid>

      <Typography variant="h6" gutterBottom>
        Currently selected {videos.size} out of {listVid.length} video
        {listVid.length > 1 ? "s" : ""}.
      </Typography>

      <VideoDisplay
        listVid={[...videos.values()]}
        videos={videos}
        handleChangeVid={handleChangeVid}
        handleDeleteVid={handleDeleteVid}
        orientation="horizontal"
        sx={{
          padding: 3,
          borderRadius: 2,
          marginTop: 3,
          width: "100%",
          // background: "#131314",
          marginBottom: 8,
          backgroundColor: "rgba(19,19,20, 0.2) !important",
        }}
        videosPerRow={isMobile ? 2 : 5}
        minimalSettings
      />

      <Typography
        variant="h5"
        fontWeight={"bold"}
        gutterBottom
        sx={{ marginBottom: 4 }}
      >
        Your added TikTok videos
      </Typography>

      <VideoDisplay
        listVid={listVid}
        videos={videos}
        handleChangeVid={handleChangeVid}
        handleDeleteVid={handleDeleteVid}
        orientation="vertical"
        sx={{
          padding: 3,
          borderRadius: 2,
          width: "100%",
          // background: "#131314",
          maxWidth: 1000,
          height: 750,
          backgroundColor: "rgba(19,19,20, 0.2) !important",
        }}
        videosPerRow={isMobile ? 1 : 4}
      />
    </Paper>
  );
}
