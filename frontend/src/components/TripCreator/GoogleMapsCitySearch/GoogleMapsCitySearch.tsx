/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { MainTextMatchedSubstrings, PlaceType } from "../../../utils/types";

// This key was created specifically for the demo in mui.com.
// You need to create a new one for your application.
const MAPS_API_KEY: string = import.meta.env.VITE_MAPS_API_KEY;

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

// google.maps.places.AutocompleteService is deprecated in favor of the
// AutocompleteSuggestion API (https://developers.google.com/maps/documentation/javascript/places-migration-overview).
// AutocompleteSuggestion.fetchAutocompleteSuggestions() is a static method
// with no persistent service instance, but it does want a session token
// reused across one search "session" for billing purposes.
function toPlaceType(suggestion: any): PlaceType {
  const prediction = suggestion.placePrediction;
  const toMatchedSubstrings = (
    matches?: readonly { startOffset: number; endOffset: number }[]
  ): MainTextMatchedSubstrings[] =>
    (matches ?? []).map((match) => ({
      offset: match.startOffset,
      length: match.endOffset - match.startOffset,
    }));

  return {
    terms: [],
    description: prediction.text.text,
    structured_formatting: {
      main_text: prediction.mainText?.text ?? prediction.text.text,
      secondary_text: prediction.secondaryText?.text ?? "",
      main_text_matched_substrings: toMatchedSubstrings(
        prediction.mainText?.matches
      ),
    },
  };
}

interface GoogleMapsCitySearchProps {
  location: PlaceType | null;
  handleLocationChange: (location: PlaceType | null) => unknown;
}

// Define a list of default cities
const defaultCities: PlaceType[] = [
  {
    terms: [],
    description: "New York, NY, USA",
    structured_formatting: {
      main_text: "New York",
      secondary_text: "NY, USA",
    },
  },
  {
    terms: [],
    description: "Paris, France",
    structured_formatting: {
      main_text: "Paris",
      secondary_text: "France",
    },
  },
  {
    terms: [],
    description: "London, England",
    structured_formatting: {
      main_text: "London",
      secondary_text: "England",
    },
  },
  {
    terms: [],
    description: "Los Angeles, CA, USA",
    structured_formatting: {
      main_text: "Los Angeles",
      secondary_text: "CA, USA",
    },
  }
];

export default function GoogleMapsCitySearch({
  location,
  handleLocationChange,
}: GoogleMapsCitySearchProps) {
  const [value, setValue] = useState<PlaceType | null>(location);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly PlaceType[]>([]);
  const loaded = useRef(false);
  const sessionToken = useRef<any>(null);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const fetch = useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly PlaceType[]) => void
        ) => {
          const google = (window as any).google;
          if (!sessionToken.current) {
            sessionToken.current = new google.maps.places.AutocompleteSessionToken();
          }
          google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            {
              input: request.input,
              // Closest new-API equivalent to the legacy "(cities)" type
              // collection, per the migration guide's types table.
              includedPrimaryTypes: ["locality", "administrative_area_level_3"],
              sessionToken: sessionToken.current,
            }
          ).then(({ suggestions }: { suggestions: any[] }) => {
            callback(suggestions.map(toPlaceType));
          });
        },
        400
      ),
    []
  );

  useEffect(() => {
    let active = true;

    if (!(window as any).google) {
      return undefined;
    }
    if (inputValue === "") {
      setOptions(value ? [value, ...defaultCities] : defaultCities);
      return undefined;
    }

    fetch(
      { input: inputValue },
      (results?: readonly PlaceType[]) => {
        if (active) {
          let newOptions: readonly PlaceType[] = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  useEffect(() => {
    // Ensure the default cities are set initially
    if (inputValue === "") {
      setOptions(defaultCities);
    }
  }, [inputValue]);

  return (
    <Autocomplete
      id="location"
      fullWidth
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(_event: any, newValue: PlaceType | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        handleLocationChange(newValue);
        // Selecting a place ends this autocomplete session - start a new
        // session token for the next search.
        sessionToken.current = null;
      }}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          fullWidth
          placeholder="Hanoi, Vietnam"
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [
            match.offset,
            match.offset + match.length,
          ])
        );
        return (
          <li key={key} {...optionProps}>
            <Grid container sx={{ alignItems: "center" }}>
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
