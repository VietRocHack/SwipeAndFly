import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Itinerary } from "../../utils/types";
import ItineraryTimeline from "../../components/Timeline/ItineraryTimeline";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import { useTheme } from "@mui/material/styles";
// import PrintIcon from "@mui/icons-material/Print";
import ActionButtons from "./ActionButtons";
import LoadingComponent from "../../components/Loading/LoadingComponent";

// TRUE IN PRODUCTION!!!
const USE_API = true;

interface FetchResult {
  itinerary: string;
  prompt: string;
}

const dummyData: Itinerary = {
  activities: [
    {
      startTime: "7:00",
      endTime: "9:00",
      activity: "Breakfast",
      location: "Place",
      inspiredBy: {
        explanation: "Explanation",
        video_url:
          "https://www.tiktok.com/@nguoingonanngon/video/7263440866734296321",
      },
    },
    {
      startTime: "10:00",
      endTime: "12:00",
      activity: "Go",
      location: "Place",
      inspiredBy: null,
    },
    {
      startTime: "12:30",
      endTime: "13:30",
      activity: "Breakfast",
      location: "Place",
      inspiredBy: {
        explanation: "Explanation",
        video_url:
          "https://www.tiktok.com/@nguoingonanngon/video/7263440866734296321",
      },
    },
  ],
};

const dummyPrompt =
  "Create an one-day travel plan\n - Location: Ha Noi, Vietnam  \n - Start time: 7:00\n - End time: 22:00\n - Activities: Visit historical places and local food\n\nThe user have also specified a list of videos, these are the video summaries:\n\n[{'content': \"The content of this TikTok video is a review of a soursop-themed restaurant. The creator talks about the variety of soursop dishes available at the restaurant, including soursop desserts and drinks. They mention the quality of the ingredients used, such as fresh soursop and homemade toppings. The creator expresses their enjoyment of the soursop dishes, particularly the soursop ice cream with soursop fruit. They also mention a unique soursop drink called 'cốm say cốt dừa sầu.' Overall, the creator recommends the restaurant for soursop lovers due to its extensive menu of soursop-based dishes and drinks.\", 'location': '13 Ô Quan Chương, Hoàn Kiếm, Vietnam', 'video_url': 'https://www.tiktok.com/@bachuareview/video/7386513785063886087'}, {'content': 'The TikTok video is a food review set in Hanoi, showcasing various dishes the creator enjoys during rainy days. The video highlights a grilled meat dish, tofu in a clay pot, and other appetizing street food. The reactions suggest excitement and satisfaction, creating a positive and inviting sentiment. The visuals emphasize communal dining and enjoying delicious, comforting food.', 'location': 'Hanoi, Vietnam', 'video_url': 'https://www.tiktok.com/@nguoingonanngon/video/7263440866734296321'}, {'content': \"The TikTok video provides a detailed description of various delicious and unique food dishes in Hanoi, Vietnam, including Bun, Xich Nature noodles, Mrs. Thang's noodles, and Riệu noodles. The video showcases the blend of colors and flavors in the dishes, as well as the special ingredients and preparation methods that make each dish unique and appealing to diners. The narrator expresses a desire to try all the mentioned dishes and encourages viewers to share other dishes they think are worth trying when visiting Hanoi.\", 'location': 'Hanoi, Vietnam', 'video_url': 'https://www.tiktok.com/@2tripreview/video/7256057915394624776'}, {'content': 'The TikTok video shows a food tour in Hanoi, Vietnam, where the content creator is trying out different dishes and sharing their thoughts. They express excitement and enjoyment for the food, but also mention that they ordered too much and may not be able to finish it all due to limited time in Hanoi. The creator also mentions a specific dish they planned to try but had to prioritize eating as much as possible. Overall, the sentiment is positive and food-focused, with a sense of adventure and exploration.', 'location': 'Hanoi, Vietnam', 'video_url': 'https://www.tiktok.com/@choitiptopparttime/video/7386322226473192712'}, {'content': 'The TikTok video showcases a food tour in Hanoi, featuring different local dishes. The first image shows a large pot of cooking food, possibly a traditional dish, generating a warm and inviting feeling. The second image captures a person enjoying a frozen treat in what looks like a casual street setting, giving a sense of vibrance and city life. The third image shows grilled meat and sausage at a food stall, highlighting the street food culture and excitement of trying different flavors.', 'location': 'Hanoi, Vietnam', 'video_url': 'https://www.tiktok.com/@vimaay/video/7164307699767708955'}]";

