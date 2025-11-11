import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const navItems = [
  { label: "Login", path: "/login" },
  { label: "Signup", path: "/signup" },
  { label: "Employees", path: "/employees" },
  { label: "Search", path: "/search" }
];

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isAuthed, setIsAuthed] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    setIsAuthed(Boolean(localStorage.getItem("token")));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
    setIsAuthed(false);
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary"
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "#050505",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <Toolbar sx={{ display: "flex", gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, letterSpacing: 2 }}>
            EMPLOYEE MANAGER
          </Typography>
          <Stack direction="row" spacing={1}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{
                  borderBottom:
                    location.pathname === item.path
                      ? "2px solid #e0e0e0"
                      : "2px solid transparent",
                  borderRadius: 0
                }}
              >
                {item.label}
              </Button>
            ))}
            {isAuthed && (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          py: 6,
          background: "linear-gradient(135deg, #050505 0%, #15171b 60%, #111418 100%)",
          minHeight: "calc(100vh - 64px)"
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
}
