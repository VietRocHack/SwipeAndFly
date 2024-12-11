// import { common } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#fe5379",
      main: "#FE2858",
      dark: "#b11c3d",
      contrastText: "#fff",
    },
    secondary: {
      light: "#54f3ee",
      main: "#2AF0EA",
      dark: "#1da8a3",
      contrastText: "#000",
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#fe5379",
      main: "#FE2858",
      dark: "#b11c3d",
      contrastText: "#fff",
    },
    secondary: {
      light: "#54f3ee",
      main: "#2AF0EA",
      dark: "#1da8a3",
      contrastText: "#000",
    },
  },
});
// export const lightTheme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: common.black,
//     },
//   },
// });