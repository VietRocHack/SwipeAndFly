import { CssVarsProvider } from "@mui/joy/styles";
import {
  Paper,
  Grid,
  Box,
  FormControlLabel,
  experimental_extendTheme as extendMuiTheme,
  Checkbox,
  Typography,
  IconButton,
  SxProps,
} from "@mui/material";
import { TikTokVideoObject } from "../../../utils/types";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import AspectRatio from "@mui/joy/AspectRatio";
import { extendTheme as extendJoyTheme } from "@mui/joy/styles";
import { deepmerge } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";

interface VideoDisplayProps {
  // the chosen videos, not the videos to be displayed
  videos: Map<string, TikTokVideoObject>;
  // the videos to be displayed
  listVid: TikTokVideoObject[];
  handleDeleteVid?: (index: number, video: TikTokVideoObject) => void;
  handleChangeVid?: (video: TikTokVideoObject) => void;
  orientation: "vertical" | "horizontal";
  videosPerRow?: number;
  minimalSettings?: boolean;
  sx: SxProps | undefined;
}

const joyTheme = extendJoyTheme({
  cssVarPrefix: "mui",
});

const muiTheme = extendMuiTheme();

const theme = deepmerge(joyTheme, muiTheme);

export default function VideoDisplay({
  videos,
  listVid,
  handleDeleteVid,
  handleChangeVid,
  orientation,
  videosPerRow = 4,
  minimalSettings = false,
  sx,
}: VideoDisplayProps) {
  const settingBox = (video: TikTokVideoObject, index: number) => {
    if (minimalSettings) {
      return handleChangeVid ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Checkbox
            checked={videos.has(video.id)}
            onChange={() => {
              handleChangeVid(video);
            }}
            color="primary"
          />
        </Box>
      ) : (
        <></>
      );
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={videos.has(video.id)}
                onChange={() => {
                  if (handleChangeVid) {
                    handleChangeVid(video);
                  }
                }}
              />
            }
            label={
              videos.has(video.id) ? (
                <Typography color="primary">Added!</Typography>
              ) : (
                <Typography>Add to the trip</Typography>
              )
            }
          />
          <IconButton
            color="primary"
            onClick={() => {
              if (handleDeleteVid) {
                handleDeleteVid(index, video);
              }
            }}
            disableRipple={true}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      );
    }
  };

  return (
    <Paper elevation={3} sx={sx}>
      {orientation === "vertical" ? (
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            height: "100%",
            overflowY: "auto",
            padding: 2,
          }}
          // xs={{
          //   margin: 0,
          // }}
        >
          {listVid.length > 0 ? (
            <>
              {listVid.map((video, index) => (
                <Grid
                  padding="0"
                  item
                  xs={Math.floor(12 / videosPerRow)}
                  key={`added-video-${index}`}
                  sx={{ padding: 0 }}
                >
                  {/* Display video using this component */}
                  <CssVarsProvider theme={theme}>
                    <AspectRatio ratio="9/16">
                      <iframe
                        src={`https://www.tiktok.com/player/v1/${video.id}?rel=0&description=1`}
                        height="200"
                        style={{ borderRadius: "inherit" }}
                      />
                    </AspectRatio>
                  </CssVarsProvider>
                  {settingBox(video, index)}
                </Grid>
              ))}
            </>
          ) : (
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                maxWidth: 400,
                margin: "auto",
                padding: 4,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <SlowMotionVideoIcon
                fontSize="inherit"
                color="secondary"
                sx={{ fontSize: 40 }}
              />
              <Typography
                variant="body1"
                sx={{ marginTop: 2 }}
                textAlign="center"
              >
                Add your first TikTok here!
              </Typography>
            </Paper>
          )}
        </Grid>
      ) : listVid.length > 0 ? (
        <Box style={{ display: "flex", overflowX: "auto", gap: 15 }}>
          {listVid.map((video, index) => (
            <Box
              key={video.id}
              sx={{
                minWidth: 100 / videosPerRow + "%",
              }}
            >
              <CssVarsProvider theme={theme}>
                <AspectRatio ratio="9/16">
                  <iframe
                    src={`https://www.tiktok.com/player/v1/${video.id}?rel=0&description=1`}
                    style={{ borderRadius: "inherit" }}
                  />
                </AspectRatio>
              </CssVarsProvider>
              {settingBox(video, index)}
            </Box>
          ))}
        </Box>
      ) : (
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            maxWidth: 400,
            margin: "auto",
            padding: 4,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <SlowMotionVideoIcon
            fontSize="inherit"
            color="secondary"
            sx={{ fontSize: 40 }}
          />
          <Typography variant="body1" sx={{ marginTop: 2 }} textAlign="center">
            Nothing added yet!
          </Typography>
        </Paper>
      )}
    </Paper>
  );
}
