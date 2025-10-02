import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565c0", // Deep blue
      light: "#42a5f5",
      dark: "#0d47a1",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1976d2", // Material blue
      light: "#63a4ff",
      dark: "#004ba0",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8faff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#616161",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#1565c0",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      color: "#1565c0",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "#1976d2",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(21, 101, 192, 0.1)",
          border: "1px solid rgba(21, 101, 192, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1565c0",
          boxShadow: "0 2px 10px rgba(21, 101, 192, 0.1)",
        },
      },
    },
  },
});

export default theme;
