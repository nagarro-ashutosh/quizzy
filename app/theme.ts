"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
  },
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#ccc",
          "&.Mui-checked": {
            color: "#6b8f3f",
          },
        },
      },
    },
  },
  palette: {
    secondary: {
      main: "#6b8f3f",
    },
    background: {
      default: "#f4f6f9",
      paper: "#ffffff",
    },
  },
});

export default theme;
