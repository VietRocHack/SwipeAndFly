import React, { ChangeEvent, useState } from "react";
import { TextField, Button, Box, Container } from "@mui/material";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { useNavigate } from "react-router-dom";
import background from "../../assets/background.jpeg";
import Catchphrase from "./Catchphrase";
import TermsAndConditionsTextLine from "./TermsAndConditions";

const HomeScreen: React.FC = () => {
  const [textInput, setTextInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  /**
   * handle khi nhập url vào cái form field
   * @param event 
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextInput(event.target.value);
  };

  const handleButtonClick = () => {
    const fetchData = async (textInput: string) => {
      setLoading(true);
      const newTextInput = textInput.replace(/ /g, "+");

      try {
        const response = await fetch(
          `/api/generate_itinerary?prompt=${newTextInput}`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const result = await response.json();
          navigate("/plan", { state: { result } });
        } else {
          console.error(
            "Failed to fetch data. Response status:",
            response.status
          );
        }
      } catch (error) {
        console.log("ERROR: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(textInput);
  };

  return (
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "200vh",
          width: "100vw",
          flexGrow: 1,
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          //backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backgroundPosition: 'center',
          "@media (max-width: 600px)": {
            padding: "0 10px",
          },
        }}
      >
        {loading ? (
          <LoadingScreen />
        ) : (
          <Container>
            <Catchphrase/>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                margin: 0,
                padding: 0,
                marginTop: { xs: 20, sm: 10, md: 5, lg: 2 },
                textAlign: "left",
                direction: "column",
              }}
            >
              {/* Describe vacation input field */}
              <TextField
                fullWidth
                label="Describe your dream vacation..."
                id="search-bar"
                variant="outlined"
                onChange={handleChange}
                InputProps={{
                  style: { width: "auto" },
                  sx: {
                    color: 'white', // Text color
                    backgroundColor: 'rgba(128, 128, 128, 0.5)', // Grey with transparency
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white', // Border color when not focused
                      },
                      '&:hover fieldset': {
                        borderColor: 'white', // Border color when hovered
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white', // Border color when focused
                      },
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: 'white', // Label color
                    '&.Mui-focused': {
                      color: 'white', // Label color when focused
                    },
                  },
                }}
                sx={{
                  marginBottom: { xs: 2, sm: 2 },
                  width: {
                    xs: 300,
                    sm: "calc(100% - 42px)",
                    md: 672,
                    lg: 810,
                    xl: 925,
                  },
                  '& .MuiInputBase-input': {
                    color: 'white', // Text color inside the input
                  },
                }}
              />

              <TermsAndConditionsTextLine/>

              <Button
                variant="outlined"
                onClick={handleButtonClick}
                sx={{
                  marginTop: { xs: 1, sm: 2 },
                  width: "240px",
                  height: "50px",
                  padding: "17px 32px",
                  border: "2px solid #FE285880",
                  borderRadius: "4px",
                  color: "transparent",
                  background: `linear-gradient(225deg, #00F5FE, #EEF0F2, #FF3E85)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  "&:hover": {
                    backgroundColor: "#0A0A0A",
                    borderColor: "#2AF0EA80",
                    boxShadow: "0px 0px 0px 2px #2AF0EA80",
                  },
                  "&:active": {
                    boxShadow: "inset 0px 0px 0px 2px #FE285880",
                  },
                }}
              >
                Generate Travel
              </Button>
            </Box>
          </Container>
        )}
      </Box>
  );
};

export default HomeScreen;