// ChatGPT is the best at mundane string extraction
function extractLocationString(input: string) {
  // Define the search term
  const searchTerm = "Location: ";

  // Find the start index of the search term
  const startIndex = input.indexOf(searchTerm);

  // If the search term is not found, return an empty string
  if (startIndex === -1) {
    return "";
  }

  // Calculate the start index of the actual location substring
  const locationStartIndex = startIndex + searchTerm.length;

  // Find the index of the next newline character after the search term
  const endIndex = input.indexOf(" \n", locationStartIndex);

  // If no newline character is found, extract until the end of the string
  if (endIndex === -1) {
    return input.substring(locationStartIndex);
  }

  // Extract the substring between the start and end indices
  return input.substring(locationStartIndex, endIndex);
}

export default function YourTripScreen() {
  const { uuid } = useParams();
  let itinerary: Itinerary | null = null;
  const [data, setData] = useState<FetchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // useEffect for API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (USE_API) {
          const response = await axios.get<FetchResult>(
            `https://sj503gxhq9.execute-api.us-east-1.amazonaws.com/get_itinerary?uuid=${uuid}&fields=itinerary,prompt`
            // `http://127.0.0.1:8080/get_itinerary?uuid=${uuid}&fields=itinerary`
            // `http://127.0.0.1:8080`
          );
          
          // await setTimeout()
          setData(response.data);
        }
      } catch (err: unknown) {
        const error = err as AxiosError;
        console.log(error.response?.data as string);
        setError("something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  // TODO: add loading screen and error screen
  if (loading) {
    return (
      <Box sx={{alignSelf: "center", pt: "35vh"}}>
        <LoadingComponent caption="Getting your Trip Information..." />
      </Box>
    );
  }

  if (error) {
    return <>Error: {error}</>;
  }

  if (USE_API) itinerary = JSON.parse(data?.itinerary as string);
  else itinerary = dummyData;

  // i hate nullables but they are a necessary evil
  const itineraryNotNull = itinerary as Itinerary;

  // add an id to each itinerary for React
  for (let i = 0; i < itineraryNotNull.activities.length; ++i) {
    itineraryNotNull.activities[i].id = i + 1;
  }

  // get the location scraping from the prompt (we should've designed better)
  let location = "";
  if (USE_API) location = extractLocationString(data?.prompt as string);
  else location = extractLocationString(dummyPrompt);

  const activityCount = itineraryNotNull.activities.length;
  return (
    <>
      <Grid container spacing={1} sx={{ mt: 2, p: 2 }}>
        <Grid item xs={0} md={1} />
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ fontWeight: "600" }}>
            Here's what we've planned.
          </Typography>

          <Typography variant="h3" sx={{ fontWeight: "500" }}>
            <ExploreIcon fontSize="large" />
            {` ${location}`}
          </Typography>

          <Typography sx={{ color: "text.secondary" }}>
            {`${itineraryNotNull.activities[0].startTime} - ${
              itineraryNotNull.activities[activityCount - 1].endTime
            }, ${activityCount} activities`}
          </Typography>
        </Grid>
        {!isMobile && <ActionButtons />}
        <Grid item xs={0} md={1} />
        {isMobile && <ActionButtons />}
        <Grid item xs={0} md={1} />
        <Grid item xs={12} md={10}>
          <hr style={{ alignSelf: "left", color: "white" }} />
        </Grid>
        <Grid item xs={0} md={1} />
      </Grid>
      <ItineraryTimeline itinerary={itinerary as Itinerary} />
    </>
  );
}
