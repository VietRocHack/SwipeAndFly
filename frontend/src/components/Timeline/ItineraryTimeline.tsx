import { Itinerary } from "../../utils/types";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TextSquare from "./TextSquare";
import { Typography } from "@mui/material";
import TimelineActivity from "./TimelineActivity";

interface ItineraryTimelineProps {
  itinerary: Itinerary;
}

function fixTime(time: string){
  if(time.length == 5) return time
  return "0" + time
}

export default function ItineraryTimeline({
  itinerary,
}: ItineraryTimelineProps) {
  console.log(itinerary);

  const timelineList = itinerary.activities.map((activity) => (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{
          width: "80px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "0.5rem"
        }}
        align="right"
        variant="body2"
        color="text.secondary"
      >
        <Typography>{fixTime(activity.startTime)}</Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot variant="outlined">
          <TextSquare size="1.4rem" fontSize="1.2rem">
            {activity.id}
          </TextSquare>
        </TimelineDot>
        {activity.id != itinerary.activities.length && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <TimelineActivity activity={activity} width="60vw"/>
      </TimelineContent>
    </TimelineItem>
  ));
  return (
    <>
      <Timeline>{timelineList}</Timeline>
    </>
  );
}
