import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#050505" },
    secondary: { main: "#e0e0e0" },
    background: {
      default: "#0b0d0f",
      paper: "#101317"
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#b5b5b5"
    }
  },
  typography: {
    fontFamily: "Inter, 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    button: { textTransform: "none", letterSpacing: 0.4 }
  },
  shape: {
    borderRadius: 10
  }
});

export default theme;
